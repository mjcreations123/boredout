import { SignJWT, jwtVerify } from 'jose';

const enc = new TextEncoder();

function b64(buf) {
  let s = '';
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}
function unb64(str) {
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
}

const ITERATIONS = 100000;

// Web Crypto PBKDF2 (SHA-256). Native in Workers — no bcrypt dependency.
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' }, key, 256);
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(bits)}`;
}

export async function verifyPassword(password, stored) {
  if (!stored) return false;
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const iterations = parseInt(parts[1], 10);
  const salt = unb64(parts[2]);
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  const a = b64(bits);
  const b = parts[3];
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signToken(userId, secret) {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(enc.encode(secret));
}

export async function verifyToken(token, secret) {
  const { payload } = await jwtVerify(token, enc.encode(secret));
  return payload;
}

// Hono middleware — requires a valid Bearer token, sets c.var.userId.
export function requireAuth() {
  return async (c, next) => {
    const header = c.req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return c.json({ error: 'Not authenticated' }, 401);
    }
    try {
      const payload = await verifyToken(header.slice(7), c.env.JWT_SECRET);
      c.set('userId', payload.sub);
      await next();
    } catch {
      return c.json({ error: 'Session expired — please log in again' }, 401);
    }
  };
}
