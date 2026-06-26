import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { statsShape } from '../lib/helpers.js';
import { ensureStats, awardXp, STAT_KEYS } from '../lib/db-ops.js';

const r = new Hono();
r.use('*', requireAuth());
const XP_CHECKIN = 5;

function dayStr(offsetMs = 0) {
  return new Date(Date.now() + offsetMs).toISOString().slice(0, 10);
}

r.get('/', async (c) => {
  const me = c.get('userId');
  await ensureStats(c.env.DB, me);
  const s = await c.env.DB.prepare('SELECT * FROM user_stats WHERE user_id = ?').bind(me).first();
  return c.json(statsShape(s));
});

r.post('/xp', async (c) => {
  const me = c.get('userId');
  const b = await c.req.json().catch(() => ({}));
  const amount = Math.max(0, Math.min(1000, parseInt(b.amount, 10) || 0));
  const statKey = STAT_KEYS.includes(b.statKey) ? b.statKey : null;
  const xp = await awardXp(c.env.DB, me, amount, b.reason || 'Earned XP', statKey);
  return c.json({ xp });
});

r.post('/badges', async (c) => {
  const me = c.get('userId');
  const b = await c.req.json().catch(() => ({}));
  const badges = Array.isArray(b.badges) ? b.badges.filter(x => typeof x === 'string').slice(0, 50) : [];
  await ensureStats(c.env.DB, me);
  await c.env.DB.prepare('UPDATE user_stats SET badges = ? WHERE user_id = ?').bind(JSON.stringify(badges), me).run();
  return c.json({ ok: true });
});

r.post('/checkin', async (c) => {
  const me = c.get('userId');
  await ensureStats(c.env.DB, me);
  const s = await c.env.DB.prepare('SELECT * FROM user_stats WHERE user_id = ?').bind(me).first();
  const today = dayStr();
  if (s.last_checkin === today) return c.json({ ok: false, streak: s.streak });
  const yesterday = dayStr(-86400000);
  const streak = s.last_checkin === yesterday ? s.streak + 1 : 1;
  await c.env.DB.prepare('UPDATE user_stats SET last_checkin = ?, streak = ?, xp = xp + ? WHERE user_id = ?')
    .bind(today, streak, XP_CHECKIN, me).run();
  return c.json({ ok: true, xp: XP_CHECKIN, streak });
});

r.post('/streak-touch', async (c) => {
  const me = c.get('userId');
  await ensureStats(c.env.DB, me);
  const s = await c.env.DB.prepare('SELECT * FROM user_stats WHERE user_id = ?').bind(me).first();
  const today = dayStr();
  const yesterday = dayStr(-86400000);
  let streak = s.streak, changed = false, lostStreak = false;
  if (s.last_active !== today) {
    if (s.last_active === yesterday) { streak = s.streak + 1; changed = true; }
    else if (s.last_active) { lostStreak = s.streak > 1; streak = 1; changed = true; }
    await c.env.DB.prepare('UPDATE user_stats SET last_active = ?, streak = ? WHERE user_id = ?').bind(today, streak, me).run();
  }
  return c.json({ streak, changed, lostStreak });
});

export default r;
