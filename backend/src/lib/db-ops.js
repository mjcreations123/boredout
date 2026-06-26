import { pushXpLog } from './helpers.js';

// Stat keys that internal code is allowed to increment (never user-supplied raw).
export const STAT_KEYS = ['joins', 'friends_count', 'plans_count', 'rates', 'msgs', 'bored_uses'];

export async function ensureStats(DB, userId) {
  await DB.prepare('INSERT OR IGNORE INTO user_stats (user_id) VALUES (?)').bind(userId).run();
}

// Award XP and (optionally) bump one counter. Returns the new XP total.
export async function awardXp(DB, userId, amount, reason, statKey) {
  await ensureStats(DB, userId);
  const s = await DB.prepare('SELECT xp, xp_log FROM user_stats WHERE user_id = ?').bind(userId).first();
  const newLog = pushXpLog(s.xp_log, amount, reason);
  if (statKey && STAT_KEYS.includes(statKey)) {
    await DB.prepare(`UPDATE user_stats SET xp = xp + ?, ${statKey} = ${statKey} + 1, xp_log = ? WHERE user_id = ?`)
      .bind(amount, newLog, userId).run();
  } else {
    await DB.prepare('UPDATE user_stats SET xp = xp + ?, xp_log = ? WHERE user_id = ?')
      .bind(amount, newLog, userId).run();
  }
  return (s.xp || 0) + amount;
}

export async function notify(DB, userId, text, icon, type) {
  await DB.prepare('INSERT INTO notifications (user_id, text, icon, type) VALUES (?,?,?,?)')
    .bind(userId, text, icon || 'ti-bell', type || 'accent').run();
}
