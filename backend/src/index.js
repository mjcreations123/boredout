import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { verifyToken } from './lib/auth.js';
import auth from './routes/auth.js';
import users from './routes/users.js';
import activities from './routes/activities.js';
import plans from './routes/plans.js';
import friends from './routes/friends.js';
import messages from './routes/messages.js';
import stats from './routes/stats.js';
import notifications from './routes/notifications.js';

const app = new Hono();

// CORS — allow any Netlify deploy + local dev ports.
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return origin;
    if (/\.netlify\.(app|live)$/.test(origin)) return origin;
    if (/^http:\/\/(localhost|127\.0\.0\.1):(4173|3000|5173|8787)$/.test(origin)) return origin;
    return null;
  },
  allowMethods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Best-effort: touch last_seen on every authenticated request (non-blocking).
app.use('*', async (c, next) => {
  const h = c.req.header('Authorization');
  if (h && h.startsWith('Bearer ')) {
    try {
      const payload = await verifyToken(h.slice(7), c.env.JWT_SECRET);
      c.executionCtx.waitUntil(
        c.env.DB.prepare('UPDATE users SET last_seen = unixepoch() WHERE id = ?').bind(payload.sub).run()
      );
    } catch (_) { /* unauthenticated requests just pass through */ }
  }
  await next();
});

app.get('/health', (c) => c.json({ ok: true, time: new Date().toISOString() }));

app.route('/api/auth', auth);
app.route('/api/users', users);
app.route('/api/activities', activities);
app.route('/api/plans', plans);
app.route('/api/friends', friends);
app.route('/api/messages', messages);
app.route('/api/stats', stats);
app.route('/api/notifications', notifications);

app.notFound((c) => c.json({ error: 'Not found' }, 404));
app.onError((err, c) => {
  console.error(err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
