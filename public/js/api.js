const TOKEN_KEY='softify-token';
export const session={
 get token(){return localStorage.getItem(TOKEN_KEY)||''},set token(v){v?localStorage.setItem(TOKEN_KEY,v):localStorage.removeItem(TOKEN_KEY)},user:null
};
export async function api(path,options={}){
 const headers={...(options.body?{'Content-Type':'application/json'}:{}),...(session.token?{Authorization:`Bearer ${session.token}`}:{}) ,...(options.headers||{})};
 const response=await fetch(path,{...options,headers});
 if(response.status===204)return null;
 if(response.headers.get('content-type')?.includes('text/csv'))return response;
 const data=await response.json().catch(()=>({}));
 if(response.status===401&&path!=='/api/auth/login'){session.token='';window.dispatchEvent(new CustomEvent('auth-expired'));}
 if(!response.ok)throw new Error(data.errors?.join(' ')||data.error||'Request failed.');return data;
}
export async function login(email,password){const data=await api('/api/auth/login',{method:'POST',body:JSON.stringify({email,password})});session.token=data.token;session.user=data.user;return data.user}
export async function me(){const data=await api('/api/auth/me');session.user=data.user;return data.user}
export function logout(){session.token='';session.user=null}
