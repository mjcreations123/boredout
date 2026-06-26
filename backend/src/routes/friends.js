import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { awardXp, ensureStats, notify } from '../lib/db-ops.js';

const r = new Hono();
r.use('*', requireAuth());
const XP_FRIEND = 30;

const ONLINE = 'CASE WHEN last_seen > unixepoch() - 300 THEN 1 ELSE 0 END';

r.get('/', async (c) => {
  const me = c.get('userId');
  const rows = (await c.env.DB.prepare(
    `SELECT u.id, u.name, u.initials, u.color, ${ONLINE.replace(/last_seen/g, 'u.last_seen')} AS online
     FROM friendships f JOIN users u ON u.id = f.friend_id
     WHERE f.user_id = ? ORDER BY online DESC, u.name`
  ).bind(me).all()).results;
  return c.json(rows.map(u => ({ id: u.id, name: u.name, initials: u.initials, color: u.color, online: !!u.online })));
});

r.get('/requests', async (c) => {
  const me = c.get('userId');
  const incoming = (await c.env.DB.prepare(
    'SELECT u.id, u.name, u.initials, u.color FROM friend_requests fr JOIN users u ON u.id = fr.from_id WHERE fr.to_id = ?'
  ).bind(me).all()).results.map(u => ({ id: u.id, name: u.name, initials: u.initials, color: u.color, from_me: false, sub: 'Wants to connect' }));
  const outgoing = (await c.env.DB.prepare(
    'SELECT u.id, u.name, u.initials, u.color FROM friend_requests fr JOIN users u ON u.id = fr.to_id WHERE fr.from_id = ?'
  ).bind(me).all()).results.map(u => ({ id: u.id, name: u.name, initials: u.initials, color: u.color, from_me: true, sub: 'Request sent' }));
  return c.json([...incoming, ...outgoing]);
});

r.post('/request/:userId', async (c) => {
  const me = c.get('userId');
  const target = c.req.param('userId');
  if (target === me) return c.json({ error: 'You cannot add yourself.' }, 400);
  const already = await c.env.DB.prepare('SELECT 1 FROM friendships WHERE user_id = ? AND friend_id = ?').bind(me, target).first();
  if (already) return c.json({ error: 'You are already friends.' }, 409);
  await c.env.DB.prepare('INSERT OR IGNORE INTO friend_requests (from_id, to_id) VALUES (?, ?)').bind(me, target).run();
  const meUser = await c.env.DB.prepare('SELECT name FROM users WHERE id = ?').bind(me).first();
  await notify(c.env.DB, target, `${meUser?.name || 'Someone'} sent you a friend request`, 'ti-user-plus', 'accent');
  return c.json({ ok: true });
});

r.delete('/request/:userId', async (c) => {
  const me = c.get('userId');
  await c.env.DB.prepare('DELETE FROM friend_requests WHERE from_id = ? AND to_id = ?').bind(me, c.req.param('userId')).run();
  return c.json({ ok: true });
});

r.post('/accept/:userId', async (c) => {
  const me = c.get('userId');
  const other = c.req.param('userId');
  const req = await c.env.DB.prepare('SELECT 1 FROM friend_requests WHERE from_id = ? AND to_id = ?').bind(other, me).first();
  if (!req) return c.json({ error: 'No pending request from that person.' }, 404);

  await c.env.DB.prepare('DELETE FROM friend_requests WHERE from_id = ? AND to_id = ?').bind(other, me).run();
  await c.env.DB.prepare('INSERT OR IGNORE INTO friendships (user_id, friend_id) VALUES (?,?), (?,?)').bind(me, other, other, me).run();

  await ensureStats(c.env.DB, me);
  await ensureStats(c.env.DB, other);
  await c.env.DB.prepare('UPDATE user_stats SET friends_count = friends_count + 1 WHERE user_id IN (?, ?)').bind(me, other).run();
  await awardXp(c.env.DB, me, XP_FRIEND, 'Made a friend', null);
  await awardXp(c.env.DB, other, XP_FRIEND, 'Made a friend', null);

  const meUser = await c.env.DB.prepare('SELECT name FROM users WHERE id = ?').bind(me).first();
  await notify(c.env.DB, other, `${meUser?.name || 'Someone'} accepted your friend request`, 'ti-heart', 'good');

  const friend = await c.env.DB.prepare(
    `SELECT id, name, initials, color, ${ONLINE} AS online FROM users WHERE id = ?`
  ).bind(other).first();
  return c.json({ ok: true, friend: { id: friend.id, name: friend.name, initials: friend.initials, color: friend.color, online: !!friend.online }, xp: XP_FRIEND });
});

r.post('/decline/:userId', async (c) => {
  const me = c.get('userId');
  await c.env.DB.prepare('DELETE FROM friend_requests WHERE from_id = ? AND to_id = ?').bind(c.req.param('userId'), me).run();
  return c.json({ ok: true });
});

r.delete('/:userId', async (c) => {
  const me = c.get('userId');
  const other = c.req.param('userId');
  await c.env.DB.prepare('DELETE FROM friendships WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)').bind(me, other, other, me).run();
  await c.env.DB.prepare('UPDATE user_stats SET friends_count = MAX(0, friends_count - 1) WHERE user_id IN (?, ?)').bind(me, other).run();
  return c.json({ ok: true });
});

export default r;
