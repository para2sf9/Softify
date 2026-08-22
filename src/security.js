import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { JWT_SECRET, TOKEN_TTL_HOURS } from './config.js';

function b64(value) { return Buffer.from(value).toString('base64url'); }
function unb64(value) { return Buffer.from(value, 'base64url').toString('utf8'); }

export function hashPassword(password, salt = randomBytes(16).toString('hex')) {
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, expected] = String(stored || '').split(':');
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export function signToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = b64(JSON.stringify({ sub: user.id, email: user.email, role: user.role, name: user.name, iat: now, exp: now + TOKEN_TTL_HOURS * 3600 }));
  const signature = createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token) {
  try {
    const [header, payload, signature] = String(token || '').split('.');
    if (!header || !payload || !signature) return null;
    const expected = createHmac('sha256', JWT_SECRET).update(`${header}.${payload}`).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
    const claims = JSON.parse(unb64(payload));
    if (!claims.exp || claims.exp < Math.floor(Date.now() / 1000)) return null;
    return claims;
  } catch { return null; }
}

export function securityHeaders(contentType = 'application/json; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Content-Security-Policy': ["default-src 'self'", "img-src 'self' data: https:", "media-src 'self' https:", "style-src 'self'", "script-src 'self'", "connect-src 'self'", "font-src 'self' data:", "frame-src https:", "object-src 'none'", "base-uri 'self'", "form-action 'self'"].join('; ')
  };
}

export const ROLE_PERMISSIONS = {
  'Super Admin': ['*'],
  'Organization Admin': ['*'],
  'Project Manager': ['read','projects:write','requirements:write','releases:write','reports:write','quality:write'],
  'Product Manager': ['read','projects:write','requirements:write','releases:write'],
  'Business Analyst': ['read','requirements:write','documents:write'],
  'Developer': ['read','defects:write','automation:write','releases:write'],
  'QA Engineer': ['read','assets:write','tests:write','defects:write','quality:write','documents:write'],
  'Automation Engineer': ['read','tests:write','defects:write','automation:write','tools:write'],
  'Security Engineer': ['read','security:write','defects:write','quality:write'],
  'DevOps Engineer': ['read','automation:write','environments:write','releases:write','tools:write'],
  'Viewer': ['read']
};

export function can(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes('*') || permissions.includes(permission) || (permission === 'read' && permissions.includes('read'));
}
