/* ════════ CONSTANTS ════════ */
const INTERESTS = ['Coffee','Hiking','Gaming','Music','Food','Art','Sports','Movies','Reading','Travel','Fitness','Photography'];
const COLORS = ['#5C7152','#B07D3C','#8A5A6A','#AF553D','#5B6485','#3F7672','#8C6A43','#6B774F'];
const CATEGORIES = [
  {id:'outdoor',icon:'ti-trees',label:'Outdoors',color:'#5C7152'},
  {id:'food',icon:'ti-bowl-spoon',label:'Food',color:'#B07D3C'},
  {id:'arts',icon:'ti-palette',label:'Arts',color:'#8A5A6A'},
  {id:'sports',icon:'ti-run',label:'Sports',color:'#AF553D'},
  {id:'games',icon:'ti-device-gamepad-2',label:'Games',color:'#5B6485'},
  {id:'music',icon:'ti-music',label:'Music',color:'#3F7672'},
  {id:'movies',icon:'ti-movie',label:'Movies',color:'#8C6A43'},
  {id:'social',icon:'ti-users',label:'Social',color:'#6B774F'},
];
const CAT_COLORS = {outdoor:'#5C7152',food:'#B07D3C',arts:'#8A5A6A',sports:'#AF553D',games:'#5B6485',music:'#3F7672',movies:'#8C6A43',social:'#6B774F'};
const CAT_ICONS  = {outdoor:'ti-trees',food:'ti-bowl-spoon',arts:'ti-palette',sports:'ti-run',games:'ti-device-gamepad-2',music:'ti-music',movies:'ti-movie',social:'ti-users'};
const CAT_INTERESTS = {
  outdoor:['Hiking','Travel','Fitness','Photography'], food:['Coffee','Food'], arts:['Art','Photography','Reading'],
  sports:['Sports','Fitness'], games:['Gaming'], music:['Music'], movies:['Movies'], social:['Coffee','Food','Gaming','Reading'],
};
const DAYPART_CATS = {
  morning:['outdoor','food','sports'], afternoon:['arts','social','sports','outdoor'],
  evening:['food','games','music','movies','social'], night:['games','movies','social'],
};
const MOOD_CATS = { active:['outdoor','sports'], chill:['movies','music','arts'], social:['social','games'], eat:['food'] };
const CHAT_EMOJI = ['😀','😂','😍','👍','🔥','🎉','☕','🙌','😎','❤️'];
const BADGES = [
  {id:'first-join',icon:'ti-target-arrow',name:'First move',desc:'Join an activity',check:s=>s.joins>=1},
  {id:'explorer',icon:'ti-map-2',name:'Explorer',desc:'Join 5 activities',check:s=>s.joins>=5},
  {id:'social',icon:'ti-friends',name:'Social butterfly',desc:'Make 3 friends',check:s=>s.friends_count>=3},
  {id:'planner',icon:'ti-calendar-event',name:'Mastermind',desc:'Create 3 plans',check:s=>s.plans_count>=3},
  {id:'critic',icon:'ti-star',name:'Critic',desc:'Rate 3 activities',check:s=>s.rates>=3},
  {id:'chatter',icon:'ti-message-2',name:'Chatterbox',desc:'Send 10 messages',check:s=>s.msgs>=10},
  {id:'streak3',icon:'ti-flame',name:'On fire',desc:'3-day streak',check:s=>s.streak>=3},
  {id:'curebored',icon:'ti-sparkles',name:'Spontaneous',desc:'Use Surprise me 5 times',check:s=>s.bored_uses>=5},
  {id:'level5',icon:'ti-crown',name:'Local legend',desc:'Reach level 5',check:s=>levelFromXp(s.xp)>=5},
];
const XP = {join:20, friend:30, plan:25, rate:10, msg:5, bored:15, checkin:5};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/* ════════ STATE ════════ */
let currentUser = null;
let toastTimer = null;
let authBusy = false;
let pendingLevelUp = null;
let swipeTimer = null;
let spinTimer = null;
let chatPollTimer = null;
let chatLastAt = null;

/* ════════ LOCAL STORAGE (non-user-specific) ════════ */
const ls = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
function getRecent() { return ls.get('bo_recent') || []; }
function pushRecent(id) {
  let ids = getRecent().filter(x => x !== id);
  ids.unshift(id);
  ls.set('bo_recent', ids.slice(0, 6));
}

/* ════════ HELPERS ════════ */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function dayPart() {
  const h = new Date().getHours();
  return h<12 ? 'morning' : h<17 ? 'afternoon' : h<21 ? 'evening' : 'night';
}
function levelFromXp(xp) { return Math.floor(Math.sqrt((xp||0)/60))+1; }
function xpForLevel(lvl) { return 60*(lvl-1)*(lvl-1); }
function personById(id) { return api.cache.people.find(p => p.id === id); }

/* ════════ GAMIFICATION ════════ */
function checkBadges() {
  const s = api.cache.stats;
  if (!s) return;
  const earned = new Set(s.badges || []);
  const newBadges = [];
  BADGES.forEach(b => {
    if (!earned.has(b.id) && b.check(s)) { earned.add(b.id); newBadges.push(b.id); }
  });
  if (!newBadges.length) return;
  s.badges = [...earned];
  newBadges.forEach((badgeId, i) => {
    const b = BADGES.find(x => x.id === badgeId);
    if (!b) return;
    setTimeout(() => {
      confetti();
      showToast(`Badge earned — ${b.name}`, 'achievement', 'ti-award');
      api.addNotif(`Badge earned: ${b.name} — ${b.desc}`, 'ti-award', 'warn').catch(() => {});
    }, 400 + i * 600);
  });
  // Persist earned badges so they survive a reload.
  api.post('/api/stats/badges', { badges: s.badges }).catch(() => {});
}

async function awardXp(amount, statKey, reason) {
  const s = api.cache.stats;
  const oldXp = s ? s.xp : 0;
  // Optimistic update
  if (s) {
    s.xp += amount;
    if (statKey) s[statKey] = (s[statKey] || 0) + 1;
    s.xp_log = s.xp_log || [];
    s.xp_log.unshift({ amount, reason: reason || 'Earned XP' });
    s.xp_log = s.xp_log.slice(0, 20);
  }
  floatXp('+' + amount + ' XP');
  const newLevel = levelFromXp(oldXp + amount);
  if (newLevel > levelFromXp(oldXp)) {
    confetti();
    showLevelUp(newLevel);
    api.addNotif(`You reached level ${newLevel}`, 'ti-crown', 'warn').catch(() => {});
  }
  updateLevelChip();
  checkBadges();
  // Background persist
  api.awardXp(amount, reason || 'Earned XP', statKey).catch(() => {});
}

function handleXpFromServer(amount, newXpTotal) {
  const s = api.cache.stats;
  if (!s) return;
  const oldXp = newXpTotal - amount;
  s.xp = newXpTotal;
  floatXp('+' + amount + ' XP');
  if (levelFromXp(newXpTotal) > levelFromXp(oldXp)) {
    confetti();
    showLevelUp(levelFromXp(newXpTotal));
    api.addNotif(`You reached level ${levelFromXp(newXpTotal)}`, 'ti-crown', 'warn').catch(() => {});
  }
  updateLevelChip();
  checkBadges();
}

function updateLevelChip() {
  const s = api.cache.stats;
  const chip = document.getElementById('level-chip');
  if (chip && s) {
    chip.innerHTML = `<i class="ti ti-star-filled" style="font-size:13px"></i> Lv ${levelFromXp(s.xp)} <span class="streak-flame"><i class="ti ti-flame" style="font-size:12px;vertical-align:-1px"></i> ${s.streak}</span>`;
  }
}

function floatXp(text) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = text;
  el.style.left = (30 + Math.random()*40) + '%';
  el.style.top = '55%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1300);
}

function confetti() {
  const colors = ['#BB502E','#B07D3C','#5C7152','#8A5A6A','#3F7672','#C99A5B'];
  for (let i = 0; i < 44; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti-bit';
    bit.style.left = Math.random()*100 + 'vw';
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = (Math.random()*0.5) + 's';
    bit.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 3000);
  }
}

function showLevelUp(level) {
  if (trapOverlay) { pendingLevelUp = Math.max(pendingLevelUp || 0, level); return; }
  const card = document.getElementById('levelup-card');
  card.innerHTML = `
    <div class="levelup-burst"><i class="ti ti-star-filled"></i></div>
    <div class="levelup-num">Level ${level}</div>
    <h3>Level up</h3>
    <p>Nice work. Keep exploring to unlock more badges and climb the local leaderboard.</p>
    <button class="btn btn-primary btn-block" onclick="closeLevelUp()">Continue <i class="ti ti-arrow-right"></i></button>`;
  document.getElementById('levelup-overlay').classList.add('open');
  activateModal(document.getElementById('levelup-overlay'));
}
function closeLevelUp() { document.getElementById('levelup-overlay').classList.remove('open'); deactivateModal(); }

async function touchStreak() {
  try {
    const res = await api.touchStreak();
    if (res.changed && res.streak > 1) {
      showToast(`${res.streak}-day streak — keep it going`, 'achievement', 'ti-flame');
    }
    if (res.lostStreak) {
      api.addNotif('Your streak ended. Start a new one today.', 'ti-flame', 'warn').catch(() => {});
    }
    updateLevelChip();
  } catch (_) {}
}

async function dailyCheckin() {
  try {
    const res = await api.doCheckin();
    if (res.ok) {
      const s = api.cache.stats;
      if (s) {
        setTimeout(() => handleXpFromServer(res.xp, s.xp + res.xp), 900);
      }
    }
  } catch (_) {}
}

/* ════════ AUTH ════════ */
let selectedInterests = new Set();

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i) => t.classList.toggle('active', i===(tab==='login'?0:1)));
  document.getElementById('auth-login').style.display = tab==='login' ? 'block' : 'none';
  document.getElementById('auth-signup').style.display = tab==='signup' ? 'block' : 'none';
  renderInterestsPicker();
}

function renderInterestsPicker() {
  const grid = document.getElementById('interests-grid');
  if (grid) grid.innerHTML = INTERESTS.map(i =>
    `<button type="button" class="interest-chip ${selectedInterests.has(i)?'selected':''}" aria-pressed="${selectedInterests.has(i)}" onclick="toggleInterest('${i}')">${i}</button>`
  ).join('');
  updateInterestCount();
}

function updateInterestCount() {
  const el = document.getElementById('interest-count');
  if (!el) return;
  const n = selectedInterests.size;
  el.textContent = n < 2 ? `${n} selected · pick ${2-n} more` : `${n} selected`;
  el.classList.toggle('ok', n >= 2);
}

function toggleInterest(i) {
  selectedInterests.has(i) ? selectedInterests.delete(i) : selectedInterests.add(i);
  renderInterestsPicker();
}

async function doLogin() {
  if (authBusy) return;
  authBusy = true;
  const errEl = document.getElementById('login-error');
  errEl.style.display = 'none';
  try {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass  = document.getElementById('login-password').value;
    if (!email || !pass) { errEl.textContent = 'Please enter your email and password.'; errEl.style.display = 'block'; return; }
    const user = await api.login(email, pass);
    currentUser = user;
    const remember = document.getElementById('remember-me')?.checked;
    if (!remember) {
      // token was set by api.login(); on next session start we'll validate it
    }
    launchApp();
  } catch (e) {
    errEl.textContent = e.message || 'Incorrect email or password.';
    errEl.style.display = 'block';
  } finally {
    authBusy = false;
  }
}

async function doSignup() {
  if (authBusy) return;
  const name  = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass  = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  if (!name || !email || pass.length < 6) { errEl.textContent='Please fill all fields (password min 6 chars).'; errEl.style.display='block'; return; }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { errEl.textContent='Please enter a valid email address.'; errEl.style.display='block'; return; }
  if (selectedInterests.size < 2) { errEl.textContent='Pick at least 2 interests.'; errEl.style.display='block'; return; }
  errEl.style.display = 'none';
  authBusy = true;
  try {
    const user = await api.signup({ name, email, password: pass, interests: [...selectedInterests] });
    currentUser = user;
    launchApp();
    setTimeout(() => {
      confetti();
      showToast(`Welcome to BoredOut, ${name.split(' ')[0]}`, 'achievement', 'ti-sparkles');
      maybeShowTour(true);
    }, 600);
  } catch (e) {
    errEl.textContent = e.message || 'Could not create account.';
    errEl.style.display = 'block';
  } finally {
    authBusy = false;
  }
}

function logout() {
  api.logout();
  currentUser = null;
  clearInterval(chatPollTimer);
  chatPollTimer = null;
  document.getElementById('main-app').style.display = 'none';
  document.getElementById('auth-overlay').style.display = 'flex';
  switchAuthTab('login');
  showToast('Signed out');
}

/* ════════ APP LAUNCH ════════ */
async function launchApp() {
  document.getElementById('auth-overlay').style.display = 'none';
  document.getElementById('main-app').style.display = 'block';
  document.getElementById('app-loading').style.display = 'flex';

  try {
    await Promise.all([
      api.loadActivities(),
      api.loadPlans(),
      api.loadFriends(),
      api.loadStats(),
      api.loadNotifs(),
      api.loadPeople(),
    ]);
  } catch (e) {
    console.error('Failed to load app data:', e);
    showToast('Could not reach server — check your connection', null, 'ti-wifi-off');
  }

  document.getElementById('app-loading').style.display = 'none';

  touchStreak();
  dailyCheckin();
  updateNavAvatar();
  updateLevelChip();
  applyHeroVibe();
  updateGreeting();
  showCachedWeather();
  detectLocation(false);
  renderChatEmojiBar();
  renderDiscover();
  renderPeoplePills();
  renderPlans();
  updateReqBadges();
  updateNotifBadge();
  startLivePresence();
  maybeShowTour(false);
  handleDeepLink();
  if (deferredInstall && !ls.get('bo_install_dismissed')) {
    document.getElementById('install-banner').classList.add('show');
  }
}

function updateReqBadges() {
  const n = (api.cache.requests || []).filter(r => !r.from_me).length;
  const badge = document.getElementById('req-count-badge');
  const bnav  = document.getElementById('bnav-req-badge');
  if (n) { badge.textContent=n; badge.style.display='inline'; bnav.textContent=n; bnav.style.display='flex'; }
  else   { badge.style.display='none'; bnav.style.display='none'; }
}

function updateNavAvatar() {
  const btn = document.getElementById('nav-avatar');
  if (!btn || !currentUser) return;
  btn.textContent = currentUser.initials;
  btn.style.background = currentUser.color;
}

function updateGreeting() {
  const name = (currentUser?.name || '').split(' ')[0];
  const heads = {
    morning:'What do you want to do today?',
    afternoon:'What do you want to do today?',
    evening:'What do you want to do tonight?',
    night:'Still looking for something to do?',
  };
  const subs = {
    morning:`Good morning${name?', '+name:''} — here's what's happening near you.`,
    afternoon:`Good afternoon${name?', '+name:''} — here's what's happening near you.`,
    evening:`Good evening${name?', '+name:''} — here's what's around tonight.`,
    night:`It's late${name?', '+name:''}, but there's still plenty nearby.`,
  };
  document.getElementById('hero-greeting').textContent = heads[dayPart()];
  document.getElementById('hero-sub').textContent = subs[dayPart()];
}

function applyHeroVibe() {
  // The hero surface is owned by CSS (--ink-panel); clear any legacy inline background.
  const hero = document.getElementById('hero');
  if (hero) hero.style.background = '';
}

/* ════════ LOCATION & WEATHER ════════ */
function detectLocation(manual) {
  const input = document.getElementById('location-input');
  const saved = ls.get('bo_location');
  const coords = ls.get('bo_coords');
  if (saved && !manual) {
    input.value = saved;
    if (coords) fetchWeather(coords.lat, coords.lon); else showCachedWeather();
    return;
  }
  if (!navigator.geolocation) { input.value = saved || 'New York, NY'; return; }
  input.value = 'Detecting…';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const {latitude: lat, longitude: lon} = pos.coords;
      ls.set('bo_coords', {lat, lon});
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(r => r.json())
        .then(d => {
          const a = d.address || {};
          const city = a.city||a.town||a.village||a.county||'Your area';
          const state = a.state_code||a.state||'';
          input.value = state ? `${city}, ${state}` : city;
          ls.set('bo_location', input.value);
          if (manual) showToast(`Location set to ${input.value}`);
        }).catch(() => { input.value = saved || 'New York, NY'; });
      fetchWeather(lat, lon);
    },
    () => { input.value = saved || 'New York, NY'; if (manual) showToast('Could not get your location — type your city instead'); }
  );
}

const WMO_CODES = {0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',80:'Rain showers',81:'Heavy showers',82:'Violent showers',95:'Thunderstorm',96:'Thunderstorm w/ hail'};
const WMO_ICON  = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️'};

function paintWeather(w) {
  const bar = document.getElementById('weather-bar');
  if (!bar || !w) return;
  document.getElementById('weather-icon').textContent = w.icon;
  document.getElementById('weather-temp').textContent = `${w.temp}°F`;
  document.getElementById('weather-desc').textContent = w.desc;
  document.getElementById('weather-tip').textContent = w.tip || '';
  bar.style.display = 'flex';
}

function getFreshWeather() {
  const w = ls.get('bo_weather');
  if (!w) return null;
  if (w.fetchedAt && (Date.now() - w.fetchedAt) > 7200000) return null;
  return w;
}
function showCachedWeather() { paintWeather(getFreshWeather()); }

function fetchWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph`)
    .then(r => r.json())
    .then(d => {
      const c = d.current; if (!c) return;
      const code = c.weathercode, temp = Math.round(c.temperature_2m);
      const isRainy = [51,53,55,61,63,65,80,81,82,95,96].includes(code);
      const tip = isRainy ? 'Rainy — great day for indoor activities' :
                  temp<40 ? 'Bundle up if you head outside.' :
                  temp>90 ? 'Hot out — stay hydrated.' : 'Good weather to get outside.';
      const w = {code, temp, desc: WMO_CODES[code]||'Weather', icon: WMO_ICON[code]||'🌡️', isRainy, isCold: temp<40, isHot: temp>90, tip, fetchedAt: Date.now()};
      ls.set('bo_weather', w);
      paintWeather(w);
      if (document.getElementById('page-discover').classList.contains('active')) renderForYou();
    }).catch(() => {});
}

/* ════════ SUGGESTION ENGINE ════════ */
function getActivities() { return api.cache.activities || []; }

function scoreActivity(a) {
  let score = Math.random()*2;
  const myInterests = currentUser?.interests || [];
  const overlap = (CAT_INTERESTS[a.cat]||[]).filter(i => myInterests.includes(i)).length;
  score += overlap * 3;
  if ((DAYPART_CATS[dayPart()]||[]).includes(a.cat)) score += 2;
  if (a.cost === 'Free') score += 0.5;
  const wx = getFreshWeather();
  if (wx) {
    if (wx.isRainy && a.cat === 'outdoor') score -= 4;
    if (!wx.isRainy && a.cat === 'outdoor') score += 1.5;
    if (wx.isCold && ['outdoor','sports'].includes(a.cat)) score -= 1;
  }
  return score;
}

function matchPercent(a) {
  const myInterests = currentUser?.interests || [];
  const overlap = (CAT_INTERESTS[a.cat]||[]).filter(i => myInterests.includes(i)).length;
  let pct = 62 + overlap*11;
  if ((DAYPART_CATS[dayPart()]||[]).includes(a.cat)) pct += 8;
  return Math.min(99, pct + (a.id*7)%5);
}

let lastSuggestId = null;
function pickSuggestion() {
  const acts = getActivities();
  const joined = api.cache.joined;
  let pool = acts.filter(a => !joined.has(a.id) && a.id !== lastSuggestId);
  if (!pool.length) pool = acts.filter(a => a.id !== lastSuggestId);
  if (!pool.length) pool = [...acts];
  pool.sort((x,y) => scoreActivity(y) - scoreActivity(x));
  const top = pool.slice(0, Math.min(3, pool.length));
  const pick = top[Math.floor(Math.random()*top.length)];
  lastSuggestId = pick?.id;
  return pick;
}

function whyText(a) {
  const myInterests = currentUser?.interests || [];
  const overlap = (CAT_INTERESTS[a.cat]||[]).filter(i => myInterests.includes(i));
  const wx = getFreshWeather();
  if (wx && wx.isRainy && a.cat !== 'outdoor') return 'Indoor pick — it\'s wet out there';
  if (overlap.length) return `Because you're into ${overlap[0].toLowerCase()}`;
  if ((DAYPART_CATS[dayPart()]||[]).includes(a.cat)) return `Perfect for ${dayPart()==='night'?'late night':'the '+dayPart()}`;
  if (a.cost === 'Free') return 'Because it\'s free';
  return 'Something new to try';
}

async function openBored() {
  document.getElementById('bored-overlay').classList.add('open');
  activateModal(document.getElementById('bored-overlay'));
  awardXp(XP.bored, 'bored_uses', 'Used Surprise me');
  spinSuggestion();
}

function spinSuggestion() {
  const card = document.getElementById('suggest-card');
  card.classList.add('shuffling');
  clearTimeout(spinTimer);
  card.innerHTML = `<div class="suggest-emoji"><i class="ti ti-dice-5"></i></div><h3>Finding something nearby…</h3>`;
  spinTimer = setTimeout(() => {
    card.classList.remove('shuffling');
    const a = pickSuggestion();
    if (!a) { card.innerHTML = '<div class="suggest-emoji"><i class="ti ti-map-search"></i></div><h3>Nothing to suggest yet</h3><p>Check back a little later.</p>'; return; }
    card.innerHTML = `
      <div class="suggest-emoji">${a.emoji}</div>
      <h3>${a.title}</h3>
      <div class="suggest-meta"><i class="ti ti-map-pin"></i> ${a.location} · ${a.dist} · ${a.cost}</div>
      <div class="suggest-why"><i class="ti ti-sparkles" style="font-size:12px"></i> ${whyText(a)}</div>
      <div class="suggest-actions">
        <button class="btn btn-outline" onclick="spinSuggestion()"><i class="ti ti-refresh"></i> Next</button>
        <button class="btn btn-accent" onclick="acceptSuggestion(${a.id})"><i class="ti ti-check"></i> I'm in</button>
      </div>`;
  }, 900);
}

async function acceptSuggestion(id) {
  const a = getActivities().find(x => x.id === id);
  if (!a) return;
  if (!api.cache.joined.has(id)) {
    const res = await api.joinActivity(id).catch(() => null);
    if (res?.xp) handleXpFromServer(res.xp, (api.cache.stats?.xp||0));
  }
  if (api.cache.plans.some(p => p.title === a.title && p.location === a.location)) {
    closeBored();
    showToast(`"${a.title}" is already in your plans`);
    renderActivities();
    return;
  }
  const d = new Date();
  try {
    const plan = await api.createPlan({
      title: a.title, cat: a.cat,
      month: MONTHS[d.getMonth()], day: String(d.getDate()),
      time: ['Anytime','Flexible'].includes(a.time) ? 'Today' : a.time,
      location: a.location, people: [],
    });
    if (plan.xp) handleXpFromServer(plan.xp, api.cache.stats?.xp || 0);
  } catch (_) {}
  closeBored();
  showToast(`Added "${a.title}" to your plans`, 'achievement', 'ti-calendar-plus');
  api.addNotif(`You're doing ${a.title} today`, 'ti-calendar-check', 'good').catch(() => {});
  renderActivities();
  renderPlans();
}

function closeBored() { document.getElementById('bored-overlay').classList.remove('open'); deactivateModal(); }

/* ════════ DISCOVER ════════ */
let activeCategory = null;
let activeFilter   = 'all';
let activeMood     = null;

function renderDiscover() {
  renderForYou();
  renderRecent();
  renderMoodChips();
  renderCategories();
  renderFilters();
  renderActivities();
}

function renderForYou() {
  const acts = getActivities();
  const sorted = [...acts].sort((x,y) => scoreActivity(y)-scoreActivity(x)).slice(0,6);
  document.getElementById('foryou-row').innerHTML = sorted.map(a => `
    <div class="foryou-card" onclick="openDetail(${a.id})">
      <div class="foryou-img" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}<span class="match-pill">${matchPercent(a)}% match</span></div>
      <div class="foryou-body"><h4>${a.title}</h4><span><i class="ti ti-map-pin" style="font-size:11px"></i> ${a.dist} · ${a.cost}</span></div>
    </div>`).join('');
}

function renderRecent() {
  const ids = getRecent();
  const section = document.getElementById('recent-section');
  const acts = ids.map(id => getActivities().find(a => a.id === id)).filter(Boolean);
  if (!acts.length) { section.style.display = 'none'; return; }
  section.style.display = 'block';
  document.getElementById('recent-row').innerHTML = acts.map(a => `
    <div class="foryou-card" onclick="openDetail(${a.id})">
      <div class="foryou-img" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}</div>
      <div class="foryou-body"><h4>${a.title}</h4><span><i class="ti ti-map-pin" style="font-size:11px"></i> ${a.dist} · ${a.cost}</span></div>
    </div>`).join('');
}

function renderMoodChips() {
  document.querySelectorAll('#mood-row .mood-chip').forEach(c => c.classList.toggle('active', c.dataset.mood === activeMood));
}
function setMood(m) {
  activeMood = activeMood === m ? null : m;
  renderMoodChips();
  renderActivities();
  const title = document.getElementById('activities-title');
  title.textContent = activeMood ? `Things to ${m==='eat'?'eat':m==='social'?'meet people':m} near you`
    : (activeCategory ? CATEGORIES.find(c=>c.id===activeCategory).label+' near you' : 'All activities near you');
}

function renderCategories() {
  document.getElementById('cat-grid').innerHTML = CATEGORIES.map(c =>
    `<div class="cat-card ${activeCategory===c.id?'active':''}" onclick="selectCategory('${c.id}')">
      <div class="cat-icon" style="${activeCategory===c.id?`background:${c.color};color:white`:''}"><i class="ti ${c.icon}" aria-hidden="true"></i></div>
      <span class="cat-label">${c.label}</span>
    </div>`).join('');
}

function selectCategory(id) {
  activeCategory = activeCategory === id ? null : id;
  if (activeCategory) activeMood = null;
  renderMoodChips();
  renderCategories();
  renderActivities();
  document.getElementById('activities-title').textContent = activeCategory ? CATEGORIES.find(c=>c.id===activeCategory).label+' near you' : 'All activities near you';
}

function renderFilters() {
  const row = document.getElementById('filter-row');
  row.innerHTML = '';
  [['all','All'],['free','Free'],['tonight','Tonight'],['popular','Popular']].forEach(([f,label]) => {
    const el = document.createElement('button');
    el.className = 'filter-pill' + (activeFilter===f?' active':'');
    el.textContent = label;
    el.onclick = () => { activeFilter=f; row.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active')); el.classList.add('active'); renderActivities(); };
    row.appendChild(el);
  });
}

function isTonight(a) {
  const t = a.time;
  if (['Anytime','Flexible','All day'].includes(t)) return true;
  if (/Until/i.test(t)) return true;
  const m = t.match(/(\d{1,2})/);
  if (!m) return false;
  let h = parseInt(m[1], 10);
  if (/PM/i.test(t) && h<12) h += 12;
  if (/AM/i.test(t) && h===12) h = 0;
  return h >= 17;
}

function activityRating(a) {
  const r = api.cache.ratings.find(x => x.id === a.id);
  const base = { avg: (3+(a.id*13%20)/10).toFixed(1), count: Math.floor(a.going/3)+2, mine: 0 };
  return r ? { ...base, mine: r.rating } : base;
}

function friendsGoing(a) {
  const friends = api.cache.friends || [];
  return friends.filter(f => ((f.name.length * 7 + a.id * 3) % 4) === 0).slice(0, 3);
}

function whenLabel(a) {
  if (['Anytime','Flexible','All day'].includes(a.time)) return a.time;
  return (isTonight(a) ? 'Tonight · ' : 'Today · ') + a.time;
}

function renderActivities() {
  let acts = [...getActivities()];
  const search = (document.getElementById('activity-search')?.value||'').trim().toLowerCase();
  if (activeCategory) acts = acts.filter(a => a.cat === activeCategory);
  if (activeMood) acts = acts.filter(a => (MOOD_CATS[activeMood]||[]).includes(a.cat));
  if (activeFilter === 'free') acts = acts.filter(a => a.cost === 'Free');
  if (activeFilter === 'tonight') acts = acts.filter(isTonight);
  if (activeFilter === 'popular') acts = acts.filter(a => a.going >= 20);
  if (search) acts = acts.filter(a => a.title.toLowerCase().includes(search)||a.location.toLowerCase().includes(search)||(a.desc||'').toLowerCase().includes(search));
  const joined = api.cache.joined;
  const avColors = ['#5C7152','#B07D3C','#8A5A6A','#AF553D','#5B6485'];
  const avInits  = ['MJ','TK','AS','RL','PD'];
  const grid = document.getElementById('activity-grid');
  if (!acts.length) {
    grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><i class="ti ti-mood-sad"></i><p>No activities found. Try a different filter or search.</p>
      <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="clearActivityFilters()"><i class="ti ti-x"></i> Clear filters</button></div>`;
    return;
  }
  grid.innerHTML = acts.map(a => {
    const isJoined = joined.has(a.id);
    const r = activityRating(a);
    const stack = Array.from({length:Math.min(3,Math.floor(a.going/4))},(_,i)=>`<div class="av" style="background:${avColors[i%5]}">${avInits[i]}</div>`).join('');
    const stars = [1,2,3,4,5].map(s=>`<button type="button" class="star ${s<=r.mine?'filled':''}" onclick="rateActivity(${a.id},${s},event)" aria-label="Rate ${s} stars">★</button>`).join('');
    const fg = friendsGoing(a);
    const fgLabel = fg.length ? `<div class="friends-going"><i class="ti ti-friends"></i> ${fg.map(f=>escapeHtml(f.name.split(' ')[0])).join(', ')} going</div>` : '';
    return `<div class="activity-card" onclick="openDetail(${a.id})">
      <div class="activity-img" style="background:${CAT_COLORS[a.cat]}22">
        <span>${a.emoji}</span>
        ${a.badge?`<span class="activity-badge ${a.badge}">${a.badge==='free'?'Free':'Popular'}</span>`:''}
        <span class="when-chip">${whenLabel(a)}</span>
      </div>
      <div class="activity-body">
        <h3>${a.title}</h3>
        <div class="activity-meta">
          <span class="meta-item"><i class="ti ti-map-pin" aria-hidden="true"></i>${a.location}</span>
          <span class="meta-item"><i class="ti ti-walk" aria-hidden="true"></i>${a.dist}</span>
        </div>
        <div class="rating-row" onclick="event.stopPropagation()">
          <div class="stars">${stars}</div>
          <span class="rating-count">${parseFloat(r.avg).toFixed(1)} (${r.count})</span>
        </div>
        ${fgLabel}
        <div class="activity-foot">
          <div style="display:flex;align-items:center;gap:7px">
            <div class="avatar-stack">${stack}</div>
            <span style="font-size:12px;color:var(--text-muted)">${a.going+(isJoined?1:0)} going</span>
          </div>
          <button class="btn btn-sm ${isJoined?'btn-accent':'btn-primary'}" onclick="event.stopPropagation();joinActivity(${a.id})">
            <i class="ti ${isJoined?'ti-check':'ti-plus'}" aria-hidden="true"></i>${isJoined?'Joined':'I\'m in'}
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function clearActivityFilters() {
  activeCategory=null; activeMood=null; activeFilter='all';
  const s = document.getElementById('activity-search'); if(s) s.value='';
  document.getElementById('activities-title').textContent = 'All activities near you';
  renderMoodChips(); renderCategories(); renderFilters(); renderActivities();
}

async function joinActivity(id) {
  try {
    const res = await api.joinActivity(id);
    const act = getActivities().find(a => a.id === id);
    if (res.joined) {
      showToast(`Joined "${act?.title}"`);
      api.addNotif(`You joined ${act?.title}`, 'ti-calendar-check', 'good').catch(()=>{});
      if (res.xp) handleXpFromServer(res.xp, api.cache.stats?.xp || 0);
    } else {
      showToast('Removed from your activities');
    }
    checkBadges();
  } catch (e) {
    showToast('Could not update — try again');
  }
  renderActivities();
}

async function rateActivity(id, rating, e) {
  if (e) e.stopPropagation();
  try {
    const res = await api.rateActivity(id, rating);
    showToast(`Rated ${rating} star${rating!==1?'s':''}`);
    if (res.xp) handleXpFromServer(res.xp, api.cache.stats?.xp || 0);
    checkBadges();
  } catch (_) {
    showToast('Could not save rating');
  }
  renderActivities();
}

function shuffleActivities() {
  api.cache.activities.sort(() => Math.random()-0.5);
  renderActivities();
  showToast('Shuffled');
}

/* ════════ ACTIVITY DETAIL ════════ */
function openDetail(id) {
  const a = getActivities().find(x => x.id === id);
  if (!a) return;
  pushRecent(id);
  const joined = api.cache.joined.has(id);
  const r = activityRating(a);
  const avColors=['#5C7152','#B07D3C','#8A5A6A','#AF553D','#5B6485'];
  const avInits=['MJ','TK','AS','RL','PD'];
  const stack = Array.from({length:Math.min(5,Math.floor(a.going/3))},(_,i)=>`<div class="av" style="background:${avColors[i%5]};width:28px;height:28px;font-size:10px">${avInits[i%5]}</div>`).join('');
  const fg = friendsGoing(a);
  const fgLine = fg.length ? `<div class="detail-friends"><i class="ti ti-friends"></i> ${fg.map(f=>escapeHtml(f.name.split(' ')[0])).join(', ')} ${fg.length===1?'is':'are'} going</div>` : '';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.location)}`;
  document.getElementById('detail-modal').innerHTML = `
    <div class="modal-header">
      <h2>${a.title}</h2>
      <button class="icon-btn" onclick="closeDetail()" aria-label="Close"><i class="ti ti-x"></i></button>
    </div>
    <div class="detail-hero" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}</div>
    <p class="detail-desc">${a.desc}</p>
    <div class="activity-meta" style="margin-bottom:0.75rem">
      <span class="meta-item"><i class="ti ti-map-pin"></i>${a.location}</span>
      <span class="meta-item"><i class="ti ti-clock"></i>${a.time}</span>
      <span class="meta-item"><i class="ti ti-walk"></i>${a.dist}</span>
      <span class="meta-item"><i class="ti ti-currency-dollar"></i>${a.cost}</span>
      <span class="meta-item"><i class="ti ti-star"></i>${parseFloat(r.avg).toFixed(1)} (${r.count})</span>
    </div>
    ${fgLine}
    <div style="display:flex;align-items:center;gap:10px;margin:0.75rem 0 1.1rem">
      <div class="avatar-stack">${stack}</div>
      <span style="font-size:13px;color:var(--text-muted)">${a.going+(joined?1:0)} people going</span>
    </div>
    <a class="btn btn-outline btn-block" href="${mapsUrl}" target="_blank" rel="noopener" style="margin-bottom:10px"><i class="ti ti-map-2"></i> Get directions</a>
    <div style="display:flex;gap:10px">
      <button class="btn btn-outline" style="flex:1;justify-content:center" onclick="shareActivity(${a.id})"><i class="ti ti-share"></i> Share</button>
      <button class="btn ${joined?'btn-accent':'btn-primary'}" style="flex:2;justify-content:center" onclick="joinActivity(${a.id});openDetail(${a.id})">
        <i class="ti ${joined?'ti-check':'ti-plus'}"></i>${joined?'Joined — tap to leave':'I\'m in!'}
      </button>
    </div>`;
  document.getElementById('detail-overlay').classList.add('open');
  activateModal(document.getElementById('detail-overlay'));
}
function closeDetail() { document.getElementById('detail-overlay').classList.remove('open'); deactivateModal(); }

function shareActivity(id) {
  const a = getActivities().find(x => x.id === id);
  const link = location.origin + location.pathname + '#a=' + id;
  const text = `Hey! Want to join me for "${a.title}" at ${a.location}? Found it on BoredOut: ${link}`;
  if (navigator.share) { navigator.share({title:'BoredOut', text, url:link}).catch(()=>{}); }
  else { navigator.clipboard.writeText(text).then(()=>showToast('Invite copied')).catch(()=>showToast('Could not copy')); }
}

function handleDeepLink() {
  const m = (location.hash||'').match(/a=(\d+)/);
  if (m) {
    const id = parseInt(m[1], 10);
    if (getActivities().some(a => a.id === id)) setTimeout(() => openDetail(id), 400);
    history.replaceState(null,'',location.pathname);
  }
}

/* ════════ PEOPLE ════════ */
let activePeopleFilter = 'all';
let peopleMode = 'browse';
let deckIndex = 0;
let deckPool = [];
let deckHistory = [];

function setPeopleMode(mode) {
  peopleMode = mode;
  document.getElementById('mode-browse').classList.toggle('active', mode==='browse');
  document.getElementById('mode-match').classList.toggle('active', mode==='match');
  document.getElementById('people-browse').style.display = mode==='browse' ? 'block' : 'none';
  document.getElementById('people-match').style.display = mode==='match' ? 'block' : 'none';
  if (mode === 'match') startDeck();
}

function startDeck() {
  const friends  = api.cache.friends || [];
  const requests = api.cache.requests || [];
  deckPool = (api.cache.people || []).filter(p =>
    !friends.some(f => f.id === p.id) && !requests.some(r => r.id === p.id)
  );
  deckIndex = 0;
  deckHistory = [];
  renderDeck();
}

function renderDeck() {
  const wrap = document.getElementById('deck-wrap');
  if (deckIndex >= deckPool.length) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-cards"></i><p>You've seen everyone nearby for now.<br>Check back later for new people.</p>
      <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="startDeck()"><i class="ti ti-refresh"></i> Start over</button></div>`;
    return;
  }
  const p = deckPool[deckIndex];
  const shared = currentUser?.interests || [];
  wrap.innerHTML = `
    <div class="deck-card" id="deck-card">
      ${p.online?'<span class="deck-online"><span class="online-dot-inline"></span> online now</span>':''}
      <div class="deck-avatar" style="background:${p.color}">${p.initials}</div>
      <h3>${escapeHtml(p.name)}</h3>
      <div class="person-sub" style="justify-content:center"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist} away${p.mutual?' · '+p.mutual+' mutual':''}</div>
      <p class="mood">"${escapeHtml(p.mood)}"</p>
      <div class="deck-tags">${(p.interests||[]).map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
    </div>
    <div class="deck-actions">
      <button class="deck-btn deck-skip" onclick="deckSwipe(false)" aria-label="Skip"><i class="ti ti-x"></i></button>
      <button class="deck-btn deck-connect" onclick="deckSwipe(true)" aria-label="Connect"><i class="ti ti-heart"></i></button>
    </div>
    <div class="deck-counter">${deckIndex+1} of ${deckPool.length}
      <button class="deck-undo" id="deck-undo" onclick="undoSwipe()" ${deckHistory.length?'':'disabled'}><i class="ti ti-arrow-back-up"></i> Undo</button>
    </div>
    <div class="deck-hint">Swipe or use ← skip · like →</div>`;
  attachDeckDrag();
}

async function deckSwipe(connect) {
  const card = document.getElementById('deck-card');
  if (!card || card.classList.contains('swipe-right') || card.classList.contains('swipe-left')) return;
  const p = deckPool[deckIndex];
  if (navigator.vibrate) navigator.vibrate(15);
  card.classList.add(connect ? 'swipe-right' : 'swipe-left');
  let wasNew = false;
  if (connect) {
    const alreadySent = (api.cache.requests||[]).find(r => r.id === p.id && r.from_me);
    if (!alreadySent) {
      try {
        await api.sendFriendRequest(p.id);
        api.cache.requests.push({ id: p.id, name: p.name, initials: p.initials, color: p.color, from_me: true, sub: 'Request sent' });
        wasNew = true;
      } catch (_) {}
    }
    showToast(`Request sent to ${p.name}`);
    awardXp(XP.friend, null, 'Sent a connection request');
  }
  deckHistory.push({ index: deckIndex, connected: connect, personId: p.id, wasNew });
  clearTimeout(swipeTimer);
  swipeTimer = setTimeout(() => { swipeTimer=null; deckIndex++; renderDeck(); }, 320);
}

async function undoSwipe() {
  if (!deckHistory.length) return;
  clearTimeout(swipeTimer); swipeTimer = null;
  const last = deckHistory.pop();
  if (last.connected && last.wasNew) {
    api.cancelFriendRequest(last.personId).catch(() => {});
    api.cache.requests = (api.cache.requests||[]).filter(r => !(r.from_me && r.id === last.personId));
  }
  deckIndex = last.index;
  renderDeck();
  showToast('Undone');
}

function attachDeckDrag() {
  const card = document.getElementById('deck-card');
  if (!card) return;
  let startX=0, startY=0, dx=0, dragging=false;
  card.addEventListener('pointerdown', e => { dragging=true; startX=e.clientX; startY=e.clientY; dx=0; card.style.transition='none'; card.setPointerCapture(e.pointerId); });
  card.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = e.clientX-startX;
    const dy = e.clientY-startY;
    card.style.transform = `translate(${dx}px, ${dy*0.2}px) rotate(${dx*0.05}deg)`;
    card.style.opacity = String(Math.max(0.4, 1-Math.abs(dx)/400));
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    card.style.transition = '';
    if (Math.abs(dx) > 90) deckSwipe(dx > 0);
    else { card.style.transform=''; card.style.opacity=''; }
  };
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
}

function renderPeoplePills() {
  const vibes = [['all','All'],['online now','Online now'],['nearby','Nearby'],['new here','New here']];
  document.getElementById('people-filter-row').innerHTML = vibes.map(([v,label]) =>
    `<button class="filter-pill ${activePeopleFilter===v?'active':''}" onclick="setPeopleFilter('${v}',this)">${label}</button>`).join('');
}

function setPeopleFilter(v, el) {
  activePeopleFilter = v;
  document.querySelectorAll('#people-filter-row .filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderPeople();
}

function personActionsHtml(p) {
  const friends  = api.cache.friends || [];
  const requests = api.cache.requests || [];
  const isFriend    = friends.some(f => f.id === p.id);
  const reqSent     = requests.some(r => r.from_me && r.id === p.id);
  const hasIncoming = requests.some(r => !r.from_me && r.id === p.id);
  if (isFriend) {
    return `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openChat('${p.id}','${escapeHtml(p.name)}','${p.initials}','${p.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();planWithPerson('${escapeHtml(p.name)}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>`;
  }
  if (reqSent) {
    return `<button class="btn btn-outline btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();cancelRequest('${p.id}','${escapeHtml(p.name)}')"><i class="ti ti-clock"></i>Requested · cancel</button>`;
  }
  if (hasIncoming) {
    return `<button class="btn btn-accent btn-sm" onclick="event.stopPropagation();acceptRequest('${p.id}','${escapeHtml(p.name)}','${p.initials}','${p.color}')"><i class="ti ti-check" aria-hidden="true"></i>Accept</button>
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();declineRequest('${p.id}','${escapeHtml(p.name)}')"><i class="ti ti-x" aria-hidden="true"></i>Decline</button>`;
  }
  return `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();sendFriendReq('${p.id}','${escapeHtml(p.name)}','${p.initials}','${p.color}')"><i class="ti ti-user-plus" aria-hidden="true"></i>Add</button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();proposeHangout('${escapeHtml(p.name)}')"><i class="ti ti-calendar-event" aria-hidden="true"></i>Hang out</button>`;
}

function renderPeople() {
  const search = (document.getElementById('people-search')?.value||'').toLowerCase();
  let people = [...(api.cache.people||[])];
  if (activePeopleFilter === 'online now') people = people.filter(p => p.online);
  if (activePeopleFilter === 'nearby') people = people.filter(p => parseFloat(p.dist) < 1.5);
  if (activePeopleFilter === 'new here') people = people.filter(p => p.mutual === 0);
  if (search) people = people.filter(p =>
    p.name.toLowerCase().includes(search) ||
    (p.mood||'').toLowerCase().includes(search) ||
    (p.interests||[]).some(t => t.toLowerCase().includes(search))
  );
  const shared = currentUser?.interests || [];
  document.getElementById('people-grid').innerHTML = people.map(p => `
    <div class="person-card" onclick="openPersonProfile('${p.id}')">
      ${p.online?'<div class="online-dot" role="img" aria-label="Online now" title="Online now"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.initials}</div>
        <div><div class="person-name">${escapeHtml(p.name)}</div><div class="person-sub"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <p class="person-mood">"${escapeHtml(p.mood)}"</p>
      <div class="tags">${(p.interests||[]).map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
      <div class="person-actions">${personActionsHtml(p)}</div>
    </div>`).join('')
    || `<div class="empty" style="grid-column:1/-1"><i class="ti ti-users"></i><p>No people match that. Try another filter.</p></div>`;
}

function openPersonProfile(id) {
  const p = personById(id);
  if (!p) return;
  const shared = currentUser?.interests || [];
  document.getElementById('person-modal').innerHTML = `
    <div class="modal-header">
      <h2>Profile</h2>
      <button class="icon-btn" onclick="closePerson()" aria-label="Close"><i class="ti ti-x"></i></button>
    </div>
    <div class="person-profile-top">
      <div class="profile-avatar-big" style="background:${p.color};position:relative">${p.initials}${p.online?'<span class="online-dot" style="top:auto;bottom:2px;right:2px"></span>':''}</div>
      <h2 style="font-family:var(--font-display);font-size:1.35rem;font-weight:600;margin-top:10px">${escapeHtml(p.name)}</h2>
      <div class="person-sub" style="justify-content:center;margin-top:4px"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist} away${p.mutual?' · '+p.mutual+' mutual friends':''}${p.online?' · <span style="color:var(--accent)">online now</span>':''}</div>
    </div>
    <p class="detail-desc" style="text-align:center">${escapeHtml(p.bio || p.mood)}</p>
    <div class="section-title" style="margin:1rem 0 8px;font-size:13px"><i class="ti ti-tags"></i> Into</div>
    <div class="tags" style="justify-content:center">${(p.interests||[]).map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
    <div class="person-actions" style="margin-top:1.25rem">${personActionsHtml(p)}</div>`;
  document.getElementById('person-overlay').classList.add('open');
  activateModal(document.getElementById('person-overlay'));
}
function closePerson() {
  const ov = document.getElementById('person-overlay');
  if (ov.classList.contains('open')) { ov.classList.remove('open'); deactivateModal(); }
}

function refreshPeopleViews() {
  if (document.getElementById('page-people').classList.contains('active') && peopleMode === 'browse') renderPeople();
}

async function sendFriendReq(id, name, initials, color) {
  try {
    await api.sendFriendRequest(id);
    if (!api.cache.requests.some(r => r.id === id)) {
      api.cache.requests.push({ id, name, initials, color, from_me: true, sub: 'Request sent' });
    }
    showToast(`Request sent to ${name}`);
    api.addNotif(`You sent a friend request to ${name}`, 'ti-user-plus', 'accent').catch(() => {});
  } catch (e) {
    showToast(e.message || 'Could not send request');
  }
  refreshPeopleViews();
  if (document.getElementById('page-friends').classList.contains('active')) renderFriends();
  if (document.getElementById('person-overlay').classList.contains('open')) openPersonProfile(id);
}

async function cancelRequest(id, name) {
  try {
    await api.cancelFriendRequest(id);
    api.cache.requests = api.cache.requests.filter(r => !(r.from_me && r.id === id));
    showToast(`Canceled request to ${name}`);
  } catch (_) {
    showToast('Could not cancel request');
  }
  refreshPeopleViews();
  if (document.getElementById('page-friends').classList.contains('active')) renderFriends();
  if (document.getElementById('person-overlay').classList.contains('open')) openPersonProfile(id);
}

function proposeHangout(name) { showToast(`Hangout request sent to ${name}`); api.addNotif(`You proposed a hangout with ${name}`, 'ti-calendar-event', 'warn').catch(()=>{}); }
function planWithPerson(name) { closePerson(); goTo('plans'); setTimeout(() => { openCreatePlan(); document.getElementById('plan-invite').value = name; }, 300); }

function startLivePresence() {
  if (window._presenceTimer) return;
  window._presenceTimer = setInterval(() => {
    const people = api.cache.people;
    if (people.length) {
      const p = people[Math.floor(Math.random() * people.length)];
      p.online = !p.online;
      refreshPeopleViews();
    }
  }, 30000);
}

/* ════════ PLANS ════════ */
let plansFilter = 'all';

function planSortKey(p) {
  const mi = MONTHS.indexOf(p.month);
  const y  = new Date().getFullYear();
  return new Date(y, mi<0?0:mi, parseInt(p.day,10)||1).getTime();
}

const PLAN_STATUS = {
  confirmed:{cls:'status-confirmed',label:'Confirmed'},
  pending:  {cls:'status-pending',  label:'Pending'},
  declined: {cls:'status-declined', label:"Can't make it"},
};
function planStatusPill(status) {
  const m = PLAN_STATUS[status] || PLAN_STATUS.pending;
  return `<span class="plan-status ${m.cls}">${m.label}</span>`;
}

function renderPlans(filter) {
  if (filter) plansFilter = filter;
  let plans = [...(api.cache.plans||[])].sort((a,b) => planSortKey(a)-planSortKey(b));
  if (plansFilter === 'confirmed') plans = plans.filter(p => p.status === 'confirmed');
  if (plansFilter === 'pending')   plans = plans.filter(p => p.status === 'pending');
  const avColors = ['#5C7152','#B07D3C','#8A5A6A','#AF553D','#5B6485','#3F7672'];
  const rsvpBtn = (p,val,icon,label) => `<button class="rsvp-btn ${(p.rsvp||'going')===val?'active '+val:''}" onclick="setRsvp('${p.id}','${val}')"><i class="ti ${icon}"></i>${label}</button>`;
  document.getElementById('plans-list').innerHTML = plans.length
    ? plans.map(p => `
    <div class="plan-card">
      <div class="plan-date-box" style="${p.cat?`background:${CAT_COLORS[p.cat]||'var(--primary)'}22`:''}">
        <div class="month">${p.month}</div><div class="day">${p.day}</div>
      </div>
      <div class="plan-info">
        <h3>${p.cat?`<i class="ti ${CAT_ICONS[p.cat]||'ti-calendar'}" style="color:${CAT_COLORS[p.cat]||'var(--primary)'};font-size:14px"></i> `:''}${escapeHtml(p.title)}</h3>
        <div class="meta-item" style="margin:4px 0"><i class="ti ti-clock" style="font-size:13px"></i><span style="font-size:12px;color:var(--text-muted)">${escapeHtml(p.time)} · ${escapeHtml(p.location)}</span></div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
          <div class="avatar-stack">${(p.people||[]).map((av,j)=>`<div class="av" style="background:${avColors[j%6]}">${av}</div>`).join('')}</div>
          ${p.people?.length?`<span style="font-size:12px;color:var(--text-muted)">${p.people.length} friend${p.people.length!==1?'s':''}</span>`:''}
          ${planStatusPill(p.status)}
        </div>
        <div class="rsvp-row">
          ${rsvpBtn(p,'going','ti-check','Going')}
          ${rsvpBtn(p,'maybe','ti-help','Maybe')}
          ${rsvpBtn(p,'cant','ti-x',"Can't")}
        </div>
      </div>
      <div class="plan-card-actions">
        <button class="icon-btn btn-sm" onclick="editPlan('${p.id}')" aria-label="Edit plan"><i class="ti ti-pencil"></i></button>
        <button class="icon-btn btn-sm plan-del" onclick="removePlan('${p.id}')" aria-label="Delete plan"><i class="ti ti-trash" aria-hidden="true"></i></button>
      </div>
    </div>`).join('')
    : `<div class="empty"><i class="ti ti-calendar-off"></i><p>No plans yet.<br>Hit the button below and we'll find you something.</p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="openBored()"><i class="ti ti-dice-5"></i> Surprise me</button></div>`;
}

async function setRsvp(id, val) {
  const rsvp = val;
  const status = val==='going' ? 'confirmed' : val==='cant' ? 'declined' : 'pending';
  try {
    await api.updatePlan(id, { rsvp, status });
    renderPlans();
    showToast(val==='going'?'You\'re going':val==='maybe'?'Marked as maybe':'Marked as can\'t make it');
  } catch (_) { showToast('Could not update RSVP'); }
}

function filterPlans(f, el) {
  document.querySelectorAll('#page-plans .filter-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderPlans(f);
}

async function removePlan(id) {
  try {
    await api.deletePlan(id);
    renderPlans();
    showToast('Plan removed');
  } catch (_) { showToast('Could not remove plan'); }
}

let editingPlanId = null;
function openCreatePlan() {
  editingPlanId = null;
  document.getElementById('plan-modal-title').textContent = 'Create a plan';
  document.getElementById('plan-submit-label').textContent = 'Create';
  ['plan-title','plan-location','plan-invite','plan-notes'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('plan-type').value = 'social';
  document.getElementById('plan-error').style.display = 'none';
  document.getElementById('plan-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('plan-time').value = '18:00';
  document.getElementById('modal-overlay').classList.add('open');
  activateModal(document.getElementById('modal-overlay'));
}

function editPlan(id) {
  const p = (api.cache.plans||[]).find(x => x.id === id);
  if (!p) return;
  editingPlanId = id;
  document.getElementById('plan-modal-title').textContent = 'Edit plan';
  document.getElementById('plan-submit-label').textContent = 'Save';
  document.getElementById('plan-title').value = p.title;
  document.getElementById('plan-type').value = p.cat || 'social';
  document.getElementById('plan-location').value = p.location === 'TBD' ? '' : p.location;
  document.getElementById('plan-invite').value = '';
  document.getElementById('plan-notes').value = p.notes || '';
  document.getElementById('plan-error').style.display = 'none';
  const mi = MONTHS.indexOf(p.month);
  const y  = new Date().getFullYear();
  const d  = new Date(y, mi<0?0:mi, parseInt(p.day,10)||1);
  document.getElementById('plan-date').value = d.toISOString().split('T')[0];
  document.getElementById('plan-time').value = to24h(p.time);
  document.getElementById('modal-overlay').classList.add('open');
  activateModal(document.getElementById('modal-overlay'));
}

function closePlanModal() { document.getElementById('modal-overlay').classList.remove('open'); deactivateModal(); }

function fmtTime(t) {
  if (!t) return '6:00 PM';
  if (!/^\d{1,2}:\d{2}$/.test(t)) return t;
  let [h,m] = t.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h%12; if (h===0) h=12;
  return `${h}:${String(m).padStart(2,'0')} ${ap}`;
}
function to24h(t) {
  if (/^\d{1,2}:\d{2}$/.test(t)) return t;
  const m = (t||'').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return '18:00';
  let h = parseInt(m[1],10); const min=m[2]; const ap=m[3].toUpperCase();
  if (ap==='PM'&&h<12) h+=12; if (ap==='AM'&&h===12) h=0;
  return `${String(h).padStart(2,'0')}:${min}`;
}

async function createPlan() {
  const title  = document.getElementById('plan-title').value.trim();
  const errEl  = document.getElementById('plan-error');
  if (!title) { errEl.textContent='Please enter a plan title.'; errEl.style.display='block'; return; }
  const dateVal = document.getElementById('plan-date').value;
  const d = dateVal ? new Date(dateVal+'T00:00:00') : new Date();
  const today = new Date(); today.setHours(0,0,0,0);
  if (d < today) { errEl.textContent="That date is in the past — pick today or later."; errEl.style.display='block'; return; }
  errEl.style.display = 'none';

  const cat      = document.getElementById('plan-type').value;
  const invite   = document.getElementById('plan-invite').value.trim();
  const people   = invite ? [invite.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()] : [];
  const time     = fmtTime(document.getElementById('plan-time').value);
  const location = document.getElementById('plan-location').value.trim() || 'TBD';
  const notes    = document.getElementById('plan-notes').value.trim();

  try {
    if (editingPlanId) {
      const existing = (api.cache.plans||[]).find(x => x.id === editingPlanId);
      await api.updatePlan(editingPlanId, {
        title, cat, month: MONTHS[d.getMonth()], day: String(d.getDate()),
        time, location, notes, people: people.length ? people : (existing?.people||[]),
      });
      closePlanModal();
      renderPlans();
      showToast(`"${title}" updated`);
      editingPlanId = null;
      return;
    }

    const plan = await api.createPlan({
      title, cat, month: MONTHS[d.getMonth()], day: String(d.getDate()),
      time, location, notes, people,
    });
    closePlanModal();
    renderPlans();
    if (plan.xp) handleXpFromServer(plan.xp, (api.cache.stats?.xp||0));
    checkBadges();
    showToast(`"${title}" added to your plans`);
    api.addNotif(`New plan: ${title} on ${MONTHS[d.getMonth()]} ${d.getDate()}`, 'ti-calendar-check', 'good').catch(() => {});
  } catch (e) {
    errEl.textContent = e.message || 'Could not save plan.';
    errEl.style.display = 'block';
  }
}

/* ════════ FRIENDS ════════ */
let currentFTab = 'friends';

function renderFriends() {
  const friends  = api.cache.friends || [];
  const requests = (api.cache.requests||[]).filter(r => !r.from_me);
  document.getElementById('friends-count').textContent = friends.length ? `(${friends.length})` : '';
  updateReqBadges();

  document.getElementById('friends-panel').innerHTML = friends.length
    ? `<div class="people-grid">${friends.map(f=>`
        <div class="person-card">
          <div class="person-header" onclick="openPersonProfile('${f.id}')" style="cursor:pointer">
            <div class="person-avatar" style="background:${f.color}">${f.initials}</div>
            <div><div class="person-name">${escapeHtml(f.name)}</div><div class="person-sub">Friends</div></div>
          </div>
          <div class="person-actions">
            <button class="btn btn-primary btn-sm" onclick="openChat('${f.id}','${escapeHtml(f.name)}','${f.initials}','${f.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
            <button class="btn btn-outline btn-sm" onclick="planWithPerson('${escapeHtml(f.name)}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>
          </div>
        </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-heart-handshake"></i><p>No friends yet.<br>Try Quick match on the People tab.</p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="goTo('people');setPeopleMode('match')"><i class="ti ti-bolt"></i> Start matching</button></div>`;

  document.getElementById('requests-panel').innerHTML = requests.length
    ? `<div class="people-grid">${requests.map(r=>`
        <div class="person-card">
          <div class="person-header">
            <div class="person-avatar" style="background:${r.color}">${r.initials}</div>
            <div><div class="person-name">${escapeHtml(r.name)}</div><div class="person-sub">${r.sub||'Nearby'}</div></div>
          </div>
          <div class="person-actions">
            <button class="btn btn-accent btn-sm" onclick="acceptRequest('${r.id}','${escapeHtml(r.name)}','${r.initials}','${r.color}')"><i class="ti ti-check" aria-hidden="true"></i>Accept</button>
            <button class="btn btn-outline btn-sm" onclick="declineRequest('${r.id}','${escapeHtml(r.name)}')"><i class="ti ti-x" aria-hidden="true"></i>Decline</button>
          </div>
        </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-user-check"></i><p>No pending requests right now.</p></div>`;

  const existingIds = [...friends.map(f=>f.id), ...(api.cache.requests||[]).map(r=>r.id)];
  const shared      = currentUser?.interests || [];
  const suggestions = (api.cache.people||[]).filter(p => !existingIds.includes(p.id)).slice(0,4);
  document.getElementById('suggestions-panel').innerHTML = suggestions.length
    ? `<div class="people-grid">${suggestions.map(p=>`
    <div class="person-card" onclick="openPersonProfile('${p.id}')">
      ${p.online?'<div class="online-dot" role="img" aria-label="Online now"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.initials}</div>
        <div><div class="person-name">${escapeHtml(p.name)}</div><div class="person-sub">${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <div class="tags">${(p.interests||[]).map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
      <div class="person-actions">
        <button class="btn btn-primary btn-sm btn-block" onclick="event.stopPropagation();sendFriendReq('${p.id}','${escapeHtml(p.name)}','${p.initials}','${p.color}');renderFriends()"><i class="ti ti-user-plus" aria-hidden="true"></i>Add friend</button>
      </div>
    </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-users"></i><p>No more suggestions right now.</p></div>`;
}

function showFTab(tab) {
  currentFTab = tab;
  document.querySelectorAll('.ftab').forEach(t => t.classList.remove('active'));
  document.getElementById('ftab-'+tab).classList.add('active');
  ['friends','requests','suggestions'].forEach(t => document.getElementById(t+'-panel').style.display = t===tab?'block':'none');
}

async function acceptRequest(id, name, initials, color) {
  try {
    const res = await api.acceptFriendRequest(id);
    awardXp(XP.friend, 'friends_count');
    confetti();
    showToast(`You and ${name} are now connected`, 'achievement', 'ti-heart');
    api.addNotif(`You and ${name} are now friends`, 'ti-heart', 'good').catch(() => {});
    checkBadges();
  } catch (e) {
    showToast(e.message || 'Could not accept request');
  }
  closePerson();
  renderFriends();
  refreshPeopleViews();
}

async function declineRequest(id, name) {
  try {
    await api.declineFriendRequest(id);
    showToast(`Declined request from ${name}`);
  } catch (_) {}
  closePerson();
  renderFriends();
  refreshPeopleViews();
}

/* ════════ PROFILE ════════ */
function renderProfile() {
  const u = currentUser;
  const s = api.cache.stats || { xp:0, streak:1, joins:0, friends_count:0, plans_count:0, badges:[], xp_log:[] };
  const level = levelFromXp(s.xp);
  const curBase  = xpForLevel(level);
  const nextNeed = xpForLevel(level+1);
  const pct = Math.min(100, Math.round(((s.xp-curBase)/(nextNeed-curBase))*100));
  const plans   = api.cache.plans || [];
  const friends = api.cache.friends || [];
  const joined  = api.cache.joined;
  const theme   = ls.get('bo_theme') || 'auto';

  // Leaderboard: mix of demo names + real user
  const board = [
    {name:'Maya C.', xp:540},{name:'Jordan P.', xp:410},{name:'Aisha W.', xp:300},
    {name: u?.name?.split(' ')[0]+' (you)', xp:s.xp, me:true},
    {name:'Tyler B.', xp:150},{name:'Priya N.', xp:90},
  ].sort((a,b) => b.xp-a.xp).slice(0,6);

  const xpLog = (s.xp_log||[]).slice(0,6);

  document.getElementById('profile-content').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-big" style="background:${u?.color||'#5C7152'}">${u?.initials||'?'}</div>
      <div style="flex:1;min-width:0">
        <h2 style="font-family:var(--font-display);font-size:1.45rem;font-weight:600;margin-bottom:3px">${escapeHtml(u?.name||'')}</h2>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px">Member since ${u?.created_at ? new Date(u.created_at).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : 'today'}</p>
        <div class="tags">${(u?.interests||[]).map(i=>`<span class="tag">${i}</span>`).join('')}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="logout()"><i class="ti ti-logout" aria-hidden="true"></i>Sign out</button>
    </div>
    <div class="level-bar-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--font-display);font-weight:600;font-size:16px"><i class="ti ti-star-filled" style="color:var(--gold)"></i> Level ${level}</span>
        <span style="font-size:12px;color:var(--text-muted)">${s.xp} / ${nextNeed} XP</span>
      </div>
      <div class="level-bar-track"><div class="level-bar-fill" style="width:${pct}%"></div></div>
      <span style="font-size:12px;color:var(--text-muted)">${nextNeed-s.xp} XP to level ${level+1}</span>
    </div>
    <div class="profile-stats">
      <div class="stat-card"><div class="stat-num">${s.streak}</div><div class="stat-label">Day streak</div></div>
      <div class="stat-card"><div class="stat-num">${friends.length}</div><div class="stat-label">Friends</div></div>
      <div class="stat-card"><div class="stat-num">${plans.length}</div><div class="stat-label">Plans</div></div>
      <div class="stat-card"><div class="stat-num">${joined.size}</div><div class="stat-label">Joined</div></div>
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-award"></i>Badges (${(s.badges||[]).length}/${BADGES.length})</div>
      <div class="badges-grid">${BADGES.map((b,i)=>`
        <div class="badge-card ${(s.badges||[]).includes(b.id)?'earned':'locked'}" style="animation-delay:${i*0.04}s">
          ${(s.badges||[]).includes(b.id)?'<span class="badge-check"><i class="ti ti-check"></i></span>':''}
          <div class="badge-emoji"><i class="ti ${b.icon}"></i></div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>`).join('')}</div>
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-trophy"></i>Leaderboard <span style="font-weight:500;color:var(--text-muted);font-size:12px">· near you</span></div>
      <div class="leaderboard">${board.map((row,i)=>`
        <div class="lb-row ${row.me?'me':''}">
          <span class="lb-rank">${i+1}</span>
          <span class="lb-name">${escapeHtml(row.name)}</span>
          <span class="lb-xp">${row.xp} XP</span>
        </div>`).join('')}</div>
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-history"></i>Recent activity</div>
      ${xpLog.length ? `<div class="xp-log">${xpLog.map(e=>`
        <div class="xp-log-row"><span>${e.reason}</span><span class="xp-log-amt">+${e.amount} XP</span></div>`).join('')}</div>`
        : `<p style="font-size:13px;color:var(--text-muted)">Start exploring to earn XP — joining, planning, and chatting all count.</p>`}
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-palette"></i>Appearance</div>
      <div class="theme-row">
        <button class="theme-opt ${theme==='auto'?'active':''}" onclick="setTheme('auto')"><i class="ti ti-device-desktop"></i>Auto</button>
        <button class="theme-opt ${theme==='light'?'active':''}" onclick="setTheme('light')"><i class="ti ti-sun"></i>Light</button>
        <button class="theme-opt ${theme==='dark'?'active':''}" onclick="setTheme('dark')"><i class="ti ti-moon"></i>Dark</button>
      </div>
    </div>`;
}

/* ════════ THEME ════════ */
function applyTheme() {
  const theme = ls.get('bo_theme') || 'auto';
  const dark = theme==='dark' || (theme==='auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#15110D' : '#F1ECE4');
}
function setTheme(t) { ls.set('bo_theme', t); applyTheme(); applyHeroVibe(); renderProfile(); showToast(`Theme set to ${t}`); }
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ════════ CHAT ════════ */
let chatTarget = null;

function renderChatEmojiBar() {
  const bar = document.getElementById('chat-emoji-bar');
  if (bar) bar.innerHTML = CHAT_EMOJI.map(e=>`<button class="chat-emoji" onclick="insertEmoji('${e}')">${e}</button>`).join('');
}
function insertEmoji(e) {
  const input = document.getElementById('chat-input');
  input.value += e;
  input.focus();
}

async function openChat(id, name, initials, color) {
  closePerson();
  chatTarget = { id, name, init: initials, color };
  document.getElementById('chat-avatar').textContent = initials;
  document.getElementById('chat-avatar').style.background = color;
  document.getElementById('chat-name').textContent = name;
  const person = personById(id);
  document.getElementById('chat-online').textContent = person?.online ? '● Online' : '';
  document.getElementById('chat-messages').innerHTML = '<div class="chat-empty">Loading…</div>';
  document.getElementById('chat-panel').classList.add('open');
  document.getElementById('chat-input').focus();

  chatLastAt = new Date().toISOString();
  await loadChatMessages();
  clearInterval(chatPollTimer);
  chatPollTimer = setInterval(pollChat, 4000);
}

async function loadChatMessages() {
  if (!chatTarget) return;
  try {
    const msgs = await api.getMessages(chatTarget.id);
    chatLastAt = new Date().toISOString();
    renderChatMessageList(msgs);
  } catch (_) {}
}

async function pollChat() {
  if (!chatTarget) return;
  try {
    const newMsgs = await api.pollMessages(chatTarget.id, chatLastAt || new Date(0).toISOString());
    if (newMsgs.length) {
      chatLastAt = new Date().toISOString();
      await loadChatMessages(); // refresh full view
    }
  } catch (_) {}
}

function renderChatMessageList(msgs) {
  const lastMine = msgs.reduce((acc,m,i) => m.mine ? i : acc, -1);
  const container = document.getElementById('chat-messages');
  container.innerHTML = msgs.length
    ? msgs.map((m,i) => `<div class="msg ${m.mine?'mine':'theirs'}">${escapeHtml(m.text)}<div class="msg-time">${m.time}${m.mine&&m.seen&&i===lastMine?' · <span class="seen"><i class="ti ti-checks" style="font-size:12px;vertical-align:-1px"></i> Seen</span>':''}</div></div>`).join('')
    : `<div class="chat-empty">Say hi to ${escapeHtml(chatTarget.name)}.</div>`;
  container.scrollTop = container.scrollHeight;
}

function closeChat() {
  clearInterval(chatPollTimer);
  chatPollTimer = null;
  document.getElementById('chat-panel').classList.remove('open');
  chatTarget = null;
}

async function sendMessage() {
  if (!chatTarget) return;
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;
  input.value = '';
  try {
    const msg = await api.sendMessage(chatTarget.id, text);
    chatLastAt = new Date().toISOString();
    if (msg.xp) {
      const s = api.cache.stats;
      if (s) {
        s.xp = (s.xp||0) + msg.xp;
        s.msgs = (s.msgs||0) + 1;
        floatXp('+' + msg.xp + ' XP');
        updateLevelChip();
        checkBadges();
      }
    }
    await loadChatMessages();
  } catch (_) {
    showToast('Could not send message — try again');
    input.value = text;
  }
}

/* ════════ NOTIFICATIONS ════════ */
let notifPanelOpen = false;

function addNotif(text, icon, type) {
  api.addNotif(text, icon, type).catch(() => {});
}

function updateNotifBadge() {
  const unread = (api.cache.notifs||[]).filter(n => !n.read).length;
  const badge = document.getElementById('notif-badge');
  if (unread) { badge.textContent=unread>9?'9+':unread; badge.style.display='flex'; }
  else badge.style.display = 'none';
}

function toggleNotifPanel() {
  notifPanelOpen = !notifPanelOpen;
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  panel.classList.toggle('open', notifPanelOpen);
  btn.setAttribute('aria-expanded', notifPanelOpen ? 'true' : 'false');
  if (notifPanelOpen) { renderNotifPanel(); setTimeout(() => panel.querySelector('button,[tabindex]')?.focus?.(), 30); }
  else btn.focus();
}

function renderNotifPanel() {
  const notifs = api.cache.notifs || [];
  const list   = document.getElementById('notif-list');
  list.innerHTML = notifs.length
    ? notifs.map(n => `
        <div class="notif-item ${n.read?'':'unread'}" onclick="markRead('${n.id}')">
          <div class="notif-icon ${n.type}"><i class="ti ${n.icon}" aria-hidden="true"></i></div>
          <div><div class="notif-text">${escapeHtml(n.text)}</div><div class="notif-time">${n.time}</div></div>
        </div>`).join('')
    : `<div class="empty"><i class="ti ti-bell-off"></i><p>No notifications yet</p></div>`;
  if ('Notification' in window && Notification.permission === 'default') {
    list.insertAdjacentHTML('afterbegin', `<div class="notif-enable">
      <i class="ti ti-bell" style="color:var(--accent);font-size:18px"></i>
      <span style="flex:1">Get notified about activities near you</span>
      <button class="btn btn-accent btn-sm" onclick="requestNotifPermission()">Enable</button>
    </div>`);
  }
}

async function markRead(id) {
  await api.markRead(id).catch(() => {});
  updateNotifBadge();
  renderNotifPanel();
}

async function markAllRead() {
  await api.markAllRead().catch(() => {});
  updateNotifBadge();
  renderNotifPanel();
  showToast('All notifications marked as read');
}

function requestNotifPermission() {
  if (!('Notification' in window)) { showToast('Notifications aren\'t supported here'); return; }
  Notification.requestPermission().then(p => {
    if (p === 'granted') showToast('Notifications enabled');
    renderNotifPanel();
  });
}

/* ════════ PWA INSTALL ════════ */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  if (!ls.get('bo_install_dismissed') && currentUser) document.getElementById('install-banner').classList.add('show');
});
function doInstall() {
  if (!deferredInstall) { showToast('Open your browser menu and choose "Add to home screen"'); return; }
  deferredInstall.prompt();
  deferredInstall.userChoice.then(choice => {
    if (choice.outcome === 'accepted') { confetti(); showToast('BoredOut installed', 'achievement', 'ti-sparkles'); }
    deferredInstall = null;
    document.getElementById('install-banner').classList.remove('show');
  });
}
function dismissInstall() { ls.set('bo_install_dismissed', true); document.getElementById('install-banner').classList.remove('show'); }

/* ════════ ONBOARDING TOUR ════════ */
function maybeShowTour(force) {
  if (!force && ls.get('bo_tour_' + currentUser?.id)) return;
  ls.set('bo_tour_' + currentUser?.id, true);
  const steps = [
    {icon:'<i class="ti ti-dice-5"></i>', title:'One tap, one idea', body:'Tap Surprise me and we\'ll pick something to do based on your interests, the time, and the weather.'},
    {icon:'<i class="ti ti-compass"></i>', title:'Discover & filter', body:'Browse activities by category, mood, or search. Open any card for details, directions, and to join.'},
    {icon:'<i class="ti ti-users"></i>', title:'Find your people', body:'Browse or quick-match with people nearby, send requests, make plans, and chat.'},
    {icon:'<i class="ti ti-trophy"></i>', title:'Level up', body:'Everything you do earns XP. Build streaks, unlock badges, and climb the local leaderboard.'},
  ];
  let i = 0;
  const ov = document.createElement('div');
  ov.className = 'modal-overlay open tour-overlay';
  document.body.appendChild(ov);
  const render = () => {
    const s = steps[i];
    ov.innerHTML = `<div class="tour-card" role="dialog" aria-modal="true" aria-label="Welcome to BoredOut">
      <div class="tour-icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.body}</p>
      <div class="tour-dots">${steps.map((_,j)=>`<span class="${j===i?'on':''}"></span>`).join('')}</div>
      <div class="tour-actions">
        <button class="btn btn-outline btn-sm" data-act="skip">Skip</button>
        <button class="btn btn-primary btn-sm" data-act="next">${i===steps.length-1?'Get started':'Next'}</button>
      </div>
    </div>`;
    ov.querySelector('[data-act="skip"]').onclick = close;
    ov.querySelector('[data-act="next"]').onclick = () => { if(i===steps.length-1) close(); else { i++; render(); } };
  };
  const close = () => { ov.remove(); deactivateModal(); };
  ov.addEventListener('click', e => { if(e.target===ov) close(); });
  render();
  activateModal(ov);
}

/* ════════ FOCUS MANAGEMENT ════════ */
let lastFocused = null;
let trapOverlay = null;

function focusables(el) {
  return [...el.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(e => e.offsetParent !== null);
}
function onTrapKey(e) {
  if (e.key !== 'Tab' || !trapOverlay) return;
  const items = focusables(trapOverlay);
  if (!items.length) return;
  const first = items[0], last = items[items.length-1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function activateModal(overlay) {
  if (!overlay || trapOverlay === overlay) return;
  lastFocused = document.activeElement;
  trapOverlay = overlay;
  const items = focusables(overlay);
  setTimeout(() => (items[0] || overlay).focus?.(), 30);
  document.addEventListener('keydown', onTrapKey, true);
}
function deactivateModal() {
  document.removeEventListener('keydown', onTrapKey, true);
  trapOverlay = null;
  if (lastFocused?.focus) { try { lastFocused.focus(); } catch(_) {} }
  lastFocused = null;
  if (pendingLevelUp != null) { const lv=pendingLevelUp; pendingLevelUp=null; setTimeout(()=>showLevelUp(lv),260); }
}

/* ════════ NAV ════════ */
function goTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab,.bnav-item').forEach(t => t.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const dt = document.getElementById('tab-'+page); if (dt) dt.classList.add('active');
  const bt = document.getElementById('bnav-'+page); if (bt) bt.classList.add('active');
  try {
    if (page === 'people')   { renderPeoplePills(); renderPeople(); if (peopleMode==='match') startDeck(); }
    if (page === 'friends')  renderFriends();
    if (page === 'profile')  renderProfile();
    if (page === 'plans')    renderPlans();
    if (page === 'discover') renderDiscover();
  } catch (err) { console.error(err); showToast('Something glitched — try again'); }
  if (notifPanelOpen) { notifPanelOpen=false; document.getElementById('notif-panel').classList.remove('open'); }
  window.scrollTo({ top: 0 });
}

/* ════════ TOAST ════════ */
function showToast(msg, kind, icon) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.classList.toggle('achievement', kind === 'achievement');
  document.getElementById('toast-icon').className = 'ti ' + (icon || 'ti-check');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ════════ INIT ════════ */
(function init() {
  applyTheme();
  renderInterestsPicker();

  if ('serviceWorker' in navigator) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) {
            showToast('New version ready — refresh to update', null, 'ti-refresh');
          }
        });
      });
    }).catch(() => {});
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || reloaded) return; reloaded = true; location.reload();
    });
  }

  // Try restoring session via stored token
  if (api.getToken()) {
    api.getMe().then(user => {
      currentUser = user;
      launchApp();
    }).catch(() => {
      api.setToken(null);
      document.getElementById('auth-overlay').style.display = 'flex';
    });
  } else {
    document.getElementById('auth-overlay').style.display = 'flex';
  }

  document.getElementById('login-email').addEventListener('keydown', e => e.key==='Enter' && doLogin());
  document.getElementById('login-password').addEventListener('keydown', e => e.key==='Enter' && doLogin());

  document.addEventListener('click', e => {
    if (!notifPanelOpen) return;
    const panel = document.getElementById('notif-panel');
    const btn   = document.getElementById('notif-btn');
    if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
      notifPanelOpen = false;
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  const isOpen = id => document.getElementById(id)?.classList.contains('open');
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const tour = document.querySelector('.tour-overlay');
      if (tour)                       { tour.remove(); deactivateModal(); return; }
      if (isOpen('levelup-overlay'))  { closeLevelUp(); return; }
      if (isOpen('person-overlay'))   { closePerson(); return; }
      if (isOpen('detail-overlay'))   { closeDetail(); return; }
      if (isOpen('modal-overlay'))    { closePlanModal(); return; }
      if (isOpen('bored-overlay'))    { closeBored(); return; }
      if (chatTarget)                 { closeChat(); return; }
      if (notifPanelOpen)             { toggleNotifPanel(); return; }
    }
    if (currentUser && document.getElementById('page-people')?.classList.contains('active') && peopleMode==='match' && !chatTarget) {
      if (e.key === 'ArrowLeft')  deckSwipe(false);
      if (e.key === 'ArrowRight') deckSwipe(true);
    }
  });

  let lastErr = 0;
  window.addEventListener('error', () => {
    const now = Date.now();
    if (now-lastErr > 4000) { lastErr=now; try { showToast('Something glitched — please retry'); } catch(_) {} }
  });
  window.addEventListener('unhandledrejection', e => {
    if (e.reason?.status === 401) { /* handled per-request */ return; }
    console.error('Unhandled promise rejection:', e.reason);
  });
})();
