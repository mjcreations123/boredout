/* ═══════════════════════════════════════════════
   BoredOut API Client
   ─────────────────────────────────────────────
   Backend: Cloudflare Worker + D1. After `wrangler deploy`,
   set the production URL below to your *.workers.dev URL
   (or custom domain). See backend/README.md.
   Local dev: `wrangler dev` serves the Worker on :8787.
═══════════════════════════════════════════════ */

const API_BASE = (() => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'http://localhost:8787';
  }
  return 'https://boredout-api.mottysstudio.workers.dev';
})();

const api = {
  _token: null,

  getToken() {
    if (!this._token) this._token = localStorage.getItem('bo_token');
    return this._token;
  },

  setToken(token) {
    this._token = token;
    if (token) localStorage.setItem('bo_token', token);
    else localStorage.removeItem('bo_token');
  },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this.getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(API_BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      const e = new Error(err.error || 'Request failed');
      e.status = res.status;
      throw e;
    }
    return res.json();
  },

  get(path)          { return this.request('GET', path); },
  post(path, body)   { return this.request('POST', path, body); },
  patch(path, body)  { return this.request('PATCH', path, body); },
  del(path)          { return this.request('DELETE', path); },

  /* ── Auth ── */
  async login(email, password) {
    const data = await this.post('/api/auth/login', { email, password });
    this.setToken(data.token);
    this.cache.user = data.user;
    return data.user;
  },

  async signup(payload) {
    const data = await this.post('/api/auth/signup', payload);
    this.setToken(data.token);
    this.cache.user = data.user;
    return data.user;
  },

  logout() {
    this.setToken(null);
    this.cache = { ...this._emptyCache() };
  },

  async getMe() {
    const user = await this.get('/api/auth/me');
    this.cache.user = user;
    return user;
  },

  /* ── Users / People ── */
  async loadPeople() {
    const users = await this.get('/api/users');
    this.cache.people = users;
    return users;
  },

  async getUserById(id) {
    return this.get('/api/users/' + id);
  },

  /* ── Activities ── */
  async loadActivities() {
    const acts = await this.get('/api/activities');
    this.cache.activities = acts;
    this.cache.joined = new Set(acts.filter(a => a.joined).map(a => a.id));
    this.cache.ratings = acts.filter(a => a.myRating > 0).map(a => ({ id: a.id, rating: a.myRating }));
    return acts;
  },

  async joinActivity(id) {
    const res = await this.post('/api/activities/' + id + '/join');
    if (res.joined) this.cache.joined.add(id);
    else this.cache.joined.delete(id);
    return res;
  },

  async rateActivity(id, rating) {
    const res = await this.post('/api/activities/' + id + '/rate', { rating });
    const existing = this.cache.ratings.find(r => r.id === id);
    if (existing) existing.rating = rating;
    else this.cache.ratings.push({ id, rating });
    return res;
  },

  /* ── Plans ── */
  async loadPlans() {
    const plans = await this.get('/api/plans');
    this.cache.plans = plans;
    return plans;
  },

  async createPlan(data) {
    const plan = await this.post('/api/plans', data);
    this.cache.plans.unshift(plan);
    return plan;
  },

  async updatePlan(id, data) {
    const plan = await this.patch('/api/plans/' + id, data);
    const idx = this.cache.plans.findIndex(p => p.id === id);
    if (idx >= 0) this.cache.plans[idx] = plan;
    return plan;
  },

  async deletePlan(id) {
    await this.del('/api/plans/' + id);
    this.cache.plans = this.cache.plans.filter(p => p.id !== id);
  },

  /* ── Friends ── */
  async loadFriends() {
    const [friends, requests] = await Promise.all([
      this.get('/api/friends'),
      this.get('/api/friends/requests'),
    ]);
    this.cache.friends = friends;
    this.cache.requests = requests;
    return { friends, requests };
  },

  async sendFriendRequest(userId) {
    return this.post('/api/friends/request/' + userId);
  },

  async cancelFriendRequest(userId) {
    return this.del('/api/friends/request/' + userId);
  },

  async acceptFriendRequest(userId) {
    const res = await this.post('/api/friends/accept/' + userId);
    this.cache.requests = this.cache.requests.filter(r => r.id !== userId);
    if (res.friend) this.cache.friends.push(res.friend);
    return res;
  },

  async declineFriendRequest(userId) {
    await this.post('/api/friends/decline/' + userId);
    this.cache.requests = this.cache.requests.filter(r => r.id !== userId);
  },

  async unfriend(userId) {
    await this.del('/api/friends/' + userId);
    this.cache.friends = this.cache.friends.filter(f => f.id !== userId);
  },

  /* ── Messages ── */
  async getMessages(userId) {
    return this.get('/api/messages/' + userId);
  },

  async pollMessages(userId, after) {
    return this.get('/api/messages/' + userId + '/poll?after=' + encodeURIComponent(after));
  },

  async sendMessage(userId, text) {
    return this.post('/api/messages/' + userId, { text });
  },

  /* ── Stats ── */
  async loadStats() {
    const stats = await this.get('/api/stats');
    this.cache.stats = stats;
    return stats;
  },

  async awardXp(amount, reason, statKey) {
    const res = await this.post('/api/stats/xp', { amount, reason, statKey });
    if (this.cache.stats) this.cache.stats.xp = res.xp;
    return res;
  },

  async doCheckin() {
    const res = await this.post('/api/stats/checkin');
    if (res.ok && this.cache.stats) {
      this.cache.stats.streak = res.streak;
    }
    return res;
  },

  async touchStreak() {
    const res = await this.post('/api/stats/streak-touch');
    if (this.cache.stats && res.streak) this.cache.stats.streak = res.streak;
    return res;
  },

  /* ── Notifications ── */
  async loadNotifs() {
    const notifs = await this.get('/api/notifications');
    this.cache.notifs = notifs;
    return notifs;
  },

  async addNotif(text, icon, type) {
    const res = await this.post('/api/notifications', { text, icon, type });
    this.cache.notifs.unshift({ id: res.id, text, icon, type, read: false, time: 'just now' });
    return res;
  },

  async markRead(id) {
    await this.post('/api/notifications/' + id + '/read');
    const n = this.cache.notifs.find(n => String(n.id) === String(id));
    if (n) n.read = true;
  },

  async markAllRead() {
    await this.post('/api/notifications/read-all');
    this.cache.notifs.forEach(n => { n.read = true; });
  },

  /* ── Cache ── */
  _emptyCache() {
    return {
      user: null, people: [], activities: [], plans: [],
      friends: [], requests: [], stats: null, notifs: [],
      joined: new Set(), ratings: [], recent: [],
    };
  },

  cache: null,
};
api.cache = api._emptyCache();
