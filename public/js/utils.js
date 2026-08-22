export const esc=(v='')=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));
export const slug=(v='')=>String(v).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const initials=(v='')=>String(v).split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase()||'?';
export function formatDate(v,withTime=false){if(!v)return '—';const d=new Date(v);if(Number.isNaN(d.valueOf()))return esc(v);return new Intl.DateTimeFormat(undefined,withTime?{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}:{month:'short',day:'numeric',year:d.getFullYear()!==2026?'numeric':undefined}).format(d)}
export const pct=(a,b)=>b?Math.round(a/b*100):0;
export function relative(v){if(!v)return '—';const sec=Math.round((Date.now()-new Date(v))/1000);if(Math.abs(sec)<60)return 'just now';const units=[[31536000,'year'],[2592000,'month'],[86400,'day'],[3600,'hour'],[60,'minute']];for(const [n,name] of units){if(Math.abs(sec)>=n){const q=Math.floor(Math.abs(sec)/n);return `${q} ${name}${q>1?'s':''} ${sec>=0?'ago':'from now'}`}}return 'just now'}
export function toast(message,type='success'){const r=document.querySelector('#toastRegion');const n=document.createElement('div');n.className=`toast ${type}`;n.textContent=message;r.append(n);setTimeout(()=>n.remove(),3500)}
export function badge(value){return `<span class="badge ${slug(value)}">${esc(value||'—')}</span>`}
export function chips(values=[]){return (values||[]).slice(0,4).map(x=>`<span class="plain-chip">${esc(x)}</span>`).join('')}
export function downloadBlob(content,name,type='text/plain'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
export const debounce=(fn,ms=250)=>{let t;return(...args)=>{clearTimeout(t);t=setTimeout(()=>fn(...args),ms)}};
