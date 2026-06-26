import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { userShape, personShape, initialsFrom } from '../lib/helpers.js';

const r = new Hono();
r.use('*', requireAuth());

// Everyone but me, with online status + mutual-friend count.
r.get('/', async (c) => {
  const me = c.get('userId');
  const rows = (await c.env.DB.prepare(
    `SELECT u.id, u.name, u.initials, u.color, u.bio, u.mood, u.location, u.interests,
       CASE WHEN u.last_seen > unixepoch() - 300 THEN 1 ELSE 0 END AS online,
       (SELECT COUNT(*) FROM friendships f1
          JOIN friendships f2 ON f1.friend_id = f2.friend_id
          WHERE f1.user_id = u.id AND f2.user_id = ?) AS mutual
     FROM users u
     WHERE u.id != ?
     ORDER BY online DESC, u.name`
  ).bind(me, me).all()).results;
  return c.json(rows.map(u => personShape(u)));
});

r.get('/:id', async (c) => {
  const u = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first();
  if (!u) return c.json({ error: 'User not found' }, 404);
  return c.json(personShape(u));
});

r.patch('/me', async (c) => {
  const me = c.get('userId');
  const b = await c.req.json().catch(() => ({}));
  const name = b.name !== undefined ? String(b.name).trim() : null;
  const initials = name ? initialsFrom(name) : null;
  const interests = b.interests !== undefined ? JSON.stringify(b.interests) : null;
  await c.env.DB.prepare(
    `UPDATE users SET
       name      = COALESCE(?, name),
       initials  = COALESCE(?, initials),
       bio       = COALESCE(?, bio),
       mood      = COALESCE(?, mood),
       location  = COALESCE(?, location),
       interests = COALESCE(?, interests)
     WHERE id = ?`
  ).bind(name, initials, b.bio ?? null, b.mood ?? null, b.location ?? null, interests, me).run();
  const u = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(me).first();
  return c.json(userShape(u));
});

export default r;
