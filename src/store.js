import { mkdir, readFile, writeFile, rename } from 'node:fs/promises';
import { DATA_DIR, DB_FILE } from './config.js';
import { buildSeed } from './seed-data.js';
import { id, now } from './utils.js';

let db = null;
let queue = Promise.resolve();
const hiddenFields = new Set(['passwordHash']);

export async function initStore(force=false) {
  await mkdir(DATA_DIR,{recursive:true});
  if (!force) {
    try { db=JSON.parse(await readFile(DB_FILE,'utf8')); return db; } catch (e) { if(e.code!=='ENOENT') throw e; }
  }
  db=buildSeed(); await persist(); return db;
}

async function persist() {
  const temp=`${DB_FILE}.tmp`;
  queue=queue.then(async()=>{ db.meta.updatedAt=now(); await writeFile(temp,JSON.stringify(db,null,2)+'\n','utf8'); await rename(temp,DB_FILE); });
  return queue;
}

export function getDb(){ if(!db) throw new Error('Store not initialized.'); return db; }
export function list(collection){ const value=getDb()[collection]; if(!Array.isArray(value)) throw Object.assign(new Error('Unknown resource.'),{statusCode:404}); return value; }
export function find(collection, itemId){ return list(collection).find(x=>x.id===itemId); }
export function publicItem(item){ if(!item) return item; return Object.fromEntries(Object.entries(item).filter(([k])=>!hiddenFields.has(k))); }
export function publicList(items){ return items.map(publicItem); }
export async function create(collection, input, actor){
 const item={ id: input.id || id(collection.slice(0,3).toUpperCase()), ...input, createdAt:now(), updatedAt:now() }; list(collection).push(item); await audit(actor,'created',collection,item.id,`Created ${item.title||item.name||item.id}`); await persist(); return item;
}
export async function update(collection,itemId,input,actor){
 const items=list(collection); const index=items.findIndex(x=>x.id===itemId); if(index<0) return null;
 const immutable=['id','createdAt','passwordHash']; const clean=Object.fromEntries(Object.entries(input).filter(([k])=>!immutable.includes(k)));
 items[index]={...items[index],...clean,updatedAt:now()}; await audit(actor,'updated',collection,itemId,`Updated ${items[index].title||items[index].name||itemId}`); await persist(); return items[index];
}
export async function remove(collection,itemId,actor){
 const items=list(collection); const index=items.findIndex(x=>x.id===itemId); if(index<0) return false; const [old]=items.splice(index,1); await audit(actor,'deleted',collection,itemId,`Deleted ${old.title||old.name||itemId}`); await persist(); return true;
}
export async function audit(actor,action,entity,entityId,message){
 if(entity==='activities') return;
 list('activities').unshift({id:id('ACT'),actorId:actor?.sub||actor?.id||'SYSTEM',action,entity,entityId,message,createdAt:now()});
 if(list('activities').length>300) list('activities').length=300;
}
export { persist };
