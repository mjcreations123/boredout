// Shared shaping + JSON helpers for D1 rows.

export function jparse(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; }
  catch { return fallback; }
}

export function initialsFrom(name) {
  return (name || '').trim().split(/\s+/).map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';
}

// Public shape of a user (never leaks password_hash).
export function userShape(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    initials: u.initials,
    color: u.color,
    bio: u.bio,
    mood: u.mood,
    location: u.location,
    interests: jparse(u.interests, []),
    created_at: u.created_at,
  };
}

const ONLINE_WINDOW = 300; // seconds

// A person row as the People/Friends UI expects it.
export function personShape(u, extra = {}) {
  return {
    id: u.id,
    name: u.name,
    initials: u.initials,
    color: u.color,
    bio: u.bio,
    mood: u.mood,
    location: u.location,
    interests: jparse(u.interests, []),
    online: typeof u.online !== 'undefined' ? !!u.online : false,
    mutual: u.mutual || 0,
    dist: extra.dist || mockDist(u.id),
    ...extra,
  };
}

export { ONLINE_WINDOW };

// Deterministic, stable mock distance from a user id (no real geo in MVP).
export function mockDist(id) {
  let h = 0;
  const s = String(id);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const tenths = (h % 28) + 2; // 0.2 .. 2.9 mi
  return (tenths / 10).toFixed(1) + ' mi';
}

// Default empty stats row values (used when creating a user_stats row).
export function defaultStats(userId) {
  return {
    user_id: userId, xp: 0, streak: 1, last_active: null, last_checkin: null,
    joins: 0, friends_count: 0, plans_count: 0, rates: 0, msgs: 0, bored_uses: 0,
    badges: '[]', xp_log: '[]',
  };
}

export function statsShape(s) {
  return {
    xp: s.xp, streak: s.streak,
    joins: s.joins, friends_count: s.friends_count, plans_count: s.plans_count,
    rates: s.rates, msgs: s.msgs, bored_uses: s.bored_uses,
    badges: jparse(s.badges, []),
    xp_log: jparse(s.xp_log, []),
    last_active: s.last_active, last_checkin: s.last_checkin,
  };
}

// Push an entry onto a JSON xp_log string, capped at 20 most-recent.
export function pushXpLog(xpLogStr, amount, reason) {
  const log = jparse(xpLogStr, []);
  log.unshift({ amount, reason: reason || 'Earned XP' });
  return JSON.stringify(log.slice(0, 20));
}

// "2h ago" style relative time from a unix-seconds timestamp.
export function timeAgo(unixSeconds) {
  const diff = Math.max(0, Math.floor(Date.now() / 1000) - unixSeconds);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
  if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
  if (diff < 604800) return Math.floor(diff / 86400) + 'd ago';
  return Math.floor(diff / 604800) + 'w ago';
}

// HH:MM am/pm from unix seconds (for chat message display).
export function clockTime(unixSeconds) {
  const d = new Date(unixSeconds * 1000);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  return `${h}:${m} ${ap}`;
}
