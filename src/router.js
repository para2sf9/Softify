import { sendJson } from './utils.js';
import { verifyToken } from './security.js';
import { find } from './store.js';
import { authRoutes } from './routes/auth.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { reportRoutes } from './routes/reports.js';
import { traceabilityRoutes } from './routes/traceability.js';
import { aiRoutes } from './routes/ai.js';
import { crudRoutes, COLLECTIONS } from './routes/crud.js';

const loginAttempts=new Map();
function auth(req){const value=req.headers.authorization||'';return verifyToken(value.startsWith('Bearer ')?value.slice(7):'');}
function rateLimit(req,res,url){
 if(url.pathname!=='/api/auth/login')return false;const key=req.socket.remoteAddress||'local';const t=Date.now();const entry=loginAttempts.get(key)||{count:0,reset:t+60000};if(t>entry.reset){entry.count=0;entry.reset=t+60000}entry.count++;loginAttempts.set(key,entry);if(entry.count>20){sendJson(res,429,{error:'Too many login attempts. Try again shortly.'},{'Retry-After':'60'});return true}return false;
}
export async function routeApi(req,res,url){
 if(rateLimit(req,res,url))return;
 if(req.method==='GET'&&url.pathname==='/api/health')return sendJson(res,200,{status:'ok',service:'Softify',time:new Date().toISOString()});
 if(req.method==='GET'&&url.pathname==='/api/meta')return sendJson(res,200,{name:'Softify',version:'2.0.0',modules:Object.keys(COLLECTIONS)});
 if(req.method==='POST'&&url.pathname==='/api/auth/login')return authRoutes(req,res,url);
 const claims=auth(req);if(!claims)return sendJson(res,401,{error:'Authentication required.'});
 const user=find('users',claims.sub);if(!user||user.status!=='Active')return sendJson(res,401,{error:'User is not active.'});req.auth=claims;req.userRecord=user;
 for(const handler of [authRoutes,dashboardRoutes,reportRoutes,traceabilityRoutes,aiRoutes,crudRoutes]){const handled=await handler(req,res,url);if(handled!==false)return handled;}
 return sendJson(res,404,{error:'API endpoint not found.'});
}
