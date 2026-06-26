import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { timeAgo } from '../lib/helpers.js';

const r = new Hono();
r.use('*', requireAuth());

r.get('/', async (c) => {
  const me = c.get('userId');
  const rows = (await c.env.DB.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30'
  ).bind(me).all()).results;
  return c.json(rows.map(n => ({
    id: n.id, text: n.text, icon: n.icon, type: n.type, read: !!n.is_read, time: timeAgo(n.created_at),
  })));
});

r.post('/read-all', async (c) => {
  const me = c.get('userId');
  await c.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?').bind(me).run();
  return c.json({ ok: true });
});

r.post('/:id/read', async (c) => {
  const me = c.get('userId');
  await c.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').bind(c.req.param('id'), me).run();
  return c.json({ ok: true });
});

r.post('/', async (c) => {
  const me = c.get('userId');
  const b = await c.req.json().catch(() => ({}));
  const row = await c.env.DB.prepare(
    'INSERT INTO notifications (user_id, text, icon, type) VALUES (?,?,?,?) RETURNING id'
  ).bind(me, b.text || '', b.icon || 'ti-bell', b.type || 'accent').first();
  return c.json({ id: row.id });
});

export default r;
