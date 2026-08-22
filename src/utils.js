import { randomUUID } from 'node:crypto';
import { MAX_BODY_BYTES } from './config.js';
import { securityHeaders } from './security.js';

export function sendJson(res, status, payload, extra = {}) {
  res.writeHead(status, { ...securityHeaders(), ...extra });
  res.end(JSON.stringify(payload));
}
export function sendNoContent(res) { res.writeHead(204, securityHeaders()); res.end(); }
export function now() { return new Date().toISOString(); }
export function id(prefix = '') { return prefix ? `${prefix}-${randomUUID().slice(0,8).toUpperCase()}` : randomUUID(); }
export function text(value, max = 500) { return typeof value === 'string' ? value.trim().slice(0,max) : ''; }
export function array(value, max = 20) { return Array.isArray(value) ? [...new Set(value.map(v => text(v,100)).filter(Boolean))].slice(0,max) : []; }
export function safeUrl(value) {
  const raw = text(value, 2000); if (!raw) return '';
  try { const u = new URL(raw); return ['http:','https:'].includes(u.protocol) ? u.toString() : ''; } catch { return ''; }
}
export async function body(req) {
  let size=0; const chunks=[];
  for await (const chunk of req) { size += chunk.length; if(size>MAX_BODY_BYTES) throw Object.assign(new Error('Request body too large.'),{statusCode:413}); chunks.push(chunk); }
  if(!chunks.length) return {};
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw Object.assign(new Error('Invalid JSON body.'),{statusCode:400}); }
}
export function paginate(items, params) {
  const page=Math.max(1,Number(params.get('page')||1)); const limit=Math.min(100,Math.max(1,Number(params.get('limit')||50))); const total=items.length;
  return { items: items.slice((page-1)*limit,page*limit), page, limit, total, pages: Math.max(1,Math.ceil(total/limit)) };
}
export function searchFilter(items, params) {
  const q=text(params.get('q'),100).toLowerCase();
  const filters=['status','projectId','priority','type','health','category','tool','severity','ownerId']
    .map(key=>[key,text(params.get(key),100)]).filter(([,value])=>value&&value!=='All');
  return items.filter(item => {
    const hay=Object.values(item).flatMap(v=>Array.isArray(v)?v:[v]).filter(v=>typeof v==='string').join(' ').toLowerCase();
    return (!q||hay.includes(q))&&filters.every(([key,value])=>String(item[key]??'')===value);
  });
}
