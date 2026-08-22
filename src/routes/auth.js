import { body, sendJson, text } from '../utils.js';
import { list, publicItem } from '../store.js';
import { signToken, verifyPassword } from '../security.js';

export async function authRoutes(req,res,url) {
  if(req.method==='POST'&&url.pathname==='/api/auth/login') {
    const input=await body(req); const email=text(input.email,160).toLowerCase(); const password=String(input.password||'');
    const user=list('users').find(x=>x.email.toLowerCase()===email&&x.status==='Active');
    if(!user||!verifyPassword(password,user.passwordHash)) return sendJson(res,401,{error:'Invalid email or password.'});
    return sendJson(res,200,{token:signToken(user),user:publicItem(user)});
  }
  if(req.method==='GET'&&url.pathname==='/api/auth/me') return sendJson(res,200,{user:publicItem(req.userRecord)});
  return false;
}
