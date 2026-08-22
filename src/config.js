import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT_DIR = path.resolve(__dirname, '..');
export const PUBLIC_DIR = path.join(ROOT_DIR, 'public');
export const DATA_DIR = path.join(ROOT_DIR, 'data');
export const DB_FILE = process.env.DATA_FILE ? path.resolve(process.env.DATA_FILE) : path.join(DATA_DIR, 'softify.json');
export const PORT = Number(process.env.PORT || 4000);
export const HOST = process.env.HOST || '0.0.0.0';
export const JWT_SECRET = process.env.JWT_SECRET || 'softify-development-secret-change-before-production';
export const TOKEN_TTL_HOURS = Number(process.env.TOKEN_TTL_HOURS || 12);
export const MAX_BODY_BYTES = 2_000_000;

export const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon'
};
