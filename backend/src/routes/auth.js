import { Hono } from 'hono';
import { hashPassword, verifyPassword, signToken, requireAuth } from '../lib/auth.js';
import { userShape, initialsFrom } from '../lib/helpers.js';

const COLORS = ['#5C7152', '#B07D3C', '#8A5A6A', '#AF553D', '#5B6485', '#3F7672', '#8C6A43', '#6B774F'];
const r = new Hono();

r.post('/signup', async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const name = (b.name || '').trim();
  const email = (b.email || '').trim().toLowerCase();
  const password = b.password || '';
  if (!name || !email || password.length < 6) {
    return c.json({ error: 'Please fill all fields (password min 6 characters).' }, 400);
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return c.json({ error: 'Please enter a valid email address.' }, 400);
  }
  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return c.json({ error: 'That email is already registered.' }, 409);

  const hash = await hashPassword(password);
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  const initials = initialsFrom(name);
  const interests = JSON.stringify(Array.isArray(b.interests) ? b.interests.slice(0, 12) : []);

  const user = await c.env.DB.prepare(
    `INSERT INTO users (email, name, password_hash, initials, color, interests, is_bot)
     VALUES (?,?,?,?,?,?,0) RETURNING *`
  ).bind(email, name, hash, initials, color, interests).first();

  await c.env.DB.prepare('INSERT INTO user_stats (user_id) VALUES (?)').bind(user.id).run();

  const token = await signToken(user.id, c.env.JWT_SECRET);
  return c.json({ token, user: userShape(user) });
});

r.post('/login', async (c) => {
  const b = await c.req.json().catch(() => ({}));
  const email = (b.email || '').trim().toLowerCase();
  const password = b.password || '';
  if (!email || !password) return c.json({ error: 'Please enter your email and password.' }, 400);

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ? AND is_bot = 0').bind(email).first();
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return c.json({ error: 'Incorrect email or password.' }, 401);
  }
  await c.env.DB.prepare('UPDATE users SET last_seen = unixepoch() WHERE id = ?').bind(user.id).run();
  const token = await signToken(user.id, c.env.JWT_SECRET);
  return c.json({ token, user: userShape(user) });
});

r.get('/me', requireAuth(), async (c) => {
  const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(c.get('userId')).first();
  if (!user) return c.json({ error: 'User not found' }, 404);
  return c.json(userShape(user));
});

export default r;
