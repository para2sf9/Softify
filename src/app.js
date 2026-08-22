import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { PUBLIC_DIR, MIME_TYPES } from './config.js';
import { securityHeaders } from './security.js';
import { sendJson } from './utils.js';
import { routeApi } from './router.js';

async function staticFile(req,res,url){
 const requested=url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname);let safe=path.normalize(requested).replace(/^(\.\.[/\\])+/, '');let file=path.join(PUBLIC_DIR,safe);
 if(!file.startsWith(PUBLIC_DIR))return sendJson(res,403,{error:'Forbidden.'});
 try{const s=await stat(file);if(!s.isFile())throw Object.assign(new Error(),{code:'ENOENT'});}catch(e){if(e.code==='ENOENT'&&!path.extname(url.pathname))file=path.join(PUBLIC_DIR,'index.html');else if(e.code==='ENOENT')return sendJson(res,404,{error:'File not found.'});else throw e;}
 const ext=path.extname(file).toLowerCase();const headers=securityHeaders(MIME_TYPES[ext]||'application/octet-stream');headers['Cache-Control']=ext==='.html'?'no-cache':'public, max-age=3600';res.writeHead(200,headers);if(req.method==='HEAD')return res.end();createReadStream(file).pipe(res);
}
export async function app(req,res){
 try{const url=new URL(req.url,`http://${req.headers.host||'localhost'}`);if(url.pathname.startsWith('/api/'))return await routeApi(req,res,url);if(!['GET','HEAD'].includes(req.method))return sendJson(res,405,{error:'Method not allowed.'});return await staticFile(req,res,url);}catch(error){console.error(error);if(!res.headersSent)return sendJson(res,error.statusCode||500,{error:error.statusCode?error.message:'Internal server error.'});res.end();}
}
