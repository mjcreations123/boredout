import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { awardXp } from '../lib/db-ops.js';

const r = new Hono();
r.use('*', requireAuth());

const XP_JOIN = 20;
const XP_RATE = 10;

function shape(a, joinedSet, ratingMap) {
  return {
    id: a.id, cat: a.cat, emoji: a.emoji, title: a.title, location: a.location,
    dist: a.dist, time: a.time, cost: a.cost, going: a.going, badge: a.badge || null,
    desc: a.description,
    joined: joinedSet.has(a.id),
    myRating: ratingMap.get(a.id) || 0,
  };
}

r.get('/', async (c) => {
  const me = c.get('userId');
  const acts = (await c.env.DB.prepare('SELECT * FROM activities ORDER BY id').all()).results;
  const joins = (await c.env.DB.prepare('SELECT activity_id FROM activity_joins WHERE user_id = ?').bind(me).all()).results;
  const rates = (await c.env.DB.prepare('SELECT activity_id, rating FROM activity_ratings WHERE user_id = ?').bind(me).all()).results;
  const joinedSet = new Set(joins.map(j => j.activity_id));
  const ratingMap = new Map(rates.map(rt => [rt.activity_id, rt.rating]));
  return c.json(acts.map(a => shape(a, joinedSet, ratingMap)));
});

r.post('/:id/join', async (c) => {
  const me = c.get('userId');
  const id = parseInt(c.req.param('id'), 10);
  const existing = await c.env.DB.prepare('SELECT 1 FROM activity_joins WHERE user_id = ? AND activity_id = ?').bind(me, id).first();
  if (existing) {
    await c.env.DB.prepare('DELETE FROM activity_joins WHERE user_id = ? AND activity_id = ?').bind(me, id).run();
    await c.env.DB.prepare('UPDATE activities SET going = MAX(0, going - 1) WHERE id = ?').bind(id).run();
    return c.json({ joined: false });
  }
  await c.env.DB.prepare('INSERT INTO activity_joins (user_id, activity_id) VALUES (?, ?)').bind(me, id).run();
  await c.env.DB.prepare('UPDATE activities SET going = going + 1 WHERE id = ?').bind(id).run();
  await awardXp(c.env.DB, me, XP_JOIN, 'Joined an activity', 'joins');
  return c.json({ joined: true, xp: XP_JOIN });
});

r.post('/:id/rate', async (c) => {
  const me = c.get('userId');
  const id = parseInt(c.req.param('id'), 10);
  const b = await c.req.json().catch(() => ({}));
  const rating = Math.max(1, Math.min(5, parseInt(b.rating, 10) || 0));
  if (!rating) return c.json({ error: 'Rating must be 1–5.' }, 400);

  const prior = await c.env.DB.prepare('SELECT rating FROM activity_ratings WHERE user_id = ? AND activity_id = ?').bind(me, id).first();
  await c.env.DB.prepare(
    `INSERT INTO activity_ratings (user_id, activity_id, rating) VALUES (?,?,?)
     ON CONFLICT(user_id, activity_id) DO UPDATE SET rating = excluded.rating`
  ).bind(me, id, rating).run();

  const agg = await c.env.DB.prepare('SELECT AVG(rating) AS avg, COUNT(*) AS count FROM activity_ratings WHERE activity_id = ?').bind(id).first();
  const res = { ok: true, avg: agg.avg, count: agg.count };
  if (!prior) res.xp = (await awardXp(c.env.DB, me, XP_RATE, 'Rated an activity', 'rates'), XP_RATE);
  return c.json(res);
});

export default r;
