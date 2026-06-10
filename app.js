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
const CAT_INTERESTS = {
  outdoor:['Hiking','Travel','Fitness','Photography'], food:['Coffee','Food'], arts:['Art','Photography','Reading'],
  sports:['Sports','Fitness'], games:['Gaming'], music:['Music'], movies:['Movies'], social:['Coffee','Food','Gaming','Reading'],
};
const DAYPART_CATS = {
  morning:['outdoor','food','sports'], afternoon:['arts','social','sports','outdoor'],
  evening:['food','games','music','movies','social'], night:['games','movies','social'],
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
  {id:1,name:'Maya Chen',init:'MC',color:'#7F77DD',dist:'0.3 mi',mood:'Down for anything',tags:['Coffee','Hiking','Board games'],online:true,mutual:2},
  {id:2,name:'Jordan Park',init:'JP',color:'#1D9E75',dist:'0.8 mi',mood:'Looking for a workout buddy',tags:['Basketball','Running','Fitness'],online:true,mutual:1},
  {id:3,name:'Aisha Williams',init:'AW',color:'#D4537E',dist:'1.1 mi',mood:'Want to explore the city',tags:['Art','Food','Photography'],online:false,mutual:3},
  {id:4,name:'Tyler Brooks',init:'TB',color:'#EF9F27',dist:'1.4 mi',mood:'Up for games or movies',tags:['Gaming','Movies','Trivia'],online:true,mutual:0},
  {id:5,name:'Sam Rivera',init:'SR',color:'#E24B4A',dist:'1.9 mi',mood:'Bored, let\'s do something!',tags:['Music','Concerts','Chill'],online:true,mutual:1},
  {id:6,name:'Priya Nair',init:'PN',color:'#BA7517',dist:'2.2 mi',mood:'Looking for brunch plans',tags:['Brunch','Reading','Yoga'],online:false,mutual:4},
  {id:7,name:'Chris Lee',init:'CL',color:'#534AB7',dist:'2.6 mi',mood:'Down for outdoor stuff',tags:['Cycling','Nature','Sports'],online:true,mutual:0},
  {id:8,name:'Zoe Thomas',init:'ZT',color:'#0F6E56',dist:'3.0 mi',mood:'Want to try something new',tags:['Cooking','Art','Dance'],online:false,mutual:2},
];
const AUTO_REPLIES = [
  'Hey! That sounds fun, I\'m in!','For sure, when works for you?','Yes! I\'ve been bored all day lol',
  'Omg yes let\'s do it!','I was literally just thinking about that','Count me in! What time?',
  'Sounds good! Let me know the details','I\'m free this evening, want to link up?',
  'That\'s a great idea! Been wanting to try that','Sure, where should we meet?',
];
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
const XP = {join:20, friend:30, plan:25, rate:10, msg:5, bored:15};

/* ════════ STORAGE ════════ */
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem('bo_'+k)); } catch { return null; } },
  set: (k,v) => localStorage.setItem('bo_'+k, JSON.stringify(v)),
};
let currentUser = null;
let toastTimer = null;
function getUsers() { return store.get('users') || {}; }
function saveUsers(u) { store.set('users', u); }
function getUserData(key) { return store.get('u_'+currentUser.email+'_'+key) || []; }
function setUserData(key, val) { store.set('u_'+currentUser.email+'_'+key, val); }
function getUserFriends() { return getUserData('friends'); }
function getUserRequests() { return getUserData('requests'); }
function getUserPlans() { return getUserData('plans'); }
function getUserJoined() { return new Set(getUserData('joined')); }
function getUserRatings() { return getUserData('ratings'); }
function getUserNotifs() { return getUserData('notifs'); }
function getChatMsgs(pid) { return store.get('chat_'+currentUser.email+'_'+pid) || []; }
function saveChatMsgs(pid, msgs) { store.set('chat_'+currentUser.email+'_'+pid, msgs); }

/* ════════ GAMIFICATION ════════ */
function getStats() {
  const s = store.get('u_'+currentUser.email+'_stats');
  return Object.assign({xp:0,streak:1,lastActive:null,joins:0,friends:0,plans:0,rates:0,msgs:0,boredUses:0,badges:[]}, s||{});
}
function setStats(s) { store.set('u_'+currentUser.email+'_stats', s); }
function levelFromXp(xp) { return Math.floor(Math.sqrt(xp/60))+1; }
function xpForLevel(lvl) { return 60*(lvl-1)*(lvl-1); }

function awardXp(amount, statKey) {
  const s = getStats();
  const oldLevel = levelFromXp(s.xp);
  s.xp += amount;
  if(statKey) s[statKey] = (s[statKey]||0)+1;
  setStats(s);
  floatXp('+'+amount+' XP');
  const newLevel = levelFromXp(s.xp);
  if(newLevel > oldLevel) {
    confetti();
    showToast(`Level up! You're now level ${newLevel}`, 'achievement', 'ti-crown');
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
  s.streak = (s.lastActive === yesterday) ? s.streak+1 : 1;
  s.lastActive = today;
  setStats(s);
  if(s.streak > 1) showToast(`🔥 ${s.streak}-day streak — keep it going!`, 'achievement', 'ti-flame');
  checkBadges();
}

function updateLevelChip() {
  const s = getStats();
  document.getElementById('level-chip').innerHTML =
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

/* ════════ AUTH ════════ */
let selectedInterests = new Set();
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active',i===(tab==='login'?0:1)));
  document.getElementById('auth-login').style.display = tab==='login'?'block':'none';
  document.getElementById('auth-signup').style.display = tab==='signup'?'block':'none';
  renderInterestsPicker();
}
function renderInterestsPicker() {
  document.getElementById('interests-grid').innerHTML = INTERESTS.map(i =>
    `<div class="interest-chip ${selectedInterests.has(i)?'selected':''}" onclick="toggleInterest('${i}')">${i}</div>`).join('');
}
function toggleInterest(i) { selectedInterests.has(i) ? selectedInterests.delete(i) : selectedInterests.add(i); renderInterestsPicker(); }

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;
  const users = getUsers();
  const errEl = document.getElementById('login-error');
  if(!users[email] || users[email].password !== pass) { errEl.textContent='Incorrect email or password.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  currentUser = users[email];
  const remember = document.getElementById('remember-me').checked;
  if(remember) store.set('session', email);
  launchApp();
}

function doSignup() {
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-password').value;
  const errEl = document.getElementById('signup-error');
  if(!name||!email||pass.length<6) { errEl.textContent='Please fill all fields (password min 6 chars).'; errEl.style.display='block'; return; }
  if(selectedInterests.size<2) { errEl.textContent='Pick at least 2 interests.'; errEl.style.display='block'; return; }
  const users = getUsers();
  if(users[email]) { errEl.textContent='That email is already registered.'; errEl.style.display='block'; return; }
  errEl.style.display='none';
  const initials = name.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase();
  const color = COLORS[Object.keys(users).length % COLORS.length];
  const user = { name, email, password: pass, initials, color, interests:[...selectedInterests], joined: Date.now() };
  users[email] = user;
  saveUsers(users);
  currentUser = user;
  store.set('session', email);
  launchApp();
  setTimeout(()=>{ confetti(); showToast(`Welcome to BoredOut, ${name.split(' ')[0]}!`, 'achievement', 'ti-sparkles'); }, 600);
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
  if(store.get('u_'+currentUser.email+'_seeded')) return;
  if(!getUserPlans().length) setUserData('plans', [
    {id:1,title:'Riverside Park Morning Run',month:'Jun',day:'14',time:'7:30 AM',location:'Riverside Park',people:['MC','JP'],status:'confirmed'},
    {id:2,title:'Ramen + Arcade Night',month:'Jun',day:'17',time:'6:00 PM',location:'East Village',people:['AW','TB'],status:'confirmed'},
    {id:3,title:'MoMA Saturday Visit',month:'Jun',day:'21',time:'2:00 PM',location:'MoMA, Midtown',people:['PN'],status:'pending'},
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
  store.set('u_'+currentUser.email+'_seeded', true);
}

function launchApp() {
  document.getElementById('auth-overlay').style.display='none';
  document.getElementById('main-app').style.display='block';
  seedDemoData();
  touchStreak();
  updateNavAvatar();
  updateLevelChip();
  detectLocation();
  renderForYou();
  renderCategories();
  renderFilters();
  renderActivities();
  renderPeoplePills();
  renderPlans();
  updateNotifBadge();
  updateGreeting();
}

function updateNavAvatar() {
  const btn = document.getElementById('nav-avatar');
  btn.textContent = currentUser.initials;
  btn.style.background = currentUser.color;
}

function updateGreeting() {
  const h = new Date().getHours();
  const part = h<12 ? 'morning' : h<17 ? 'afternoon' : h<21 ? 'evening' : 'night';
  const lines = {
    morning:'Good morning! What\'s the move today?',
    afternoon:'Good afternoon! Bored already?',
    evening:'It\'s the evening — perfect time for plans.',
    night:'Night owl mode. Let\'s find something.',
  };
  document.getElementById('hero-greeting').textContent = `Hey ${currentUser.name.split(' ')[0]} 👋`;
  document.getElementById('hero-sub').textContent = lines[part];
}

/* ════════ LOCATION ════════ */
function detectLocation() {
  const input = document.getElementById('location-input');
  const saved = store.get('u_'+currentUser.email+'_location');
  if(saved) { input.value = saved; return; }
  if(!navigator.geolocation) { input.value = 'New York, NY'; return; }
  input.value = 'Detecting...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const {latitude: lat, longitude: lon} = pos.coords;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(r=>r.json())
        .then(d=>{
          const city = d.address.city||d.address.town||d.address.village||d.address.county||'Your area';
          const state = d.address.state_code||d.address.state||'';
          input.value = state ? `${city}, ${state}` : city;
          store.set('u_'+currentUser.email+'_location', input.value);
          showToast(`Location set to ${input.value}`);
        }).catch(()=>{ input.value='New York, NY'; });
      fetchWeather(lat, lon);
    },
    () => { input.value='New York, NY'; }
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

function fetchWeather(lat, lon) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&temperature_unit=fahrenheit&windspeed_unit=mph`)
    .then(r => r.json())
    .then(d => {
      const c = d.current;
      const code = c.weathercode;
      const temp = Math.round(c.temperature_2m);
      const desc = WMO_CODES[code] || 'Unknown';
      const icon = WMO_ICON[code] || '🌡️';
      const isRainy = [51,53,55,61,63,65,80,81,82,95,96].includes(code);
      const isCold = temp < 40;
      const isHot = temp > 90;
      const tip = isRainy ? 'Rainy — great day for indoor activities' :
                  isCold  ? 'Bundle up if heading outside!' :
                  isHot   ? 'Hot out — stay hydrated!' :
                  'Great weather to get out there!';
      const bar = document.getElementById('weather-bar');
      document.getElementById('weather-icon').textContent = icon;
      document.getElementById('weather-temp').textContent = `${temp}°F`;
      document.getElementById('weather-desc').textContent = desc;
      document.getElementById('weather-tip').textContent = tip;
      bar.style.display = 'flex';
      store.set('weather', {code, temp, desc, icon, isRainy, isCold, isHot});
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
  const wx = store.get('weather');
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
  if(overlap.length) return `Because you're into ${overlap[0].toLowerCase()}`;
  if(DAYPART_CATS[dayPart()].includes(a.cat)) return `Perfect for ${dayPart()===('night')?'late night':'the '+dayPart()}`;
  if(a.cost==='Free') return 'Because it\'s free!';
  return 'Something new to try';
}

function openBored() {
  document.getElementById('bored-overlay').classList.add('open');
  const s = getStats();
  s.boredUses = (s.boredUses||0)+1;
  setStats(s);
  awardXp(XP.bored);
  spinSuggestion();
}

function spinSuggestion() {
  const card = document.getElementById('suggest-card');
  card.classList.add('shuffling');
  const emojis = ['🎲','🎯','🎪','🎨','🎵','🍕','🏀','🎬'];
  let tick = 0;
  const spin = setInterval(()=>{
    card.innerHTML = `<div class="suggest-emoji">${emojis[tick%emojis.length]}</div><h3>Finding your cure...</h3>`;
    tick++;
  }, 90);
  setTimeout(()=>{
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
  if(!joined.has(id)) {
    joined.add(id);
    setUserData('joined', [...joined]);
    awardXp(XP.join, 'joins');
  }
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const d = new Date();
  const plans = getUserPlans();
  plans.unshift({id:Date.now(),title:a.title,month:months[d.getMonth()],day:String(d.getDate()),time:a.time==='Anytime'||a.time==='Flexible'?'Today':a.time,location:a.location,people:[],status:'confirmed'});
  setUserData('plans', plans);
  closeBored();
  confetti();
  showToast(`Boredom officially cured — "${a.title}" added to your plans!`, 'achievement', 'ti-sparkles');
  addNotif(`You're doing ${a.title} today!`, 'ti-calendar-check', 'green');
  renderActivities(); renderPlans();
}

function closeBored() { document.getElementById('bored-overlay').classList.remove('open'); }

/* ════════ FOR YOU ════════ */
function renderForYou() {
  const sorted = [...ACTIVITIES].sort((x,y)=>scoreActivity(y)-scoreActivity(x)).slice(0,6);
  document.getElementById('foryou-row').innerHTML = sorted.map(a=>`
    <div class="foryou-card" onclick="openDetail(${a.id})">
      <div class="foryou-img" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}<span class="match-pill">${matchPercent(a)}% match</span></div>
      <div class="foryou-body"><h4>${a.title}</h4><span><i class="ti ti-map-pin" style="font-size:11px"></i> ${a.dist} · ${a.cost}</span></div>
    </div>`).join('');
}

/* ════════ DISCOVER ════════ */
let activeCategory = null;
let activeFilter = 'all';

function renderCategories() {
  document.getElementById('cat-grid').innerHTML = CATEGORIES.map(c =>
    `<div class="cat-card ${activeCategory===c.id?'active':''}" onclick="selectCategory('${c.id}')">
      <div class="cat-icon" style="${activeCategory===c.id?`background:${c.color};color:white`:''}"><i class="ti ${c.icon}" aria-hidden="true"></i></div>
      <span class="cat-label">${c.label}</span>
    </div>`).join('');
}

function selectCategory(id) {
  activeCategory = activeCategory===id ? null : id;
  renderCategories();
  renderActivities();
  document.getElementById('activities-title').textContent = activeCategory ? CATEGORIES.find(c=>c.id===activeCategory).label+' near you' : 'All activities near you';
}

function renderFilters() {
  const row = document.getElementById('filter-row');
  row.innerHTML = '';
  ['all','free','tonight','this weekend'].forEach(f => {
    const el = document.createElement('button');
    el.className = 'filter-pill'+(activeFilter===f?' active':'');
    el.textContent = f.charAt(0).toUpperCase()+f.slice(1);
    el.onclick = () => { activeFilter=f; row.querySelectorAll('.filter-pill').forEach(p=>p.classList.remove('active')); el.classList.add('active'); renderActivities(); };
    row.appendChild(el);
  });
}

function activityRating(a) {
  const r = getUserRatings().find(x=>x.id===a.id);
  return r ? {avg:r.avg, count:r.count, mine:r.rating} : {avg:(3+(a.id*13%20)/10).toFixed(1), count:Math.floor(a.going/3)+2, mine:0};
}

function renderActivities() {
  let acts = [...ACTIVITIES];
  if(activeCategory) acts = acts.filter(a=>a.cat===activeCategory);
  if(activeFilter==='free') acts = acts.filter(a=>a.cost==='Free');
  const joined = getUserJoined();
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#534AB7'];
  const avInits = ['MJ','TK','AS','RL','PD'];
  const grid = document.getElementById('activity-grid');
  if(!acts.length) { grid.innerHTML=`<div class="empty" style="grid-column:1/-1"><i class="ti ti-mood-sad"></i><p>No activities found. Try a different filter!</p></div>`; return; }
  grid.innerHTML = acts.map(a => {
    const isJoined = joined.has(a.id);
    const r = activityRating(a);
    const stack = Array.from({length:Math.min(3,Math.floor(a.going/4))},(_,i)=>`<div class="av" style="background:${avColors[i%5]}">${avInits[i]}</div>`).join('');
    const stars = [1,2,3,4,5].map(s=>`<span class="star ${s<=r.mine?'filled':''}" onclick="rateActivity(${a.id},${s},event)">★</span>`).join('');
    return `<div class="activity-card" onclick="openDetail(${a.id})">
      <div class="activity-img" style="background:${CAT_COLORS[a.cat]}22">
        <span>${a.emoji}</span>
        ${a.badge?`<span class="activity-badge ${a.badge}">${a.badge==='free'?'FREE':'🔥 Hot'}</span>`:''}
      </div>
      <div class="activity-body">
        <h3>${a.title}</h3>
        <div class="activity-meta">
          <span class="meta-item"><i class="ti ti-map-pin" aria-hidden="true"></i>${a.location}</span>
          <span class="meta-item"><i class="ti ti-clock" aria-hidden="true"></i>${a.time}</span>
          <span class="meta-item"><i class="ti ti-walk" aria-hidden="true"></i>${a.dist}</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin:6px 0" onclick="event.stopPropagation()">
          <div class="stars">${stars}</div>
          <span class="rating-count">${parseFloat(r.avg).toFixed(1)} (${r.count})</span>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-top:10px">
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

function joinActivity(id) {
  const joined = getUserJoined();
  const act = ACTIVITIES.find(a=>a.id===id);
  if(joined.has(id)) {
    joined.delete(id);
    showToast('Removed from your plans');
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
  e.stopPropagation();
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
  const joined = getUserJoined().has(id);
  const r = activityRating(a);
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#534AB7'];
  const avInits = ['MJ','TK','AS','RL','PD'];
  const stack = Array.from({length:Math.min(5,Math.floor(a.going/3))},(_,i)=>`<div class="av" style="background:${avColors[i%5]};width:28px;height:28px;font-size:10px">${avInits[i%5]}</div>`).join('');
  document.getElementById('detail-modal').innerHTML = `
    <div class="modal-header">
      <h2>${a.title}</h2>
      <button class="icon-btn" onclick="closeDetail()"><i class="ti ti-x"></i></button>
    </div>
    <div class="detail-hero" style="background:${CAT_COLORS[a.cat]}22">${a.emoji}</div>
    <p style="font-size:14px;color:var(--text-muted);line-height:1.6;margin-bottom:1rem">${a.desc}</p>
    <div class="activity-meta" style="margin-bottom:1rem">
      <span class="meta-item"><i class="ti ti-map-pin"></i>${a.location}</span>
      <span class="meta-item"><i class="ti ti-clock"></i>${a.time}</span>
      <span class="meta-item"><i class="ti ti-walk"></i>${a.dist}</span>
      <span class="meta-item"><i class="ti ti-currency-dollar"></i>${a.cost}</span>
      <span class="meta-item"><i class="ti ti-star"></i>${parseFloat(r.avg).toFixed(1)} (${r.count} ratings)</span>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:1.25rem">
      <div class="avatar-stack">${stack}</div>
      <span style="font-size:13px;color:var(--text-muted)">${a.going+(joined?1:0)} people going</span>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-outline" style="flex:1;justify-content:center" onclick="shareActivity(${a.id})"><i class="ti ti-share"></i> Share</button>
      <button class="btn ${joined?'btn-accent':'btn-primary'}" style="flex:2;justify-content:center" onclick="joinActivity(${a.id});openDetail(${a.id})">
        <i class="ti ${joined?'ti-check':'ti-plus'}"></i>${joined?'Joined — tap to leave':'I\'m in!'}
      </button>
    </div>`;
  document.getElementById('detail-overlay').classList.add('open');
}
function closeDetail() { document.getElementById('detail-overlay').classList.remove('open'); }

function shareActivity(id) {
  const a = ACTIVITIES.find(x=>x.id===id);
  const text = `Hey! Want to join me for "${a.title}" at ${a.location}? Found it on BoredOut!`;
  if(navigator.share) {
    navigator.share({title:'BoredOut', text}).catch(()=>{});
  } else {
    navigator.clipboard.writeText(text).then(()=>showToast('Invite copied to clipboard — paste it anywhere!'));
  }
}

/* ════════ PEOPLE ════════ */
let activePeopleFilter = 'all';
let peopleMode = 'browse';
let deckIndex = 0;
let deckPool = [];

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
  deckPool = DEMO_PEOPLE.filter(p=>!friends.some(f=>f.id===p.id) && !requests.some(r=>r.fromMe&&r.id===p.id));
  deckIndex = 0;
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
  wrap.innerHTML = `
    <div class="deck-card" id="deck-card">
      <div class="deck-avatar" style="background:${p.color}">${p.init}</div>
      <h3>${p.name}</h3>
      <div class="person-sub" style="justify-content:center"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist} away${p.mutual?' · '+p.mutual+' mutual friends':''} ${p.online?' · <span style="color:var(--accent)">online now</span>':''}</div>
      <p class="mood">"${p.mood}"</p>
      <div class="deck-tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
    </div>
    <div class="deck-actions">
      <button class="deck-btn deck-skip" onclick="deckSwipe(false)" aria-label="Skip"><i class="ti ti-x"></i></button>
      <button class="deck-btn deck-connect" onclick="deckSwipe(true)" aria-label="Connect"><i class="ti ti-heart"></i></button>
    </div>
    <div class="deck-counter">${deckIndex+1} of ${deckPool.length}</div>`;
}

function deckSwipe(connect) {
  const card = document.getElementById('deck-card');
  const p = deckPool[deckIndex];
  card.classList.add(connect ? 'swipe-right' : 'swipe-left');
  if(connect) {
    const requests = getUserRequests();
    if(!requests.find(r=>r.id===p.id)) {
      requests.push({id:p.id, name:p.name, init:p.init, color:p.color, sub:'Nearby · request sent', fromMe:true});
      setUserData('requests', requests);
    }
    showToast(`Request sent to ${p.name}!`);
    awardXp(XP.friend, null);
  }
  setTimeout(()=>{ deckIndex++; renderDeck(); }, 320);
}

function renderPeoplePills() {
  const vibes = ['all','online now','nearby','new here'];
  document.getElementById('people-filter-row').innerHTML = vibes.map(v =>
    `<button class="filter-pill ${activePeopleFilter===v?'active':''}" onclick="setPeopleFilter('${v}',this)">${v.charAt(0).toUpperCase()+v.slice(1)}</button>`).join('');
}

function setPeopleFilter(v, el) {
  activePeopleFilter = v;
  document.querySelectorAll('#people-filter-row .filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderPeople();
}

function renderPeople() {
  const search = (document.getElementById('people-search')?.value||'').toLowerCase();
  const friends = getUserFriends();
  const requests = getUserRequests();
  let people = [...DEMO_PEOPLE];
  if(activePeopleFilter==='online now') people = people.filter(p=>p.online);
  if(activePeopleFilter==='nearby') people = people.filter(p=>parseFloat(p.dist)<1.5);
  if(search) people = people.filter(p=>p.name.toLowerCase().includes(search)||p.mood.toLowerCase().includes(search)||p.tags.some(t=>t.toLowerCase().includes(search)));
  document.getElementById('people-grid').innerHTML = people.map(p => {
    const isFriend = friends.some(f=>f.id===p.id);
    const reqSent = requests.some(r=>r.fromMe&&r.id===p.id);
    return `<div class="person-card">
      ${p.online?'<div class="online-dot" title="Online now"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.init}</div>
        <div><div class="person-name">${p.name}</div><div class="person-sub"><i class="ti ti-map-pin" style="font-size:12px"></i> ${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <p style="font-size:13px;color:var(--text-muted);font-style:italic">"${p.mood}"</p>
      <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="person-actions">
        ${isFriend
          ? `<button class="btn btn-outline btn-sm" onclick="openChat(${p.id},'${p.name}','${p.init}','${p.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
             <button class="btn btn-primary btn-sm" onclick="planWithPerson('${p.name}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>`
          : reqSent
          ? `<button class="btn btn-outline btn-sm" disabled style="flex:1;justify-content:center;opacity:0.6"><i class="ti ti-clock"></i>Requested</button>`
          : `<button class="btn btn-primary btn-sm" onclick="sendFriendReq(${p.id},'${p.name}','${p.init}','${p.color}')"><i class="ti ti-user-plus" aria-hidden="true"></i>Add</button>
             <button class="btn btn-outline btn-sm" onclick="proposeHangout('${p.name}')"><i class="ti ti-calendar-event" aria-hidden="true"></i>Hang out</button>`}
      </div>
    </div>`;
  }).join('') || `<div class="empty" style="grid-column:1/-1"><i class="ti ti-users"></i><p>No people found.</p></div>`;
}

function sendFriendReq(id, name, init, color) {
  const requests = getUserRequests();
  if(!requests.find(r=>r.id===id)) { requests.push({id, name, init, color, sub:'Nearby · request sent', fromMe:true}); setUserData('requests', requests); }
  showToast(`Friend request sent to ${name}!`);
  addNotif(`You sent a friend request to ${name}`, 'ti-user-plus', 'purple');
  renderPeople();
}

function proposeHangout(name) { showToast(`Hangout request sent to ${name}!`); addNotif(`You proposed a hangout with ${name}`, 'ti-calendar-event', 'amber'); }
function planWithPerson(name) { goTo('plans'); setTimeout(()=>{ openCreatePlan(); document.getElementById('plan-invite').value=name; }, 300); }

/* ════════ PLANS ════════ */
function renderPlans(filter='all') {
  let plans = getUserPlans();
  if(filter==='confirmed') plans = plans.filter(p=>p.status==='confirmed');
  if(filter==='pending') plans = plans.filter(p=>p.status==='pending');
  const avColors = ['#7F77DD','#1D9E75','#D4537E','#EF9F27','#E24B4A','#534AB7'];
  document.getElementById('plans-list').innerHTML = plans.length ? plans.map(p => `
    <div class="plan-card">
      <div class="plan-date-box"><div class="month">${p.month}</div><div class="day">${p.day}</div></div>
      <div class="plan-info">
        <h3>${p.title}</h3>
        <div class="meta-item" style="margin:4px 0"><i class="ti ti-clock" style="font-size:13px"></i><span style="font-size:12px;color:var(--text-muted)">${p.time} · ${p.location}</span></div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap">
          <div class="avatar-stack">${(p.people||[]).map((av,j)=>`<div class="av" style="background:${avColors[j%6]}">${av}</div>`).join('')}</div>
          ${p.people?.length?`<span style="font-size:12px;color:var(--text-muted)">${p.people.length} friend${p.people.length!==1?'s':''}</span>`:''}
          <span class="plan-status ${p.status==='confirmed'?'status-confirmed':'status-pending'}">${p.status}</span>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="removePlan(${p.id})" style="align-self:flex-start;margin-left:auto"><i class="ti ti-trash" aria-hidden="true"></i></button>
    </div>`).join('')
    : `<div class="empty"><i class="ti ti-calendar-off"></i><p>No plans yet. Hit the "I'm bored" button!</p></div>`;
}

function filterPlans(f, el) {
  document.querySelectorAll('#page-plans .filter-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');
  renderPlans(f);
}

function removePlan(id) { setUserData('plans', getUserPlans().filter(p=>p.id!==id)); renderPlans(); showToast('Plan removed'); }

function openCreatePlan() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('plan-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('plan-time').value = '18:00';
}
function closePlanModal() { document.getElementById('modal-overlay').classList.remove('open'); }

function createPlan() {
  const title = document.getElementById('plan-title').value.trim();
  if(!title) { showToast('Please enter a plan title'); return; }
  const dateVal = document.getElementById('plan-date').value;
  const d = dateVal ? new Date(dateVal+'T00:00:00') : new Date();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const invite = document.getElementById('plan-invite').value.trim();
  const people = invite ? [invite.split(' ').map(w=>w[0]).join('').substring(0,2).toUpperCase()] : [];
  const plans = getUserPlans();
  plans.unshift({id:Date.now(),title,month:months[d.getMonth()],day:String(d.getDate()),time:document.getElementById('plan-time').value||'6:00 PM',location:document.getElementById('plan-location').value||'TBD',people,status:'pending'});
  setUserData('plans', plans);
  closePlanModal();
  renderPlans();
  awardXp(XP.plan, 'plans');
  showToast(`"${title}" plan created!`);
  addNotif(`New plan: ${title} on ${months[d.getMonth()]} ${d.getDate()}`, 'ti-calendar-check', 'green');
  ['plan-title','plan-location','plan-invite','plan-notes'].forEach(id=>document.getElementById(id).value='');
}

/* ════════ FRIENDS ════════ */
let currentFTab = 'friends';
function renderFriends() {
  const friends = getUserFriends();
  const requests = getUserRequests().filter(r=>!r.fromMe);
  document.getElementById('friends-count').textContent = friends.length ? `(${friends.length})` : '';
  const badge = document.getElementById('req-count-badge');
  const bnav = document.getElementById('bnav-req-badge');
  if(requests.length) { badge.textContent=requests.length; badge.style.display='inline'; bnav.textContent=requests.length; bnav.style.display='flex'; }
  else { badge.style.display='none'; bnav.style.display='none'; }

  document.getElementById('friends-panel').innerHTML = friends.length
    ? `<div class="people-grid">${friends.map(f=>`
        <div class="person-card">
          <div class="person-header">
            <div class="person-avatar" style="background:${f.color}">${f.init}</div>
            <div><div class="person-name">${f.name}</div><div class="person-sub">Friends</div></div>
          </div>
          <div class="person-actions">
            <button class="btn btn-primary btn-sm" onclick="openChat(${f.id},'${f.name}','${f.init}','${f.color}')"><i class="ti ti-message" aria-hidden="true"></i>Chat</button>
            <button class="btn btn-outline btn-sm" onclick="planWithPerson('${f.name}')"><i class="ti ti-calendar-plus" aria-hidden="true"></i>Plan</button>
          </div>
        </div>`).join('')}</div>`
    : `<div class="empty"><i class="ti ti-heart-broken"></i><p>No friends yet. Try Quick match on the People tab!</p></div>`;

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
    : `<div class="empty"><i class="ti ti-user-check"></i><p>No pending requests!</p></div>`;

  const existingIds = [...friends.map(f=>f.id), ...getUserRequests().map(r=>r.id)];
  const suggestions = DEMO_PEOPLE.filter(p=>!existingIds.includes(p.id)).slice(0,4);
  document.getElementById('suggestions-panel').innerHTML = suggestions.length
    ? `<div class="people-grid">${suggestions.map(p=>`<div class="person-card">
      ${p.online?'<div class="online-dot"></div>':''}
      <div class="person-header">
        <div class="person-avatar" style="background:${p.color}">${p.init}</div>
        <div><div class="person-name">${p.name}</div><div class="person-sub">${p.dist}${p.mutual?' · '+p.mutual+' mutual':''}</div></div>
      </div>
      <div class="tags">${p.tags.map(t=>`<span class="tag">${t}</span>`).join('')}</div>
      <div class="person-actions">
        <button class="btn btn-primary btn-sm btn-block" onclick="sendFriendReq(${p.id},'${p.name}','${p.init}','${p.color}');renderFriends()"><i class="ti ti-user-plus" aria-hidden="true"></i>Add friend</button>
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
  friends.push({id, name, init, color});
  setUserData('friends', friends);
  awardXp(XP.friend, 'friends');
  confetti();
  showToast(`${name} is now your friend!`, 'achievement', 'ti-heart');
  addNotif(`You and ${name} are now friends`, 'ti-heart', 'green');
  renderFriends();
}

function declineRequest(id, name) {
  setUserData('requests', getUserRequests().filter(r=>r.id!==id));
  showToast(`Declined request from ${name}`);
  renderFriends();
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
  document.getElementById('profile-content').innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-big" style="background:${u.color}">${u.initials}</div>
      <div style="flex:1">
        <h2 style="font-size:1.3rem;font-weight:800;margin-bottom:3px">${u.name}</h2>
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
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem;margin-bottom:1.1rem">
      <div class="section-title" style="margin-bottom:12px"><i class="ti ti-award"></i>Badges (${s.badges.length}/${BADGES.length})</div>
      <div class="badges-grid">${BADGES.map(b=>`
        <div class="badge-card ${s.badges.includes(b.id)?'earned':'locked'}">
          <div class="badge-emoji">${b.emoji}</div>
          <div class="badge-name">${b.name}</div>
          <div class="badge-desc">${b.desc}</div>
        </div>`).join('')}</div>
    </div>
    <div style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:1.1rem">
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
}
function setTheme(t) { store.set('theme', t); applyTheme(); renderProfile(); showToast(`Theme: ${t}`); }
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

/* ════════ CHAT ════════ */
let chatTarget = null;
function openChat(id, name, init, color) {
  chatTarget = {id, name, init, color};
  document.getElementById('chat-avatar').textContent = init;
  document.getElementById('chat-avatar').style.background = color;
  document.getElementById('chat-name').textContent = name;
  const person = DEMO_PEOPLE.find(p=>p.id===id);
  document.getElementById('chat-online').textContent = person?.online ? '● Online' : '';
  renderChatMessages();
  document.getElementById('chat-panel').classList.add('open');
  document.getElementById('chat-input').focus();
}
function closeChat() { document.getElementById('chat-panel').classList.remove('open'); chatTarget=null; }

function renderChatMessages() {
  if(!chatTarget) return;
  const msgs = getChatMsgs(chatTarget.id);
  const container = document.getElementById('chat-messages');
  container.innerHTML = msgs.length
    ? msgs.map(m=>`<div class="msg ${m.mine?'mine':'theirs'}">${m.text}<div class="msg-time">${m.time}</div></div>`).join('')
    : `<div style="text-align:center;color:var(--text-muted);font-size:13px;padding:1rem">Say hi to ${chatTarget.name}!</div>`;
  container.scrollTop = container.scrollHeight;
}

function sendMessage() {
  if(!chatTarget) return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if(!text) return;
  const msgs = getChatMsgs(chatTarget.id);
  msgs.push({mine:true, text, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});
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
      const reply = AUTO_REPLIES[Math.floor(Math.random()*AUTO_REPLIES.length)];
      msgs.push({mine:false, text:reply, time:new Date().toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})});
      saveChatMsgs(replyTargetId, msgs);
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
  document.getElementById('notif-panel').classList.toggle('open', notifPanelOpen);
  if(notifPanelOpen) renderNotifPanel();
}

function renderNotifPanel() {
  const notifs = getUserNotifs();
  const list = document.getElementById('notif-list');
  list.innerHTML = notifs.length
    ? notifs.map(n=>`
        <div class="notif-item ${n.read?'':'unread'}" onclick="markRead(${n.id})">
          <div class="notif-icon ${n.type}"><i class="ti ${n.icon}" aria-hidden="true"></i></div>
          <div><div class="notif-text">${n.text}</div><div class="notif-time">${n.time}</div></div>
        </div>`).join('')
    : `<div class="empty"><i class="ti ti-bell-off"></i><p>No notifications yet</p></div>`;
  if('Notification' in window && Notification.permission==='default') {
    list.insertAdjacentHTML('afterbegin',`<div style="padding:0.75rem 1rem;background:var(--accent-light);font-size:13px;display:flex;align-items:center;gap:10px">
      <i class="ti ti-bell" style="color:var(--accent);font-size:18px"></i>
      <span style="flex:1">Get notified about activities near you</span>
      <button class="btn btn-accent btn-sm" onclick="requestNotifPermission()">Enable</button>
    </div>`);
  }
}

function markRead(id) {
  const notifs = getUserNotifs();
  const n = notifs.find(n=>n.id===id); if(n) n.read=true;
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
  if(!store.get('install_dismissed')) document.getElementById('install-banner').classList.add('show');
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

/* ════════ NAV ════════ */
function goTo(page) {
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-tab,.bnav-item').forEach(t=>t.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  const dt = document.getElementById('tab-'+page); if(dt) dt.classList.add('active');
  const bt = document.getElementById('bnav-'+page); if(bt) bt.classList.add('active');
  if(page==='people') { renderPeoplePills(); renderPeople(); if(peopleMode==='match') startDeck(); }
  if(page==='friends') renderFriends();
  if(page==='profile') renderProfile();
  if(page==='plans') renderPlans();
  if(page==='discover') renderForYou();
  if(notifPanelOpen) { notifPanelOpen=false; document.getElementById('notif-panel').classList.remove('open'); }
  window.scrollTo({top:0});
}

/* ════════ TOAST ════════ */

function showToast(msg, kind, icon) {
  const t = document.getElementById('toast');
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
  if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

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
    }
  });

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') {
      if(chatTarget) closeChat();
      if(notifPanelOpen) { notifPanelOpen=false; document.getElementById('notif-panel').classList.remove('open'); }
      document.getElementById('modal-overlay').classList.remove('open');
      document.getElementById('detail-overlay').classList.remove('open');
      closeBored();
    }
  });
})();
