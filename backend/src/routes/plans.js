import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { jparse } from '../lib/helpers.js';
import { awardXp } from '../lib/db-ops.js';

const r = new Hono();
r.use('*', requireAuth());

const XP_PLAN = 25;

function shape(p) {
  return {
    id: p.id, title: p.title, cat: p.cat, month: p.month, day: p.day, time: p.time,
    location: p.location, notes: p.notes || '', people: jparse(p.people, []),
    rsvp: p.rsvp, status: p.status,
  };
}

r.get('/', async (c) => {
  const me = c.get('userId');
  const rows = (await c.env.DB.prepare('SELECT * FROM plans WHERE user_id = ? ORDER BY created_at DESC').bind(me).all()).results;
  return c.json(rows.map(shape));
});

r.post('/', async (c) => {
  const me = c.get('userId');
  const b = await c.req.json().catch(() => ({}));
  if (!b.title) return c.json({ error: 'Please enter a plan title.' }, 400);
  const people = JSON.stringify(Array.isArray(b.people) ? b.people : []);
  const plan = await c.env.DB.prepare(
    `INSERT INTO plans (user_id, title, cat, month, day, time, location, notes, people, rsvp, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?) RETURNING *`
  ).bind(
    me, b.title, b.cat || 'social', b.month || '', b.day || '', b.time || '',
    b.location || 'TBD', b.notes || '', people, b.rsvp || 'going', b.status || 'pending'
  ).first();
  await awardXp(c.env.DB, me, XP_PLAN, 'Created a plan', 'plans_count');
  return c.json({ ...shape(plan), xp: XP_PLAN });
});

r.patch('/:id', async (c) => {
  const me = c.get('userId');
  const id = c.req.param('id');
  const b = await c.req.json().catch(() => ({}));
  const people = b.people !== undefined ? JSON.stringify(b.people) : null;
  await c.env.DB.prepare(
    `UPDATE plans SET
       title    = COALESCE(?, title),
       cat      = COALESCE(?, cat),
       month    = COALESCE(?, month),
       day      = COALESCE(?, day),
       time     = COALESCE(?, time),
       location = COALESCE(?, location),
       notes    = COALESCE(?, notes),
       people   = COALESCE(?, people),
       rsvp     = COALESCE(?, rsvp),
       status   = COALESCE(?, status)
     WHERE id = ? AND user_id = ?`
  ).bind(
    b.title ?? null, b.cat ?? null, b.month ?? null, b.day ?? null, b.time ?? null,
    b.location ?? null, b.notes ?? null, people, b.rsvp ?? null, b.status ?? null, id, me
  ).run();
  const p = await c.env.DB.prepare('SELECT * FROM plans WHERE id = ? AND user_id = ?').bind(id, me).first();
  if (!p) return c.json({ error: 'Plan not found' }, 404);
  return c.json(shape(p));
});

r.delete('/:id', async (c) => {
  const me = c.get('userId');
  await c.env.DB.prepare('DELETE FROM plans WHERE id = ? AND user_id = ?').bind(c.req.param('id'), me).run();
  return c.json({ ok: true });
});

export default r;
