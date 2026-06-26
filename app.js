/* ════════ DATA ════════ */
const INTERESTS = ['Coffee','Hiking','Gaming','Music','Food','Art','Sports','Movies','Reading','Travel','Fitness','Photography'];
const COLORS = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#E24B4A','#534AB7','#BA7517','#0F6E56'];
const CATEGORIES = [
  {id:'outdoor',icon:'ti-trees',label:'Outdoors',color:'#1D9E75'},
  {id:'food',icon:'ti-bowl-spoon',label:'Food',color:'#EF9F27'},
  {id:'arts',icon:'ti-palette',label:'Arts',color:'#D4537E'},
  {id:'sports',icon:'ti-run',label:'Sports',color:'#E24B4A'},
  {id:'games',icon:'ti-device-gamepad-2',label:'Games',color:'#7F77DD'},
  {id:'music',icon:'ti-music',label:'Music',color:'#534AB7'},
  {id:'movies',icon:'ti-movie',label:'Movies',color:'#BA7517'},
  {id:'social',icon:'ti-users',label:'Social',color:'#0F6E56'},
];
const CAT_COLORS = {outdoor:'#1D9E75',food:'#EF9F27',arts:'#D4537E',sports:'#E24B4A',games:'#7F77DD',music:'#534AB7',movies:'#BA7517',social:'#0F6E56'};
const CAT_ICONS = {outdoor:'ti-trees',food:'ti-bowl-spoon',arts:'ti-palette',sports:'ti-run',games:'ti-device-gamepad-2',music:'ti-music',movies:'ti-movie',social:'ti-users'};
const CAT_INTERESTS = {
  outdoor:['Hiking','Travel','Fitness','Photography'], food:['Coffee','Food'], arts:['Art','Photography','Reading'],
  sports:['Sports','Fitness'], games:['Gaming'], music:['Music'], movies:['Movies'], social:['Coffee','Food','Gaming','Reading'],
};
const DAYPART_CATS = {
  morning:['outdoor','food','sports'], afternoon:['arts','social','sports','outdoor'],
  evening:['food','games','music','movies','social'], night:['games','movies','social'],
};
const MOOD_CATS = {
  active:['outdoor','sports'], chill:['movies','music','arts'],
  social:['social','games'], eat:['food'],
};
const ACTIVITIES = [
  {id:1,cat:'outdoor',emoji:'🏞️',title:'Riverside Park Nature Walk',location:'Riverside Park',dist:'0.4 mi',time:'Anytime',cost:'Free',going:12,badge:'free',desc:'A peaceful loop along the water. Great for clearing your head, people-watching, or a slow stroll with someone new.'},
  {id:2,cat:'food',emoji:'☕',title:'Specialty Coffee Crawl',location:'Brooklyn Heights',dist:'1.2 mi',time:'Flexible',cost:'~$15',going:7,badge:'',desc:'Hit three of the best indie cafés in the neighborhood. Compare pours, argue about oat milk, make a friend.'},
  {id:3,cat:'arts',emoji:'🎨',title:'Open Studio Art Night',location:'Bushwick Collective',dist:'2.1 mi',time:'7 PM',cost:'$10',going:23,badge:'hot',desc:'Local artists open their studios. Paint, sketch, or just wander with a drink. Zero skill required.'},
  {id:4,cat:'sports',emoji:'🏀',title:'Pickup Basketball',location:'West 4th Courts',dist:'0.8 mi',time:'4 PM',cost:'Free',going:18,badge:'free',desc:'Casual 3v3 runs at the famous Cage. All levels welcome — call next and you\'re in.'},
  {id:5,cat:'games',emoji:'🎳',title:'Retro Arcade Night',location:'Barcade Williamsburg',dist:'3.0 mi',time:'6 PM',cost:'$20',going:31,badge:'hot',desc:'Pinball, Street Fighter, skee-ball, and craft beer. The best kind of nostalgia overload.'},
  {id:6,cat:'music',emoji:'🎵',title:'Free Jazz in the Park',location:'Central Park Bandshell',dist:'1.5 mi',time:'3 PM',cost:'Free',going:45,badge:'free',desc:'Live quartet under the trees. Bring a blanket and snacks; stay for the golden-hour set.'},
  {id:7,cat:'movies',emoji:'🎬',title:'Outdoor Cinema Night',location:'Bryant Park Lawn',dist:'0.9 mi',time:'8 PM',cost:'Free',going:62,badge:'free',desc:'Classic film on the big lawn screen. Arrive early for a good blanket spot — it fills up fast.'},
  {id:8,cat:'social',emoji:'🧩',title:'Board Game Café Meetup',location:'Hex & Co.',dist:'1.1 mi',time:'2 PM',cost:'$12',going:9,badge:'',desc:'Hundreds of games on shelves and friendly strangers at every table. Catan? Codenames? Dealer\'s choice.'},
  {id:9,cat:'outdoor',emoji:'🚴',title:'Group Bike Ride Along Hudson',location:'Pier 84 Entrance',dist:'0.6 mi',time:'10 AM',cost:'Free',going:14,badge:'free',desc:'An easy 8-mile cruise down the greenway. Rentals available at the pier if you don\'t have wheels.'},
  {id:10,cat:'food',emoji:'🍜',title:'Ramen Tasting Tour',location:'East Village',dist:'1.8 mi',time:'Flexible',cost:'~$40',going:5,badge:'',desc:'Three legendary ramen spots, one evening. Come hungry, leave transcendent.'},
  {id:11,cat:'arts',emoji:'🖼️',title:'MoMA Late Night Hours',location:'Midtown West',dist:'2.4 mi',time:'Until 9 PM',cost:'$25',going:11,badge:'',desc:'The museum after dark — smaller crowds, moody lighting, and the good gift shop still open.'},
  {id:12,cat:'sports',emoji:'🧗',title:'Bouldering Drop-In Session',location:'The Cliffs LIC',dist:'3.5 mi',time:'All day',cost:'$22',going:8,badge:'',desc:'No ropes, no experience needed. Shoes for rent, problems for every level, instant arm pump.'},
];
const DEMO_PEOPLE = [
  {id:1,name:'Maya Chen',init:'MC',color:'#7F77DD',dist:'0.3 mi',mood:'Down for anything',tags:['Coffee','Hiking','Gaming'],online:true,mutual:2,bio:'Weekend hiker, weekday barista hopper. Always up for a spontaneous adventure.'},
  {id:2,name:'Jordan Park',init:'JP',color:'#1D9E75',dist:'0.8 mi',mood:'Looking for a workout buddy',tags:['Sports','Fitness','Food'],online:true,mutual:1,bio:'Training for a half marathon. Will trade running tips for taco recommendations.'},
  {id:3,name:'Aisha Williams',init:'AW',color:'#D4537E',dist:'1.1 mi',mood:'Want to explore the city',tags:['Art','Food','Photography'],online:false,mutual:3,bio:'Gallery wanderer and amateur street photographer. Show me your favorite hidden spot.'},
  {id:4,name:'Tyler Brooks',init:'TB',color:'#EF9F27',dist:'1.4 mi',mood:'Up for games or movies',tags:['Gaming','Movies','Reading'],online:true,mutual:0,bio:'Board game hoarder and movie buff. My couch has a 200-game library.'},
  {id:5,name:'Sam Rivera',init:'SR',color:'#E24B4A',dist:'1.9 mi',mood:'Bored, let\'s do something!',tags:['Music','Travel','Coffee'],online:true,mutual:1,bio:'Live music chaser. If there\'s a show, I\'m probably there.'},
  {id:6,name:'Priya Nair',init:'PN',color:'#BA7517',dist:'2.2 mi',mood:'Looking for brunch plans',tags:['Food','Reading','Fitness'],online:false,mutual:4,bio:'Brunch enthusiast and yoga regular. Bonus points if there are bottomless mimosas.'},
  {id:7,name:'Chris Lee',init:'CL',color:'#534AB7',dist:'2.6 mi',mood:'Down for outdoor stuff',tags:['Hiking','Sports','Photography'],online:true,mutual:0,bio:'Cyclist and nature nerd. I know every greenway in the city.'},
  {id:8,name:'Zoe Thomas',init:'ZT',color:'#0F6E56',dist:'3.0 mi',mood:'Want to try something new',tags:['Art','Food','Music'],online:false,mutual:2,bio:'Serial hobbyist — currently into pottery and trying every ramen spot in town.'},
];
let PEOPLE = DEMO_PEOPLE.map(p => ({...p}));
const AUTO_REPLIES = [
  'Hey! That sounds fun, I\'m in!','For sure, when works for you?','Yes! I\'ve been bored all day lol',
  'Omg yes let\'s do it!','I was literally just thinking about that','Count me in! What time?',
  'Sounds good! Let me know the details','I\'m free this evening, want to link up?',
  'That\'s a great idea! Been wanting to try that','Sure, where should we meet?',
];
const CHAT_EMOJI = ['😀','😂','😍','👍','🔥','🎉','☕','🙌','😎','❤️'];
const BADGES = [
  {id:'first-join',emoji:'🎯',name:'First move',desc:'Join an activity',check:s=>s.joins>=1},
  {id:'explorer',emoji:'🗺️',name:'Explorer',desc:'Join 5 activities',check:s=>s.joins>=5},
  {id:'social',emoji:'🦋',name:'Social butterfly',desc:'Make 3 friends',check:s=>s.friends>=3},
  {id:'planner',emoji:'📅',name:'Mastermind',desc:'Create 3 plans',check:s=>s.plans>=3},
  {id:'critic',emoji:'⭐',name:'Critic',desc:'Rate 3 activities',check:s=>s.rates>=3},
  {id:'chatter',emoji:'💬',name:'Chatterbox',desc:'Send 10 messages',check:s=>s.msgs>=10},
  {id:'streak3',emoji:'🔥',name:'On fire',desc:'3-day streak',check:s=>s.streak>=3},
  {id:'curebored',emoji:'✨',name:'Bored slayer',desc:'Use I\'m bored 5 times',check:s=>s.boredUses>=5},
  {id:'level5',emoji:'👑',name:'Local legend',desc:'Reach level 5',check:s=>levelFromXp(s.xp)>=5},
];
const XP = {join:20, friend:30, plan:25, rate:10, msg:5, bored:15, checkin:5};
const XP_REASONS = {joins:'Joined an activity', friends:'Made a friend', plans:'Created a plan', rates:'Rated an activity', msgs:'Sent a message'};
const HERO_VIBES = {
  morning:'linear-gradient(135deg,#EF9F27 0%,#D4537E 100%)',
  afternoon:'linear-gradient(135deg,#1D9E75 0%,#534AB7 100%)',
  evening:'linear-gradient(135deg,#7F77DD 0%,#D4537E 100%)',
  night:'linear-gradient(135deg,#534AB7 0%,#13131f 100%)',
};

/* ════════ STORAGE ════════ */
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem('bo_'+k)); } catch { return null; } },
  set: (k,v) => { try { localStorage.setItem('bo_'+k, JSON.stringify(v)); } catch(e) {} },
};
let currentUser = null;
let toastTimer = null;
let authBusy = false;
function getUsers() { return store.get('users') || {}; }
function saveUsers(u) { store.set('users', u); }
function ukey(key) { return 'u_'+currentUser.email+'_'+key; }
function getUserData(key) { return store.get(ukey(key)) || []; }
function setUserData(key, val) { store.set(ukey(key), val); }
function getUserFriends() { return getUserData('friends'); }
function getUserRequests() { return getUserData('requests'); }
function getUserPlans() { return getUserData('plans'); }
function getUserJoined() { return new Set(getUserData('joined')); }
function getUserRatings() { return getUserData('ratings'); }
function getUserNotifs() { return getUserData('notifs'); }
function getRecent() { return getUserData('recent'); }
function getChatMsgs(pid) { return store.get('chat_'+currentUser.email+'_'+pid) || []; }
function saveChatMsgs(pid, msgs) { store.set('chat_'+currentUser.email+'_'+pid, msgs.slice(-100)); }
function personById(id) { return PEOPLE.find(p=>p.id===id) || DEMO_PEOPLE.find(p=>p.id===id); }

/* ════════ GAMIFICATION ════════ */
function getStats() {
  const s = Object.assign({xp:0,streak:1,lastActive:null,lastCheckin:null,joins:0,friends:0,plans:0,rates:0,msgs:0,boredUses:0,badges:[],xpLog:[]}, store.get(ukey('stats'))||{});
  if(!Array.isArray(s.badges)) s.badges = [];
  if(!Array.isArray(s.xpLog)) s.xpLog = [];
  return s;
}
function setStats(s) { store.set(ukey('stats'), s); }
function levelFromXp(xp) { return Math.floor(Math.sqrt(xp/60))+1; }
function xpForLevel(lvl) { return 60*(lvl-1)*(lvl-1); }

function awardXp(amount, statKey, reason) {
  const s = getStats();
  const oldLevel = levelFromXp(s.xp);
  s.xp += amount;
  if(statKey) s[statKey] = (s[statKey]||0)+1;
  s.xpLog = s.xpLog || [];
  s.xpLog.unshift({amount, reason: reason || XP_REASONS[statKey] || 'Earned XP'});
  s.xpLog = s.xpLog.slice(0,20);
  setStats(s);
  floatXp('+'+amount+' XP');
  const newLevel = levelFromXp(s.xp);
  if(newLevel > oldLevel) {
    confetti();
    showLevelUp(newLevel);
    addNotif(`You reached level ${newLevel}!`, 'ti-crown', 'amber');
  }
  checkBadges();
  updateLevelChip();
}

function checkBadges() {
  const s = getStats();
  let earned = false;
  BADGES.forEach(b => {
    if(!s.badges.includes(b.id) && b.check(s)) {
      s.badges.push(b.id);
      earned = true;
      setTimeout(()=>{
        confetti();
        showToast(`Badge earned: ${b.emoji} ${b.name}!`, 'achievement', 'ti-award');
        addNotif(`Badge earned: ${b.name} — ${b.desc}`, 'ti-award', 'amber');
      }, 400);
    }
  });
  if(earned) setStats(s);
}

function touchStreak() {
  const s = getStats();
  const today = new Date().toDateString();
  if(s.lastActive === today) return;
  const yesterday = new Date(Date.now()-86400000).toDateString();
  const prev = s.streak;
  if(s.lastActive === yesterday) { s.streak = prev+1; }
  else {
    s.streak = 1;
    if(s.lastActive && prev > 1) {
      addNotif(`Your ${prev}-day streak ended. Start a new one today!`, 'ti-flame', 'amber');
    }
  }
  s.lastActive = today;
  setStats(s);
  if(s.streak > 1) showToast(`🔥 ${s.streak}-day streak — keep it going!`, 'achievement', 'ti-flame');
  checkBadges();
}

function dailyCheckin() {
  const s = getStats();
  const today = new Date().toDateString();
  if(s.lastCheckin === today) return;
  s.lastCheckin = today;
  setStats(s);
  setTimeout(()=> awardXp(XP.checkin, null, 'Daily check-in'), 900);
}

function updateLevelChip() {
  const s = getStats();
  const chip = document.getElementById('level-chip');
  if(chip) chip.innerHTML =
    `<i class="ti ti-star-filled" style="font-size:13px"></i> Lv ${levelFromXp(s.xp)} <span class="streak-flame">🔥${s.streak}</span>`;
}

function floatXp(text) {
  const el = document.createElement('div');
  el.className = 'xp-float';
  el.textContent = text;
  el.style.left = (30 + Math.random()*40) + '%';
  el.style.top = '55%';
  document.body.appendChild(el);
  setTimeout(()=>el.remove(), 1300);
}

function confetti() {
  const colors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#E24B4A','#FAC775'];
  for(let i=0; i<44; i++) {
    const bit = document.createElement('div');
    bit.className = 'confetti-bit';
    bit.style.left = Math.random()*100 + 'vw';
    bit.style.background = colors[i % colors.length];
    bit.style.animationDelay = (Math.random()*0.5)+'s';
    bit.style.borderRadius = Math.random()>0.5 ? '50%' : '2px';
    document.body.appendChild(bit);
    setTimeout(()=>bit.remove(), 3000);
  }
}

function showLevelUp(level) {
  // If another modal is open (e.g. the bored overlay), queue the celebration so it
  // doesn't clobber that modal's focus trap — it fires when the current modal closes.
  if(trapOverlay) { pendingLevelUp = Math.max(pendingLevelUp || 0, level); return; }
  const card = document.getElementById('levelup-card');
  card.innerHTML = `
    <div class="levelup-burst">⭐</div>
    <div class="levelup-num">Level ${level}</div>
    <h3>Level up!</h3>
    <p>You're on a roll. Keep exploring to unlock more badges and climb the leaderboard.</p>
    <button class="btn btn-primary btn-block" onclick="closeLevelUp()">Let's go <i class="ti ti-arrow-right"></i></button>`;
  document.getElementById('levelup-overlay').classList.add('open');
  activateModal(document.getElementById('levelup-overlay'));
}
function closeLevelUp() { document.getElementById('levelup-overlay').classList.remove('open'); deactivateModal(); }

/* ════════ AUTH ════════ */
let selectedInterests = new Set();
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active',i===(tab==='login'?0:1)));
  document.getElementById('auth-login').style.display = tab==='login'?'block':'none';
  document.getElementById('auth-signup').style.display = tab==='signup'?'block':'none';
  renderInterestsPicker();
}
function renderInterestsPicker() {
  const grid = document.getElementById('interests-grid');
  if(grid) grid.innerHTML = INTERESTS.map(i =>
    `<button type="button" class="interest-chip ${selectedInterests.has(i)?'selected':''}" aria-pressed="${selectedInterests.has(i)}" onclick="toggleInterest('${i}')">${i}</button>`).join('');
  updateInterestCount();
}

/* ── credentials: hash passwords at rest (PBKDF2), migrate legacy plaintext ── */
function randSaltHex() {
  const a = new Uint8Array(16);
  (crypto && crypto.getRandomValues) ? crypto.getRandomValues(a) : a.forEach((_,i)=>a[i]=i);
  return [...a].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function deriveHash(pass, saltHex) {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(saltHex.match(/.{2}/g).map(b=>parseInt(b,16)));
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2', salt, iterations:100000, hash:'SHA-256'}, keyMat, 256);
  return [...new Uint8Array(bits)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function makeCredential(pass) {
  if(!(window.crypto && crypto.subtle)) return {password: pass};
  try { const salt = randSaltHex(); return {salt, hash: await deriveHash(pass, salt)}; }
  catch { return {password: pass}; }
}
async function verifyCredential(user, pass) {
  if(user.hash && user.salt) { try { return (await deriveHash(pass, user.salt)) === user.hash; } catch { return false; } }
  return user.password === pass;
}
function updateInterestCount() {
  const el = document.getElementById('interest-count');
  if(!el) return;
  const n = selectedInterests.size;
  el.textContent = n < 2 ? `${n} selected · pick ${2-n} more` : `${n} selected ✓`;
  el.classList.toggle('ok', n>=2);
}
function toggleInterest(i) { selectedInterests.has(i) ? selectedInterests.delete(i) : selectedInterests.add(i); renderInterestsPicker(); }

async function doLogin() {
  if(authBusy) return;
  authBusy = true;
  try {
    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const pass = document.getElementById('login-password').value;
    const users = getUsers();
    const errEl = document.getElementById('login-error');
    const u = users[email];
    if(!u || !(await verifyCredential(u, pass))) { errEl.textContent='Incorrect email or password.'; errEl.style.display='block'; return; }
    errEl.style.display='none';
    // Migrate legacy plaintext only if a hash was actually produced (don't erase the sole credential).
    if(u.password && !u.hash) {
      const cred = await makeCredential(pass);
      if(cred.hash) { Object.assign(u, cred); delete u.password; users[email]=u; saveUsers(users); }
    }
    currentUser = u;
    const remember = document.getElementById('remember-me').checked;
    if(remember) store.set('session', email);
    else store.set('session', null);
    launchApp();
  } finally { authBusy = false; }
}

async function doSignup() {
  if(authBusy) return;
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const pass = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  if(!name||!email||pass.length<6) { errEl.textContent='Please fill all fields (password min 6 chars).'; errEl.style.display='block'; return; }
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { errEl.textContent='Please enter a valid email address.'; errEl.style.display='block'; return; }
  if(selectedInterests.size<2) { errEl.textContent='Pick at least 2 interests.'; errEl.style.display='block'; return; }
  const users = getUsers();
  if(users[email]) { errEl.textContent='That email is already registered.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  authBusy = true;
  try {
    const initials = name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
    const color = COLORS[Object.keys(users).length % COLORS.length];
    const cred = await makeCredential(pass);
    if(getUsers()[email]) return; // a concurrent submit already created it
    const user = { name, email, ...cred, initials, color, interests:[...selectedInterests], joined: Date.now() };
    users[email] = user;
    saveUsers(users);
    currentUser = user;
    store.set('session', email);
    launchApp();
    setTimeout(()=>{ confetti(); showToast(`Welcome to BoredOut, ${name.split(' ')[0]}!`, 'achievement', 'ti-sparkles'); maybeShowTour(true); }, 600);
  } finally { authBusy = false; }
}

function logout() {
  store.set('session', null);
  currentUser = null;
  document.getElementById('main-app').style.display='none';
  document.getElementById('auth-overlay').style.display='flex';
  switchAuthTab('login');
  showToast('Signed out');
}

function seedDemoData() {
  if(store.get(ukey('seeded'))) return;
  if(!getUserPlans().length) setUserData('plans', [
    {id:1,title:'Riverside Park Morning Run',cat:'sports',month:'Jun',day:'14',time:'7:30 AM',location:'Riverside Park',people:['MC','JP'],status:'confirmed',rsvp:'going'},
    {id:2,title:'Ramen + Arcade Night',cat:'food',month:'Jun',day:'17',time:'6:00 PM',location:'East Village',people:['AW','TB'],status:'confirmed',rsvp:'going'},
    {id:3,title:'MoMA Saturday Visit',cat:'arts',month:'Jun',day:'21',time:'2:00 PM',location:'MoMA, Midtown',people:['PN'],status:'pending',rsvp:'maybe'},
  ]);
  if(!getUserRequests().length) setUserData('requests', [
    {id:1,name:'Maya Chen',init:'MC',color:'#7F77DD',sub:'0.3 mi away · 2 mutual friends'},
    {id:2,name:'Jordan Park',init:'JP',color:'#1D9E75',sub:'0.8 mi away · 1 mutual friend'},
  ]);
  if(!getUserNotifs().length) setUserData('notifs', [
    {id:1,text:'Maya Chen wants to hang out with you',icon:'ti-user-plus',type:'purple',time:'2m ago',read:false},
    {id:2,text:'Jordan Park wants to hang out with you',icon:'ti-user-plus',type:'purple',time:'5m ago',read:false},
    {id:3,text:'Free Jazz in the Park starts at 3 PM nearby',icon:'ti-music',type:'amber',time:'1h ago',read:false},
  ]);
  store.set(ukey('seeded'), true);
}

function launchApp() {
  document.getElementById('auth-overlay').style.display='none';
  document.getElementById('main-app').style.display='block';
  seedDemoData();
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
  if(deferredInstall && !store.get('install_dismissed')) document.getElementById('install-banner').classList.add('show');
}

function updateReqBadges() {
  const n = getUserRequests().filter(r=>!r.fromMe).length;
  const badge = document.getElementById('req-count-badge');
  const bnav = document.getElementById('bnav-req-badge');
  if(n) { badge.textContent=n; badge.style.display='inline'; bnav.textContent=n; bnav.style.display='flex'; }
  else { badge.style.display='none'; bnav.style.display='none'; }
}

function updateNavAvatar() {
  const btn = document.getElementById('nav-avatar');
  btn.textContent = currentUser.initials;
  btn.style.background = currentUser.color;
}

function updateGreeting() {
  const lines = {
    morning:'Good morning! What\'s the move today?',
    afternoon:'Good afternoon! Bored already?',
    evening:'It\'s the evening — perfect time for plans.',
    night:'Night owl mode. Let\'s find something.',
  };
  document.getElementById('hero-greeting').textContent = `Hey ${currentUser.name.split(' ')[0]} 👋`;
  document.getElementById('hero-sub').textContent = lines[dayPart()];
}

function applyHeroVibe() {
  const hero = document.getElementById('hero');
  if(hero) hero.style.background = HERO_VIBES[dayPart()];
}

/* ════════ LOCATION & WEATHER ════════ */
function detectLocation(manual) {
  const input = document.getElementById('location-input');
  const saved = store.get(ukey('location'));
  const coords = store.get(ukey('coords'));
  if(saved && !manual) {
    input.value = saved;
    if(coords) fetchWeather(coords.lat, coords.lon); else showCachedWeather();
    return;
  }
  if(!navigator.geolocation) { input.value = saved || 'New York, NY'; return; }
  input.value = 'Detecting…';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const {latitude: lat, longitude: lon} = pos.coords;
      store.set(ukey('coords'), {lat, lon});
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(r=>r.json())
        .then(d=>{
          const a = d.address || {};
          const city = a.city||a.town||a.village||a.county||'Your area';
          const state = a.state_code||a.state||'';
          input.value = state ? `${city}, ${state}` : city;
          store.set(ukey('location'), input.value);
          if(manual) showToast(`Location set to ${input.value}`);
        }).catch(()=>{ input.value = saved || 'New York, NY'; });
      fetchWeather(lat, lon);
    },
    () => { input.value = saved || 'New York, NY'; if(manual) showToast('Could not get your location — type your city instead'); }
  );
}

const WMO_CODES = {
  0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',
  45:'Foggy',48:'Icy fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',
  61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',
  80:'Rain showers',81:'Heavy showers',82:'Violent showers',95:'Thunderstorm',96:'Thunderstorm w/ hail',
};
const WMO_ICON = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'❄️',75:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',95:'⛈️',96:'⛈️',
};

function paintWeather(w) {
  const bar = document.getElementById('weather-bar');
  if(!bar || !w) return;
  document.getElementById('weather-icon').textContent = w.icon;
  document.getElementById('weather-temp').textContent = `${w.temp}°F`;
  document.getElementById('weather-desc').textContent = w.desc;
  document.getElementById('weather-tip').textContent = w.tip || '';
  bar.style.display = 'flex';
}
function getFreshWeather() {
  if(!currentUser) return null;
  const w = store.get(ukey('weather'));
  if(!w) return null;
  if(w.fetchedAt && (Date.now() - w.fetchedAt) > 7200000) return null; // ignore >2h old
  return w;
}
function showCachedWeather() { const w = getFreshWeather(); if(w) paintWeather(w); }

function fetchWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph`)
    .then(r => r.json())
    .then(d => {
      const c = d.current; if(!c) return;
      const code = c.weathercode;
      const temp = Math.round(c.temperature_2m);
      const isRainy = [51,53,55,61,63,65,80,81,82,95,96].includes(code);
      const isCold = temp < 40;
      const isHot = temp > 90;
      const tip = isRainy ? 'Rainy — great day for indoor activities' :
                  isCold  ? 'Bundle up if heading outside!' :
                  isHot   ? 'Hot out — stay hydrated!' :
                  'Great weather to get out there!';
      const w = {code, temp, desc: WMO_CODES[code]||'Weather', icon: WMO_ICON[code]||'🌡️', isRainy, isCold, isHot, tip, fetchedAt: Date.now()};
      store.set(ukey('weather'), w);
      paintWeather(w);
      if(document.getElementById('page-discover').classList.contains('active')) renderForYou();
    }).catch(() => {});
}

/* ════════ SUGGESTION ENGINE ════════ */
function dayPart() {
  const h = new Date().getHours();
  return h<12 ? 'morning' : h<17 ? 'afternoon' : h<21 ? 'evening' : 'night';
}

function scoreActivity(a) {
  let score = Math.random()*2;
  const myInterests = currentUser.interests || [];
  const catInts = CAT_INTERESTS[a.cat] || [];
  const overlap = catInts.filter(i=>myInterests.includes(i)).length;
  score += overlap * 3;
  if(DAYPART_CATS[dayPart()].includes(a.cat)) score += 2;
  if(a.cost==='Free') score += 0.5;
  const wx = getFreshWeather();
  if(wx) {
    if(wx.isRainy && a.cat==='outdoor') score -= 4;
    if(!wx.isRainy && a.cat==='outdoor') score += 1.5;
    if(wx.isCold && ['outdoor','sports'].includes(a.cat)) score -= 1;
  }
  return score;
}

function matchPercent(a) {
  const myInterests = currentUser.interests || [];
  const catInts = CAT_INTERESTS[a.cat] || [];
  const overlap = catInts.filter(i=>myInterests.includes(i)).length;
  let pct = 62 + overlap*11;
  if(DAYPART_CATS[dayPart()].includes(a.cat)) pct += 8;
  return Math.min(99, pct + (a.id*7)%5);
}

let lastSuggestId = null;
function pickSuggestion() {
  const joined = getUserJoined();
  let pool = ACTIVITIES.filter(a=>!joined.has(a.id) && a.id!==lastSuggestId);
  if(!pool.length) pool = ACTIVITIES.filter(a=>a.id!==lastSuggestId);
  if(!pool.length) pool = [...ACTIVITIES];
  pool.sort((x,y)=>scoreActivity(y)-scoreActivity(x));
  const top = pool.slice(0, Math.min(3, pool.length));
  const pick = top[Math.floor(Math.random()*top.length)];
  lastSuggestId = pick.id;
  return pick;
}

function whyText(a) {
  const myInterests = currentUser.interests || [];
  const catInts = CAT_INTERESTS[a.cat] || [];
  const overlap = catInts.filter(i=>myInterests.includes(i));
  const wx = getFreshWeather();
  if(wx && wx.isRainy && a.cat!=='outdoor') return 'Indoor pick — it\'s wet out there';
  if(overlap.length) return `Because you're into ${overlap[0].toLowerCase()}`;
  if(DAYPART_CATS[dayPart()].includes(a.cat)) return `Perfect for ${dayPart()==='night'?'late night':'the '+dayPart()}`;
  if(a.cost==='Free') return 'Because it\'s free!';
  return 'Something new to try';
}

function openBored() {
  document.getElementById('bored-overlay').classList.add('open');
  activateModal(document.getElementById('bored-overlay'));
  const s = getStats();
  s.boredUses = (s.boredUses||0)+1;
  setStats(s);
  awardXp(XP.bored, null, 'Used I\'m bored');
  spinSuggestion();
}

let spinTimer = null;
function spinSuggestion() {
  const card = document.getElementById('suggest-card');
  card.classList.add('shuffling');
  const emojis = ['🎲','🎯','🎪','🎨','🎵','🍕','🏀','🎬'];
  let tick = 0;
  clearInterval(spinTimer);
  const spin = setInterval(()=>{
    card.innerHTML = `<div class="suggest-emoji">${emojis[tick%emojis.length]}</div><h3>Finding your cure...</h3>`;
    tick++;
  }, 90);
  spinTimer = setTimeout(()=>{
    clearInterval(spin);
    card.classList.remove('shuffling');
    const a = pickSuggestion();
    card.innerHTML = `
      <div class="suggest-emoji">${a.emoji}</div>
      <h3>${a.title}</h3>
      <div class="suggest-meta"><i class="ti ti-map-pin"></i> ${a.location} · ${a.dist} · ${a.cost}</div>
      <div class="suggest-why"><i class="ti ti-sparkles" style="font-size:12px"></i> ${whyText(a)}</div>
      <div class="suggest-actions">
        <button class="btn btn-outline" onclick="spinSuggestion()"><i class="ti ti-refresh"></i> Next</button>
        <button class="btn btn-primary" onclick="acceptSuggestion(${a.id})"><i class="ti ti-check"></i> Let's do it!</button>
      </div>`;
  }, 900);
}

function acceptSuggestion(id) {
  const a = ACTIVITIES.find(x=>x.id===id);
  const joined = getUserJoined();
  if(!joined.has(id)) { joined.add(id); setUserData('joined', [...joined]); awardXp(XP.join, 'joins'); }
  const plans = getUserPlans();
  if(plans.some(p=>p.title===a.title && p.location===a.location)) {
    closeBored();
    showToast(`"${a.title}" is already in your plans!`);
    renderActivities();
    return;
  }
  const d = new Date();
  plans.unshift({id:Date.now(),title:a.title,cat:a.cat,month:MONTHS[d.getMonth()],day:String(d.getDate()),time:a.time==='Anytime'||a.time==='Flexible'?'Today':a.time,location:a.location,people:[],status:'confirmed',rsvp:'going'});
  setUserData('plans', plans);
  closeBored();
  confetti();
  showToast(`Boredom cured — "${a.title}" added to your plans!`, 'achievement', 'ti-sparkles');
  addNotif(`You're doing ${a.title} today!`, 'ti-calendar-check', 'green');
  renderActivities(); renderPlans();
}

function closeBored() { document.getElementById('bored-overlay').classList.remove('open'); deactivateModal(); }

/* ════════ DISCOVER ════════ */
let activeCategory = null;
let activeFilter = 'all';
let activeMood = null;

function renderDiscover() {
  renderForYou();
  renderRecent();
  renderMoodChips();
  renderCategories();
  renderFilters();
  renderActivities();
}

function renderForYou() {
  const sorted = [...ACTIVITIES].sort((x,y)=>scoreActivity(y)-scoreActivity(x)).slice(0,6);
  document.getElementById('foryou-row').innerHTML = sorted.map(a=>`
    <div class="foryou-card" onclick="openDetail(${a.id})">
      <div class="foryou-img" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}<span class="match-pill">${matchPercent(a)}% match</span></div>
      <div class="foryou-body"><h4>${a.title}</h4><span><i class="ti ti-map-pin" style="font-size:11px"></i> ${a.dist} · ${a.cost}</span></div>
    </div>`).join('');
}

function renderRecent() {
  const ids = getRecent();
  const section = document.getElementById('recent-section');
  const acts = ids.map(id=>ACTIVITIES.find(a=>a.id===id)).filter(Boolean);
  if(!acts.length) { section.style.display='none'; return; }
  section.style.display='block';
  document.getElementById('recent-row').innerHTML = acts.map(a=>`
    <div class="foryou-card" onclick="openDetail(${a.id})">
      <div class="foryou-img" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}</div>
      <div class="foryou-body"><h4>${a.title}</h4><span><i class="ti ti-map-pin" style="font-size:11px"></i> ${a.dist} · ${a.cost}</span></div>
    </div>`).join('');
}
function pushRecent(id) {
  let ids = getRecent().filter(x=>x!==id);
  ids.unshift(id);
  setUserData('recent', ids.slice(0,6));
}

function renderMoodChips() {
  document.querySelectorAll('#mood-row .mood-chip').forEach(c=>c.classList.toggle('active', c.dataset.mood===activeMood));
}
function setMood(m) {
  activeMood = activeMood===m ? null : m;
  renderMoodChips();
  renderActivities();
  const title = document.getElementById('activities-title');
  title.textContent = activeMood ? `Things to ${m==='eat'?'eat':m==='social'?'meet people':m} near you` : (activeCategory ? CATEGORIES.find(c=>c.id===activeCategory).label+' near you' : 'All activities near you');
}

function renderCategories() {
  document.getElementById('cat-grid').innerHTML = CATEGORIES.map(c =>
    `<div class="cat-card ${activeCategory===c.id?'active':''}" onclick="selectCategory('${c.id}')">
      <div class="cat-icon" style="${activeCategory===c.id?`background:${c.color};color:white`:''}"><i class="ti ${c.icon}" aria-hidden="true"></i></div>
      <span class="cat-label">${c.label}</span>
    </div>`).join('');
}

function selectCategory(id) {
  activeCategory = activeCategory===id ? null : id;
  if(activeCategory) activeMood = null;
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
    el.className = 'filter-pill'+(activeFilter===f?' active':'');
    el.textContent = label;
    el.onclick = () => { activeFilter=f; row.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active')); el.classList.add('active'); renderActivities(); };
    row.appendChild(el);
  });
}

function isTonight(a) {
  const t = a.time;
  if(['Anytime','Flexible','All day'].includes(t)) return true;
  if(/Until/i.test(t)) return true;
  const m = t.match(/(\d{1,2})/);
  if(!m) return false;
  let h = parseInt(m[1],10);
  if(/PM/i.test(t) && h<12) h += 12;
  if(/AM/i.test(t) && h===12) h = 0;
  return h >= 17;
}

function activityRating(a) {
  const r = getUserRatings().find(x=>x.id===a.id);
  return r ? {avg:r.avg, count:r.count, mine:r.rating} : {avg:(3+(a.id*13%20)/10).toFixed(1), count:Math.floor(a.going/3)+2, mine:0};
}

function friendsGoing(a) {
  const friends = getUserFriends();
  return friends.filter(f => ((f.id*7 + a.id*3) % 4) === 0).slice(0,3);
}

function whenLabel(a) {
  if(['Anytime','Flexible','All day'].includes(a.time)) return a.time;
  return (isTonight(a) ? 'Tonight · ' : 'Today · ') + a.time;
}

function renderActivities() {
  let acts = [...ACTIVITIES];
  const search = (document.getElementById('activity-search')?.value||'').trim().toLowerCase();
  if(activeCategory) acts = acts.filter(a=>a.cat===activeCategory);
  if(activeMood) acts = acts.filter(a=>(MOOD_CATS[activeMood]||[]).includes(a.cat));
  if(activeFilter==='free') acts = acts.filter(a=>a.cost==='Free');
  if(activeFilter==='tonight') acts = acts.filter(isTonight);
  if(activeFilter==='popular') acts = acts.filter(a=>a.going>=20);
  if(search) acts = acts.filter(a=>a.title.toLowerCase().includes(search)||a.location.toLowerCase().includes(search)||a.desc.toLowerCase().includes(search));
  const joined = getUserJoined();
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#534AB7'];
  const avInits = ['MJ','TK','AS','RL','PD'];
  const grid = document.getElementById('activity-grid');
  if(!acts.length) {
    grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><i class="ti ti-mood-sad"></i><p>No activities found. Try a different filter or search.</p>
      <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="clearActivityFilters()"><i class="ti ti-x"></i> Clear filters</button></div>`;
    return;
  }
  grid.innerHTML = acts.map(a => {
    const isJoined = joined.has(a.id);
    const r = activityRating(a);
    const stack = Array.from({length:Math.min(3,Math.floor(a.going/4))},(_,i)=>`<div class="av" style="background:${avColors[i%5]}">${avInits[i]}</div>`).join('');
    const stars = [1,2,3,4,5].map(s=>`<button type="button" class="star ${s<=r.mine?'filled':''}" onclick="rateActivity(${a.id},${s},event)" aria-label="Rate ${s} stars">★</button>`).join('');
    const fg = friendsGoing(a);
    const fgLabel = fg.length ? `<div class="friends-going"><i class="ti ti-friends"></i> ${fg.map(f=>f.name.split(' ')[0]).join(', ')} going</div>` : '';
    return `<div class="activity-card" onclick="openDetail(${a.id})">
      <div class="activity-img" style="background:${CAT_COLORS[a.cat]}22">
        <span>${a.emoji}</span>
        ${a.badge?`<span class="activity-badge ${a.badge}">${a.badge==='free'?'FREE':'🔥 Hot'}</span>`:''}
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
  activeCategory = null; activeMood = null; activeFilter = 'all';
  const s = document.getElementById('activity-search'); if(s) s.value='';
  document.getElementById('activities-title').textContent = 'All activities near you';
  renderMoodChips(); renderCategories(); renderFilters(); renderActivities();
}

function joinActivity(id) {
  const joined = getUserJoined();
  const act = ACTIVITIES.find(a=>a.id===id);
  if(joined.has(id)) {
    joined.delete(id);
    showToast('Removed from your activities');
  } else {
    joined.add(id);
    showToast(`Joined "${act.title}"!`);
    addNotif(`You joined ${act.title}`, 'ti-calendar-check', 'green');
    awardXp(XP.join, 'joins');
  }
  setUserData('joined', [...joined]);
  renderActivities();
}

function rateActivity(id, rating, e) {
  if(e) e.stopPropagation();
  let ratings = getUserRatings();
  const existing = ratings.find(r=>r.id===id);
  const act = ACTIVITIES.find(a=>a.id===id);
  const baseAvg = 3+(act.id*13%20)/10;
  const baseCount = Math.floor(act.going/3)+2;
  const newAvg = ((baseAvg*baseCount+rating)/(baseCount+1)).toFixed(1);
  if(existing) { existing.rating=rating; existing.avg=newAvg; existing.count=baseCount+1; }
  else { ratings.push({id, rating, avg:newAvg, count:baseCount+1}); awardXp(XP.rate, 'rates'); }
  setUserData('ratings', ratings);
  showToast(`Rated ${rating} star${rating!==1?'s':''} — thanks!`);
  renderActivities();
}

function shuffleActivities() { ACTIVITIES.sort(()=>Math.random()-0.5); renderActivities(); showToast('Shuffled!'); }

/* ════════ ACTIVITY DETAIL ════════ */
function openDetail(id) {
  const a = ACTIVITIES.find(x=>x.id===id);
  if(!a) return;
  pushRecent(id);
  const joined = getUserJoined().has(id);
  const r = activityRating(a);
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#534AB7'];
  const avInits = ['MJ','TK','AS','RL','PD'];
  const stack = Array.from({length:Math.min(5,Math.floor(a.going/3))},(_,i)=>`<div class="av" style="background:${avColors[i%5]};width:28px;height:28px;font-size:10px">${avInits[i%5]}</div>`).join('');
  const fg = friendsGoing(a);
  const fgLine = fg.length ? `<div class="detail-friends"><i class="ti ti-friends"></i> ${fg.map(f=>f.name.split(' ')[0]).join(', ')} ${fg.length===1?'is':'are'} going</div>` : '';
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
  const a = ACTIVITIES.find(x=>x.id===id);
  const link = location.origin + location.pathname + '#a=' + id;
  const text = `Hey! Want to join me for "${a.title}" at ${a.location}? Found it on BoredOut: ${link}`;
  if(navigator.share) {
    navigator.share({title:'BoredOut', text, url:link}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text).then(()=>showToast('Invite copied to clipboard — paste it anywhere!')).catch(()=>showToast('Could not copy — try again'));
  }
}

function handleDeepLink() {
  const m = (location.hash||'').match(/a=(\d+)/);
  if(m) {
    const id = parseInt(m[1],10);
    if(ACTIVITIES.some(a=>a.id===id)) setTimeout(()=>openDetail(id), 400);
    history.replaceState(null,'',location.pathname);
  }
}

/* ════════ PEOPLE ════════ */
let activePeopleFilter = 'all';
let peopleMode = 'browse';
let deckIndex = 0;
let deckPool = [];
let deckHistory = [];
let swipeTimer = null;

function setPeopleMode(mode) {
  peopleMode = mode;
  document.getElementById('mode-browse').classList.toggle('active', mode==='browse');
  document.getElementById('mode-match').classList.toggle('active', mode==='match');
  document.getElementById('people-browse').style.display = mode==='browse'?'block':'none';
  document.getElementById('people-match').style.display = mode==='match'?'block':'none';
  if(mode==='match') startDeck();
}

function startDeck() {
  const friends = getUserFriends();
  const requests = getUserRequests();
  deckPool = PEOPLE.filter(p=>!friends.some(f=>f.id===p.id) && !requests.some(r=>r.id===p.id));
  deckIndex = 0;
  deckHistory = [];
  renderDeck();
}

function renderDeck() {
  const wrap = document.getElementById('deck-wrap');
  if(deckIndex >= deckPool.length) {
    wrap.innerHTML = `<div class="empty"><i class="ti ti-cards"></i><p>You've seen everyone nearby!<br>Check back later for new people.</p>
      <button class="btn btn-outline btn-sm" style="margin-top:12px" onclick="startDeck()"><i class="ti ti-refresh"></i> Start over</button></div>`;
    return;
  }
  const p = deckPool[deckIndex];
  const shared = (currentUser.interests||[]);
  wrap.innerHTML = `
    <div class="deck-card" id="deck-card">
      ${p.online?'<span class="deck-online"><span class="online-dot-inline"></span> online now</span>':''}
      <div class="deck-avatar" style="background:${p.color}">${p.init}</div>
      <h3>${p.name}</h3>
      <div class="person-sub" style="justify-content:center"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist} away${p.mutual?' · '+p.mutual+' mutual':''}</div>
      <p class="mood">"${p.mood}"</p>
      <div class="deck-tags">${p.tags.map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
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

function deckSwipe(connect) {
  const card = document.getElementById('deck-card');
  if(!card || card.classList.contains('swipe-right') || card.classList.contains('swipe-left')) return;
  const p = deckPool[deckIndex];
  if(navigator.vibrate) navigator.vibrate(15);
  card.classList.add(connect ? 'swipe-right' : 'swipe-left');
  let wasNew = false;
  if(connect) {
    const requests = getUserRequests();
    if(!requests.find(r=>r.id===p.id)) {
      requests.push({id:p.id, name:p.name, init:p.init, color:p.color, sub:'Nearby · request sent', fromMe:true});
      setUserData('requests', requests);
      wasNew = true;
    }
    showToast(`Request sent to ${p.name}!`);
    awardXp(XP.friend, null, 'Sent a connection request');
  }
  deckHistory.push({index:deckIndex, connected:connect, personId:p.id, wasNew});
  clearTimeout(swipeTimer);
  swipeTimer = setTimeout(()=>{ swipeTimer=null; deckIndex++; renderDeck(); }, 320);
}

function undoSwipe() {
  if(!deckHistory.length) return;
  clearTimeout(swipeTimer); swipeTimer = null;
  const last = deckHistory.pop();
  if(last.connected && last.wasNew) {
    setUserData('requests', getUserRequests().filter(r=>!(r.fromMe&&r.id===last.personId)));
  }
  deckIndex = last.index;
  renderDeck();
  showToast('Undone');
}

function attachDeckDrag() {
  const card = document.getElementById('deck-card');
  if(!card) return;
  let startX=0, startY=0, dx=0, dragging=false;
  card.addEventListener('pointerdown', e => {
    dragging=true; startX=e.clientX; startY=e.clientY; dx=0;
    card.style.transition='none';
    card.setPointerCapture(e.pointerId);
  });
  card.addEventListener('pointermove', e => {
    if(!dragging) return;
    dx = e.clientX-startX;
    const dy = e.clientY-startY;
    card.style.transform = `translate(${dx}px, ${dy*0.2}px) rotate(${dx*0.05}deg)`;
    card.style.opacity = String(Math.max(0.4, 1 - Math.abs(dx)/400));
  });
  const end = () => {
    if(!dragging) return;
    dragging=false;
    card.style.transition='';
    if(Math.abs(dx) > 90) { deckSwipe(dx>0); }
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
  document.querySelectorAll('#people-filter-row .filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderPeople();
}

function personActionsHtml(p) {
  const friends = getUserFriends();
  const requests = getUserRequests();
  const isFriend = friends.some(f=>f.id===p.id);
  const reqSent = requests.some(r=>r.fromMe&&r.id===p.id);
  const hasIncoming = requests.some(r=>!r.fromMe&&r.id===p.id);
  if(isFriend) {
    return `<button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openChat(${p.id},'${p.name}','${p.init}','${p.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();planWithPerson('${p.name}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>`;
  }
  if(reqSent) {
    return `<button class="btn btn-outline btn-sm" style="flex:1;justify-content:center" onclick="event.stopPropagation();cancelRequest(${p.id},'${p.name}')"><i class="ti ti-clock"></i>Requested · cancel</button>`;
  }
  if(hasIncoming) {
    return `<button class="btn btn-accent btn-sm" onclick="event.stopPropagation();acceptRequest(${p.id},'${p.name}','${p.init}','${p.color}')"><i class="ti ti-check" aria-hidden="true"></i>Accept</button>
            <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();declineRequest(${p.id},'${p.name}')"><i class="ti ti-x" aria-hidden="true"></i>Decline</button>`;
  }
  return `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation();sendFriendReq(${p.id},'${p.name}','${p.init}','${p.color}')"><i class="ti ti-user-plus" aria-hidden="true"></i>Add</button>
          <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();proposeHangout('${p.name}')"><i class="ti ti-calendar-event" aria-hidden="true"></i>Hang out</button>`;
}

function renderPeople() {
  const search = (document.getElementById('people-search')?.value||'').toLowerCase();
  let people = [...PEOPLE];
  if(activePeopleFilter==='online now') people = people.filter(p=>p.online);
  if(activePeopleFilter==='nearby') people = people.filter(p=>parseFloat(p.dist)<1.5);
  if(activePeopleFilter==='new here') people = people.filter(p=>p.mutual===0);
  if(search) people = people.filter(p=>p.name.toLowerCase().includes(search)||p.mood.toLowerCase().includes(search)||p.tags.some(t=>t.toLowerCase().includes(search)));
  const shared = (currentUser.interests||[]);
  document.getElementById('people-grid').innerHTML = people.map(p => {
    return `<div class="person-card" onclick="openPersonProfile(${p.id})">
      ${p.online?'<div class="online-dot" role="img" aria-label="Online now" title="Online now"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.init}</div>
        <div><div class="person-name">${p.name}</div><div class="person-sub"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <p class="person-mood">"${p.mood}"</p>
      <div class="tags">${p.tags.map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
      <div class="person-actions">${personActionsHtml(p)}</div>
    </div>`;
  }).join('') || `<div class="empty" style="grid-column:1/-1"><i class="ti ti-users"></i><p>No people match that. Try another filter.</p></div>`;
}

function openPersonProfile(id) {
  const p = personById(id);
  if(!p) return;
  const shared = (currentUser.interests||[]);
  document.getElementById('person-modal').innerHTML = `
    <div class="modal-header">
      <h2>Profile</h2>
      <button class="icon-btn" onclick="closePerson()" aria-label="Close"><i class="ti ti-x"></i></button>
    </div>
    <div class="person-profile-top">
      <div class="profile-avatar-big" style="background:${p.color};position:relative">${p.init}${p.online?'<span class="online-dot" style="top:auto;bottom:2px;right:2px"></span>':''}</div>
      <h2 style="font-size:1.3rem;font-weight:800;margin-top:10px">${p.name}</h2>
      <div class="person-sub" style="justify-content:center;margin-top:4px"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist} away${p.mutual?' · '+p.mutual+' mutual friends':''}${p.online?' · <span style="color:var(--accent)">online now</span>':''}</div>
    </div>
    <p class="detail-desc" style="text-align:center">${p.bio||p.mood}</p>
    <div class="section-title" style="margin:1rem 0 8px;font-size:13px"><i class="ti ti-tags"></i> Into</div>
    <div class="tags" style="justify-content:center">${p.tags.map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
    <div class="person-actions" style="margin-top:1.25rem">${personActionsHtml(p)}</div>`;
  document.getElementById('person-overlay').classList.add('open');
  activateModal(document.getElementById('person-overlay'));
}
function closePerson() {
  const ov = document.getElementById('person-overlay');
  if(ov.classList.contains('open')) { ov.classList.remove('open'); deactivateModal(); }
}

function refreshPeopleViews() {
  if(document.getElementById('page-people').classList.contains('active') && peopleMode==='browse') renderPeople();
  if(document.getElementById('person-overlay').classList.contains('open')) { /* keep open; live data is fine */ }
}

function sendFriendReq(id, name, init, color) {
  const requests = getUserRequests();
  if(!requests.some(r=>r.id===id)) { requests.push({id, name, init, color, sub:'Nearby · request sent', fromMe:true}); setUserData('requests', requests); }
  showToast(`Friend request sent to ${name}!`);
  addNotif(`You sent a friend request to ${name}`, 'ti-user-plus', 'purple');
  refreshPeopleViews();
  if(document.getElementById('page-friends').classList.contains('active')) renderFriends();
  if(document.getElementById('person-overlay').classList.contains('open')) openPersonProfile(id);
}

function cancelRequest(id, name) {
  setUserData('requests', getUserRequests().filter(r=>!(r.fromMe&&r.id===id)));
  showToast(`Canceled request to ${name}`);
  refreshPeopleViews();
  if(document.getElementById('page-friends').classList.contains('active')) renderFriends();
  if(document.getElementById('person-overlay').classList.contains('open')) openPersonProfile(id);
}

function proposeHangout(name) { showToast(`Hangout request sent to ${name}!`); addNotif(`You proposed a hangout with ${name}`, 'ti-calendar-event', 'amber'); }
function planWithPerson(name) { closePerson(); goTo('plans'); setTimeout(()=>{ openCreatePlan(); document.getElementById('plan-invite').value=name; }, 300); }

function startLivePresence() {
  if(window._presenceTimer) return;
  window._presenceTimer = setInterval(()=>{
    const p = PEOPLE[Math.floor(Math.random()*PEOPLE.length)];
    p.online = !p.online;
    refreshPeopleViews();
  }, 30000);
}

/* ════════ PLANS ════════ */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
let plansFilter = 'all';

function planSortKey(p) {
  const mi = MONTHS.indexOf(p.month);
  const y = new Date().getFullYear();
  return new Date(y, mi<0?0:mi, parseInt(p.day,10)||1).getTime();
}

const PLAN_STATUS = {
  confirmed: {cls:'status-confirmed', label:'Confirmed'},
  pending:   {cls:'status-pending',   label:'Pending'},
  declined:  {cls:'status-declined',  label:"Can't make it"},
};
function planStatusPill(status) {
  const m = PLAN_STATUS[status] || PLAN_STATUS.pending;
  return `<span class="plan-status ${m.cls}">${m.label}</span>`;
}

function renderPlans(filter) {
  if(filter) plansFilter = filter;
  let plans = [...getUserPlans()].sort((a,b)=>planSortKey(a)-planSortKey(b));
  if(plansFilter==='confirmed') plans = plans.filter(p=>p.status==='confirmed');
  if(plansFilter==='pending') plans = plans.filter(p=>p.status==='pending');
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#E24B4A','#534AB7'];
  const rsvpBtn = (p,val,icon,label) => `<button class="rsvp-btn ${(p.rsvp||'going')===val?'active '+val:''}" onclick="setRsvp(${p.id},'${val}')"><i class="ti ${icon}"></i>${label}</button>`;
  document.getElementById('plans-list').innerHTML = plans.length ? plans.map(p => `
    <div class="plan-card">
      <div class="plan-date-box" style="${p.cat?`background:${CAT_COLORS[p.cat]}22`:''}">
        <div class="month">${p.month}</div><div class="day">${p.day}</div>
      </div>
      <div class="plan-info">
        <h3>${p.cat?`<i class="ti ${CAT_ICONS[p.cat]}" style="color:${CAT_COLORS[p.cat]};font-size:14px"></i> `:''}${escapeHtml(p.title)}</h3>
        <div class="meta-item" style="margin:4px 0"><i class="ti ti-clock" style="font-size:13px"></i><span style="font-size:12px;color:var(--text-muted)">${escapeHtml(p.time)} · ${escapeHtml(p.location)}</span></div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
          <div class="avatar-stack">${(p.people||[]).map((av,j)=>`<div class="av" style="background:${avColors[j%6]}">${av}</div>`).join('')}</div>
          ${p.people&&p.people.length?`<span style="font-size:12px;color:var(--text-muted)">${p.people.length} friend${p.people.length!==1?'s':''}</span>`:''}
          ${planStatusPill(p.status)}
        </div>
        <div class="rsvp-row">
          ${rsvpBtn(p,'going','ti-check','Going')}
          ${rsvpBtn(p,'maybe','ti-help','Maybe')}
          ${rsvpBtn(p,'cant','ti-x','Can\'t')}
        </div>
      </div>
      <div class="plan-card-actions">
        <button class="icon-btn btn-sm" onclick="editPlan(${p.id})" aria-label="Edit plan"><i class="ti ti-pencil"></i></button>
        <button class="icon-btn btn-sm plan-del" onclick="removePlan(${p.id})" aria-label="Delete plan"><i class="ti ti-trash" aria-hidden="true"></i></button>
      </div>
    </div>`).join('')
    : `<div class="empty"><i class="ti ti-calendar-off"></i><p>No plans yet.<br>Hit the button below and we'll find you something.</p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="openBored()"><i class="ti ti-sparkles"></i> I'm bored!</button></div>`;
}

function setRsvp(id, val) {
  const plans = getUserPlans();
  const p = plans.find(x=>x.id===id);
  if(!p) return;
  p.rsvp = val;
  p.status = val==='going' ? 'confirmed' : val==='cant' ? 'declined' : 'pending';
  setUserData('plans', plans);
  renderPlans();
  showToast(val==='going'?'You\'re going! 🎉':val==='maybe'?'Marked as maybe':'Marked as can\'t make it');
}

function filterPlans(f, el) {
  document.querySelectorAll('#page-plans .filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderPlans(f);
}

function removePlan(id) {
  setUserData('plans', getUserPlans().filter(p=>p.id!==id));
  renderPlans();
  showToast('Plan removed');
}

let editingPlanId = null;
function openCreatePlan() {
  editingPlanId = null;
  document.getElementById('plan-modal-title').textContent = 'Create a plan';
  document.getElementById('plan-submit-label').textContent = 'Create';
  ['plan-title','plan-location','plan-invite','plan-notes'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('plan-type').value = 'social';
  document.getElementById('plan-error').style.display='none';
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('plan-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('plan-time').value = '18:00';
  activateModal(document.getElementById('modal-overlay'));
}

function editPlan(id) {
  const p = getUserPlans().find(x=>x.id===id);
  if(!p) return;
  editingPlanId = id;
  document.getElementById('plan-modal-title').textContent = 'Edit plan';
  document.getElementById('plan-submit-label').textContent = 'Save';
  document.getElementById('plan-title').value = p.title;
  document.getElementById('plan-type').value = p.cat || 'social';
  document.getElementById('plan-location').value = p.location==='TBD'?'':p.location;
  document.getElementById('plan-invite').value = '';
  document.getElementById('plan-notes').value = p.notes || '';
  document.getElementById('plan-error').style.display='none';
  const mi = MONTHS.indexOf(p.month);
  const y = new Date().getFullYear();
  const d = new Date(y, mi<0?0:mi, parseInt(p.day,10)||1);
  document.getElementById('plan-date').value = d.toISOString().split('T')[0];
  document.getElementById('plan-time').value = to24h(p.time);
  document.getElementById('modal-overlay').classList.add('open');
  activateModal(document.getElementById('modal-overlay'));
}

function closePlanModal() { document.getElementById('modal-overlay').classList.remove('open'); deactivateModal(); }

function fmtTime(t) {
  if(!t) return '6:00 PM';
  if(!/^\d{1,2}:\d{2}$/.test(t)) return t;
  let [h,m] = t.split(':').map(Number);
  const ap = h>=12 ? 'PM' : 'AM';
  h = h%12; if(h===0) h=12;
  return `${h}:${String(m).padStart(2,'0')} ${ap}`;
}
function to24h(t) {
  if(/^\d{1,2}:\d{2}$/.test(t)) return t;
  const m = (t||'').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if(!m) return '18:00';
  let h = parseInt(m[1],10); const min = m[2]; const ap = m[3].toUpperCase();
  if(ap==='PM' && h<12) h+=12; if(ap==='AM' && h===12) h=0;
  return `${String(h).padStart(2,'0')}:${min}`;
}

function createPlan() {
  const title = document.getElementById('plan-title').value.trim();
  const errEl = document.getElementById('plan-error');
  if(!title) { errEl.textContent='Please enter a plan title.'; errEl.style.display='block'; return; }
  const dateVal = document.getElementById('plan-date').value;
  const d = dateVal ? new Date(dateVal+'T00:00:00') : new Date();
  const today = new Date(); today.setHours(0,0,0,0);
  if(d < today) { errEl.textContent='That date is in the past — pick today or later.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  const cat = document.getElementById('plan-type').value;
  const invite = document.getElementById('plan-invite').value.trim();
  const people = invite ? [invite.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()] : [];
  const time = fmtTime(document.getElementById('plan-time').value);
  const location = document.getElementById('plan-location').value.trim() || 'TBD';
  const notes = document.getElementById('plan-notes').value.trim();
  const plans = getUserPlans();

  if(editingPlanId) {
    const p = plans.find(x=>x.id===editingPlanId);
    if(p) { Object.assign(p, {title, cat, month:MONTHS[d.getMonth()], day:String(d.getDate()), time, location, notes, people: people.length?people:p.people}); }
    setUserData('plans', plans);
    closePlanModal(); renderPlans();
    showToast(`"${title}" updated!`);
    editingPlanId = null;
    return;
  }

  plans.unshift({id:Date.now(),title,cat,month:MONTHS[d.getMonth()],day:String(d.getDate()),time,location,notes,people,status:'pending',rsvp:'going'});
  setUserData('plans', plans);
  closePlanModal();
  renderPlans();
  awardXp(XP.plan, 'plans');
  showToast(`"${title}" plan created!`);
  addNotif(`New plan: ${title} on ${MONTHS[d.getMonth()]} ${d.getDate()}`, 'ti-calendar-check', 'green');
}

/* ════════ FRIENDS ════════ */
let currentFTab = 'friends';
function renderFriends() {
  const friends = getUserFriends();
  const requests = getUserRequests().filter(r=>!r.fromMe);
  document.getElementById('friends-count').textContent = friends.length ? `(${friends.length})` : '';
  updateReqBadges();

  document.getElementById('friends-panel').innerHTML = friends.length
    ? `<div class="people-grid">${friends.map(f=>`
        <div class="person-card">
          <div class="person-header" onclick="openPersonProfile(${f.id})" style="cursor:pointer">
            <div class="person-avatar" style="background:${f.color}">${f.init}</div>
            <div><div class="person-name">${f.name}</div><div class="person-sub">Friends</div></div>
          </div>
          <div class="person-actions">
            <button class="btn btn-primary btn-sm" onclick="openChat(${f.id},'${f.name}','${f.init}','${f.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
            <button class="btn btn-outline btn-sm" onclick="planWithPerson('${f.name}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>
          </div>
        </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-heart-handshake"></i><p>No friends yet.<br>Try Quick match on the People tab!</p>
        <button class="btn btn-primary btn-sm" style="margin-top:14px" onclick="goTo('people');setPeopleMode('match')"><i class="ti ti-bolt"></i> Start matching</button></div>`;

  document.getElementById('requests-panel').innerHTML = requests.length
    ? `<div class="people-grid">${requests.map(r=>`
        <div class="person-card">
          <div class="person-header">
            <div class="person-avatar" style="background:${r.color}">${r.init}</div>
            <div><div class="person-name">${r.name}</div><div class="person-sub">${r.sub}</div></div>
          </div>
          <div class="person-actions">
            <button class="btn btn-accent btn-sm" onclick="acceptRequest(${r.id},'${r.name}','${r.init}','${r.color}')"><i class="ti ti-check" aria-hidden="true"></i>Accept</button>
            <button class="btn btn-outline btn-sm" onclick="declineRequest(${r.id},'${r.name}')"><i class="ti ti-x" aria-hidden="true"></i>Decline</button>
          </div>
        </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-user-check"></i><p>No pending requests right now.</p></div>`;

  const existingIds = [...friends.map(f=>f.id), ...getUserRequests().map(r=>r.id)];
  const shared = (currentUser.interests||[]);
  const suggestions = PEOPLE.filter(p=>!existingIds.includes(p.id)).slice(0,4);
  document.getElementById('suggestions-panel').innerHTML = suggestions.length
    ? `<div class="people-grid">${suggestions.map(p=>`<div class="person-card" onclick="openPersonProfile(${p.id})">
      ${p.online?'<div class="online-dot" role="img" aria-label="Online now"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.init}</div>
        <div><div class="person-name">${p.name}</div><div class="person-sub">${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <div class="tags">${p.tags.map(t=>`<span class="tag ${shared.includes(t)?'gold':''}">${t}</span>`).join('')}</div>
      <div class="person-actions">
        <button class="btn btn-primary btn-sm btn-block" onclick="event.stopPropagation();sendFriendReq(${p.id},'${p.name}','${p.init}','${p.color}');renderFriends()"><i class="ti ti-user-plus" aria-hidden="true"></i>Add friend</button>
      </div>
    </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-users"></i><p>No more suggestions right now.</p></div>`;
}

function showFTab(tab) {
  currentFTab = tab;
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('active'));
  document.getElementById('ftab-'+tab).classList.add('active');
  ['friends','requests','suggestions'].forEach(t=>document.getElementById(t+'-panel').style.display=t===tab?'block':'none');
}

function acceptRequest(id, name, init, color) {
  setUserData('requests', getUserRequests().filter(r=>r.id!==id));
  const friends = getUserFriends();
  if(!friends.some(f=>f.id===id)) friends.push({id, name, init, color});
  setUserData('friends', friends);
  awardXp(XP.friend, 'friends');
  confetti();
  showToast(`${name} is now your friend!`, 'achievement', 'ti-heart');
  addNotif(`You and ${name} are now friends`, 'ti-heart', 'green');
  closePerson();
  renderFriends();
  refreshPeopleViews();
}

function declineRequest(id, name) {
  setUserData('requests', getUserRequests().filter(r=>r.id!==id));
  showToast(`Declined request from ${name}`);
  closePerson();
  renderFriends();
  refreshPeopleViews();
}

/* ════════ PROFILE ════════ */
function renderProfile() {
  const u = currentUser;
  const s = getStats();
  const level = levelFromXp(s.xp);
  const curBase = xpForLevel(level);
  const nextNeed = xpForLevel(level+1);
  const pct = Math.min(100, Math.round(((s.xp-curBase)/(nextNeed-curBase))*100));
  const plans = getUserPlans();
  const friends = getUserFriends();
  const joined = getUserJoined();
  const theme = store.get('theme') || 'auto';

  const board = [
    {name:'Maya C.', xp:540},{name:'Jordan P.', xp:410},{name:'Aisha W.', xp:300},
    {name:'You', xp:s.xp, me:true},{name:'Tyler B.', xp:150},{name:'Priya N.', xp:90},
  ].sort((a,b)=>b.xp-a.xp).slice(0,6);

  const xpLog = (s.xpLog||[]).slice(0,6);

  document.getElementById('profile-content').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-big" style="background:${u.color}">${u.initials}</div>
      <div style="flex:1;min-width:0">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:3px">${escapeHtml(u.name)}</h2>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:8px">Member since ${new Date(u.joined).toLocaleDateString('en-US',{month:'long',year:'numeric'})}</p>
        <div class="tags">${(u.interests||[]).map(i=>`<span class="tag">${i}</span>`).join('')}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="logout()"><i class="ti ti-logout" aria-hidden="true"></i>Sign out</button>
    </div>
    <div class="level-bar-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="font-weight:800;font-size:15px"><i class="ti ti-star-filled" style="color:var(--warn)"></i> Level ${level}</span>
        <span style="font-size:12px;color:var(--text-muted)">${s.xp} / ${nextNeed} XP</span>
      </div>
      <div class="level-bar-track"><div class="level-bar-fill" style="width:${pct}%"></div></div>
      <span style="font-size:12px;color:var(--text-muted)">${nextNeed-s.xp} XP to level ${level+1}</span>
    </div>
    <div class="profile-stats">
      <div class="stat-card"><div class="stat-num">🔥${s.streak}</div><div class="stat-label">Day streak</div></div>
      <div class="stat-card"><div class="stat-num">${friends.length}</div><div class="stat-label">Friends</div></div>
      <div class="stat-card"><div class="stat-num">${plans.length}</div><div class="stat-label">Plans</div></div>
      <div class="stat-card"><div class="stat-num">${joined.size}</div><div class="stat-label">Joined</div></div>
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-award"></i>Badges (${s.badges.length}/${BADGES.length})</div>
      <div class="badges-grid">${BADGES.map((b,i)=>`
        <div class="badge-card ${s.badges.includes(b.id)?'earned':'locked'}" style="animation-delay:${i*0.04}s">
          ${s.badges.includes(b.id)?'<span class="badge-check"><i class="ti ti-check"></i></span>':''}
          <div class="badge-emoji">${b.emoji}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>`).join('')}</div>
    </div>
    <div class="profile-card">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-trophy"></i>Leaderboard <span style="font-weight:500;color:var(--text-muted);font-size:12px">· near you</span></div>
      <div class="leaderboard">${board.map((row,i)=>`
        <div class="lb-row ${row.me?'me':''}">
          <span class="lb-rank">${i+1}</span>
          <span class="lb-name">${row.name}${row.me?' <span class="lb-you">you</span>':''}</span>
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
  const theme = store.get('theme') || 'auto';
  const dark = theme==='dark' || (theme==='auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#13131f' : '#7F77DD');
}
function setTheme(t) { store.set('theme', t); applyTheme(); applyHeroVibe(); renderProfile(); showToast(`Theme: ${t}`); }
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ════════ CHAT ════════ */
let chatTarget = null;
function renderChatEmojiBar() {
  const bar = document.getElementById('chat-emoji-bar');
  if(bar) bar.innerHTML = CHAT_EMOJI.map(e=>`<button class="chat-emoji" onclick="insertEmoji('${e}')">${e}</button>`).join('');
}
function insertEmoji(e) {
  const input = document.getElementById('chat-input');
  input.value += e;
  input.focus();
}
function openChat(id, name, init, color) {
  closePerson();
  chatTarget = {id, name, init, color};
  document.getElementById('chat-avatar').textContent = init;
  document.getElementById('chat-avatar').style.background = color;
  document.getElementById('chat-name').textContent = name;
  const person = personById(id);
  document.getElementById('chat-online').textContent = person && person.online ? '● Online' : '';
  renderChatMessages();
  document.getElementById('chat-panel').classList.add('open');
  document.getElementById('chat-input').focus();
}
function closeChat() { document.getElementById('chat-panel').classList.remove('open'); chatTarget=null; }

function renderChatMessages() {
  if(!chatTarget) return;
  const msgs = getChatMsgs(chatTarget.id);
  const lastMine = msgs.reduce((acc,m,i)=>m.mine?i:acc, -1);
  const container = document.getElementById('chat-messages');
  container.innerHTML = msgs.length
    ? msgs.map((m,i)=>`<div class="msg ${m.mine?'mine':'theirs'}">${escapeHtml(m.text)}<div class="msg-time">${m.time}${m.mine&&m.seen&&i===lastMine?' · <span class="seen">✓✓ Seen</span>':''}</div></div>`).join('')
    : `<div class="chat-empty">Say hi to ${escapeHtml(chatTarget.name)}! 👋</div>`;
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function sendMessage() {
  if(!chatTarget) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  const msgs = getChatMsgs(chatTarget.id);
  msgs.push({mine:true, text, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'}), seen:false});
  saveChatMsgs(chatTarget.id, msgs);
  input.value='';
  renderChatMessages();
  awardXp(XP.msg, 'msgs');
  const replyTargetId = chatTarget.id;
  const replyTargetName = chatTarget.name;
  setTimeout(()=>{
    if(!chatTarget || chatTarget.id !== replyTargetId) return;
    const container = document.getElementById('chat-messages');
    const indicator = document.createElement('div');
    indicator.className='typing-indicator';
    indicator.innerHTML='<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    container.appendChild(indicator);
    container.scrollTop=container.scrollHeight;
    setTimeout(()=>{
      indicator.remove();
      const fresh = getChatMsgs(replyTargetId);
      fresh.forEach(m=>{ if(m.mine) m.seen=true; });
      const reply = AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];
      fresh.push({mine:false, text:reply, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});
      saveChatMsgs(replyTargetId, fresh);
      if(chatTarget && chatTarget.id === replyTargetId) renderChatMessages();
      addNotif(`${replyTargetName}: ${reply.substring(0,40)}`, 'ti-message', 'purple');
    }, 1200+Math.random()*800);
  }, 600);
}

/* ════════ NOTIFICATIONS ════════ */
let notifPanelOpen = false;
function addNotif(text, icon, type) {
  const notifs = getUserNotifs();
  notifs.unshift({id:Date.now()+Math.random(), text, icon, type, time:'just now', read:false});
  setUserData('notifs', notifs.slice(0,30));
  updateNotifBadge();
  if(notifPanelOpen) renderNotifPanel();
  if('Notification' in window && Notification.permission==='granted') {
    try { new Notification('BoredOut', {body:text, icon:'icons/icon.svg'}); } catch {}
  }
}

function updateNotifBadge() {
  const unread = getUserNotifs().filter(n=>!n.read).length;
  const badge = document.getElementById('notif-badge');
  if(unread) { badge.textContent=unread>9?'9+':unread; badge.style.display='flex'; }
  else badge.style.display='none';
}

function toggleNotifPanel() {
  notifPanelOpen = !notifPanelOpen;
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  panel.classList.toggle('open', notifPanelOpen);
  btn.setAttribute('aria-expanded', notifPanelOpen ? 'true' : 'false');
  if(notifPanelOpen) { renderNotifPanel(); setTimeout(()=>panel.querySelector('button,[tabindex]')?.focus?.(), 30); }
  else btn.focus();
}

function renderNotifPanel() {
  const notifs = getUserNotifs();
  const list = document.getElementById('notif-list');
  list.innerHTML = notifs.length
    ? notifs.map(n=>`
        <div class="notif-item ${n.read?'':'unread'}" onclick="markRead('${n.id}')">
          <div class="notif-icon ${n.type}"><i class="ti ${n.icon}" aria-hidden="true"></i></div>
          <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
        </div>`).join('')
    : `<div class="empty"><i class="ti ti-bell-off"></i><p>No notifications yet</p></div>`;
  if('Notification' in window && Notification.permission==='default') {
    list.insertAdjacentHTML('afterbegin',`<div class="notif-enable">
      <i class="ti ti-bell" style="color:var(--accent);font-size:18px"></i>
      <span style="flex:1">Get notified about activities near you</span>
      <button class="btn btn-accent btn-sm" onclick="requestNotifPermission()">Enable</button>
    </div>`);
  }
}

function markRead(id) {
  const notifs = getUserNotifs();
  const n = notifs.find(n=>String(n.id)===String(id)); if(n) n.read=true;
  setUserData('notifs', notifs);
  updateNotifBadge();
  renderNotifPanel();
}

function markAllRead() {
  setUserData('notifs', getUserNotifs().map(n=>({...n,read:true})));
  updateNotifBadge();
  renderNotifPanel();
  showToast('All notifications marked as read');
}

function requestNotifPermission() {
  if(!('Notification' in window)) { showToast('Notifications aren\'t supported here'); return; }
  Notification.requestPermission().then(p=>{
    if(p==='granted') showToast('Notifications enabled!');
    renderNotifPanel();
  });
}

/* ════════ PWA INSTALL ════════ */
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstall = e;
  if(!store.get('install_dismissed') && currentUser) document.getElementById('install-banner').classList.add('show');
});
function doInstall() {
  if(!deferredInstall) { showToast('Open your browser menu and choose "Add to home screen"'); return; }
  deferredInstall.prompt();
  deferredInstall.userChoice.then(choice => {
    if(choice.outcome==='accepted') { confetti(); showToast('BoredOut installed!', 'achievement', 'ti-sparkles'); }
    deferredInstall = null;
    document.getElementById('install-banner').classList.remove('show');
  });
}
function dismissInstall() {
  store.set('install_dismissed', true);
  document.getElementById('install-banner').classList.remove('show');
}

/* ════════ ONBOARDING TOUR ════════ */
function maybeShowTour(force) {
  if(!force && store.get(ukey('tour_done'))) return;
  store.set(ukey('tour_done'), true);
  const steps = [
    {icon:'✨', title:'Bored? Tap one button', body:'The “I\'m bored!” button instantly picks something to do based on your interests, the time, and the weather.'},
    {icon:'🧭', title:'Discover & filter', body:'Browse activities by vibe, mood, or search. Tap any card for details, directions, and to join.'},
    {icon:'🫂', title:'Find your people', body:'Browse or quick-match with people nearby, send requests, make plans, and chat.'},
    {icon:'🏆', title:'Level up', body:'Everything you do earns XP. Build streaks, unlock badges, and climb the local leaderboard.'},
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
  ov.addEventListener('click', e=>{ if(e.target===ov) close(); });
  render();
  activateModal(ov);
}

/* ════════ FOCUS MANAGEMENT (modal a11y) ════════ */
let lastFocused = null;
let trapOverlay = null;
let pendingLevelUp = null;
function focusables(el) {
  return [...el.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(e => e.offsetParent !== null);
}
function onTrapKey(e) {
  if(e.key !== 'Tab' || !trapOverlay) return;
  const items = focusables(trapOverlay);
  if(!items.length) return;
  const first = items[0], last = items[items.length-1];
  if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}
function activateModal(overlay) {
  if(!overlay || trapOverlay === overlay) return;
  lastFocused = document.activeElement;
  trapOverlay = overlay;
  const items = focusables(overlay);
  setTimeout(() => (items[0] || overlay).focus?.(), 30);
  document.addEventListener('keydown', onTrapKey, true);
}
function deactivateModal() {
  document.removeEventListener('keydown', onTrapKey, true);
  trapOverlay = null;
  if(lastFocused && lastFocused.focus) { try { lastFocused.focus(); } catch(_){} }
  lastFocused = null;
  if(pendingLevelUp != null) { const lv = pendingLevelUp; pendingLevelUp = null; setTimeout(()=>showLevelUp(lv), 260); }
}

/* ════════ NAV ════════ */
function goTo(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab,.bnav-item').forEach(t=>t.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const dt = document.getElementById('tab-'+page); if(dt) dt.classList.add('active');
  const bt = document.getElementById('bnav-'+page); if(bt) bt.classList.add('active');
  try {
    if(page==='people') { renderPeoplePills(); renderPeople(); if(peopleMode==='match') startDeck(); }
    if(page==='friends') renderFriends();
    if(page==='profile') renderProfile();
    if(page==='plans') renderPlans();
    if(page==='discover') renderDiscover();
  } catch(err) { console.error(err); showToast('Something glitched — try again'); }
  if(notifPanelOpen) { notifPanelOpen=false; document.getElementById('notif-panel').classList.remove('open'); }
  window.scrollTo({top:0});
}

/* ════════ TOAST ════════ */
function showToast(msg, kind, icon) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.classList.toggle('achievement', kind==='achievement');
  document.getElementById('toast-icon').className = 'ti ' + (icon || 'ti-check');
  document.getElementById('toast-msg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ════════ INIT ════════ */
(function init() {
  applyTheme();
  renderInterestsPicker();

  if('serviceWorker' in navigator) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').then(reg => {
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if(!nw) return;
        nw.addEventListener('statechange', () => {
          // A new version is ready but DON'T force-reload mid-session (would lose unsaved input).
          if(nw.state==='installed' && navigator.serviceWorker.controller) {
            showToast('New version ready — refresh to update', null, 'ti-refresh');
          }
        });
      });
    }).catch(()=>{});
    let reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // Skip the reload on the first-ever visit (initial clients.claim), only reload on a genuine update we triggered.
      if(!hadController || reloaded) return; reloaded = true; location.reload();
    });
  }

  const session = store.get('session');
  if(session) {
    const users = getUsers();
    if(users[session]) { currentUser = users[session]; launchApp(); }
    else { document.getElementById('auth-overlay').style.display='flex'; }
  }

  document.getElementById('login-email').addEventListener('keydown',e=>e.key==='Enter'&&doLogin());
  document.getElementById('login-password').addEventListener('keydown',e=>e.key==='Enter'&&doLogin());

  document.addEventListener('click', e => {
    if(!notifPanelOpen) return;
    const panel = document.getElementById('notif-panel');
    const btn = document.getElementById('notif-btn');
    if(panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
      notifPanelOpen = false;
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  const isOpen = id => document.getElementById(id).classList.contains('open');
  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
      const tour = document.querySelector('.tour-overlay');
      if(tour) { tour.remove(); deactivateModal(); return; }
      if(isOpen('levelup-overlay')) { closeLevelUp(); return; }
      if(isOpen('person-overlay')) { closePerson(); return; }
      if(isOpen('detail-overlay')) { closeDetail(); return; }
      if(isOpen('modal-overlay')) { closePlanModal(); return; }
      if(isOpen('bored-overlay')) { closeBored(); return; }
      if(chatTarget) { closeChat(); return; }
      if(notifPanelOpen) { toggleNotifPanel(); return; }
      return;
    }
    // Quick match keyboard controls
    if(currentUser && document.getElementById('page-people').classList.contains('active') && peopleMode==='match' && !chatTarget) {
      if(e.key==='ArrowLeft') deckSwipe(false);
      if(e.key==='ArrowRight') deckSwipe(true);
    }
  });

  // Gentle global error net so a single glitch never blanks the app.
  let lastErr = 0;
  window.addEventListener('error', () => {
    const now = Date.now();
    if(now - lastErr > 4000) { lastErr = now; try { showToast('Something glitched — please retry'); } catch(_){} }
  });
})();
