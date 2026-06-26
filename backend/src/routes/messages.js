import { Hono } from 'hono';
import { requireAuth } from '../lib/auth.js';
import { clockTime } from '../lib/helpers.js';
import { awardXp, notify } from '../lib/db-ops.js';

const r = new Hono();
r.use('*', requireAuth());
const XP_MSG = 5;

const AUTO_REPLIES = [
  "Hey! Yeah, I'm down for that.",
  "Oh nice — what time were you thinking?",
  "Haha sounds good to me.",
  "I'm around this week, let's make it happen.",
  "That place is great, I'm in.",
  "Cool, send me the details.",
  "Been wanting to try that. Count me in.",
  "Maybe — let me check my schedule and get back to you.",
  "For sure. Want to invite a few more people?",
  "Sounds like a plan. See you there.",
];

function shape(m, me) {
  return { id: m.id, text: m.text, mine: m.sender_id === me, time: clockTime(m.sent_at), seen: !!m.seen };
}

const PAIR = `((sender_id = ? AND recipient_id = ?) OR (sender_id = ? AND recipient_id = ?))`;

// Poll must be registered before the bare "/:userId" so it isn't shadowed.
r.get('/:userId/poll', async (c) => {
  const me = c.get('userId');
  const other = c.req.param('userId');
  const after = c.req.query('after');
  let afterUnix = 0;
  if (after) { const t = Date.parse(after); if (!isNaN(t)) afterUnix = Math.floor(t / 1000); }
  const rows = (await c.env.DB.prepare(
    `SELECT * FROM messages WHERE sent_at <= unixepoch() AND sent_at > ? AND ${PAIR} ORDER BY sent_at ASC LIMIT 100`
  ).bind(afterUnix, me, other, other, me).all()).results;
  if (rows.length) {
    await c.env.DB.prepare('UPDATE messages SET seen = 1 WHERE sender_id = ? AND recipient_id = ? AND seen = 0').bind(other, me).run();
  }
  return c.json(rows.map(m => shape(m, me)));
});

r.get('/:userId', async (c) => {
  const me = c.get('userId');
  const other = c.req.param('userId');
  const rows = (await c.env.DB.prepare(
    `SELECT * FROM messages WHERE sent_at <= unixepoch() AND ${PAIR} ORDER BY sent_at ASC LIMIT 100`
  ).bind(me, other, other, me).all()).results;
  await c.env.DB.prepare('UPDATE messages SET seen = 1 WHERE sender_id = ? AND recipient_id = ? AND seen = 0').bind(other, me).run();
  return c.json(rows.map(m => shape(m, me)));
});

r.post('/:userId', async (c) => {
  const me = c.get('userId');
  const other = c.req.param('userId');
  const b = await c.req.json().catch(() => ({}));
  const text = (b.text || '').trim();
  if (!text) return c.json({ error: 'Message cannot be empty.' }, 400);

  const msg = await c.env.DB.prepare(
    'INSERT INTO messages (sender_id, recipient_id, text, seen, sent_at) VALUES (?,?,?,0,unixepoch()) RETURNING *'
  ).bind(me, other, text).first();
  await awardXp(c.env.DB, me, XP_MSG, 'Sent a message', 'msgs');

  // If chatting with a bot, schedule an auto-reply ~2s in the future.
  // The poll/list queries filter `sent_at <= unixepoch()`, so it surfaces shortly after.
  const target = await c.env.DB.prepare('SELECT name, is_bot FROM users WHERE id = ?').bind(other).first();
  if (target && target.is_bot) {
    const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
    await c.env.DB.prepare(
      'INSERT INTO messages (sender_id, recipient_id, text, seen, sent_at) VALUES (?,?,?,0,unixepoch() + 2)'
    ).bind(other, me, reply).run();
    await notify(c.env.DB, me, `${target.name} replied to you`, 'ti-message', 'accent');
  }
  return c.json({ ...shape(msg, me), xp: XP_MSG });
});

export default r;
