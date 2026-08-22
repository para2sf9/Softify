import { body, sendJson, sendNoContent, text, array, safeUrl, searchFilter, paginate } from '../utils.js';
import { list, find, create, update, remove, publicItem, publicList } from '../store.js';
import { can } from '../security.js';

export const COLLECTIONS = {
  projects:{permission:'projects:write',required:['name','key','status']},
  requirements:{permission:'requirements:write',required:['projectId','title','type','status']},
  assets:{permission:'assets:write',required:['projectId','title','type','status']},
  testPlans:{permission:'tests:write',required:['projectId','name','status']},
  testCases:{permission:'tests:write',required:['projectId','title','type','status']},
  testRuns:{permission:'tests:write',required:['projectId','name','status']},
  defects:{permission:'defects:write',required:['projectId','title','severity','status']},
  vulnerabilities:{permission:'security:write',required:['projectId','title','severity','status']},
  automationRuns:{permission:'automation:write',required:['projectId','tool','suite','status']},
  environments:{permission:'environments:write',required:['projectId','name','type','health']},
  releases:{permission:'releases:write',required:['projectId','name','version','status']},
  qualityAudits:{permission:'quality:write',required:['projectId','title','type','status']},
  documents:{permission:'documents:write',required:['projectId','title','type','status']},
  tools:{permission:'tools:write',required:['name','category','status']},
  users:{permission:'admin',required:['name','email','role','status'],readOnly:true},
  organizations:{permission:'admin',required:['name','status'],readOnly:true},
  activities:{permission:'read',required:[],readOnly:true}
};

function sanitize(value, depth=0){
 if(depth>4)return undefined;
 if(typeof value==='string')return text(value,3000);
 if(typeof value==='number')return Number.isFinite(value)?value:0;
 if(typeof value==='boolean')return value;
 if(Array.isArray(value))return value.slice(0,100).map(x=>sanitize(x,depth+1)).filter(x=>x!==undefined);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([k])=>!['__proto__','constructor','prototype','passwordHash'].includes(k)).map(([k,v])=>[k,sanitize(v,depth+1)]));
 return value??'';
}
function validate(config,input){
 const errors=[];for(const key of config.required){if(input[key]===undefined||input[key]===null||input[key]==='')errors.push(`${key} is required.`)}
 if(input.url&& !safeUrl(input.url))errors.push('URL must start with http:// or https://.');
 return errors;
}
function enriched(collection,item){
 const users=list('users');const projects=list('projects');
 const out=publicItem(item);
 if(out.ownerId)out.owner=users.find(x=>x.id===out.ownerId)?.name||'Unassigned';
 if(out.assigneeId)out.assignee=users.find(x=>x.id===out.assigneeId)?.name||'Unassigned';
 if(out.reporterId)out.reporter=users.find(x=>x.id===out.reporterId)?.name||'Unknown';
 if(out.projectId)out.project=projects.find(x=>x.id===out.projectId)?.name||'Unknown Project';
 return out;
}
export async function crudRoutes(req,res,url){
 const match=url.pathname.match(/^\/api\/([A-Za-z]+)(?:\/([^/]+))?$/);if(!match)return false;
 const collection=match[1],itemId=match[2];const config=COLLECTIONS[collection];if(!config)return false;
 if(req.method==='GET'&&!itemId){
  let items=searchFilter(list(collection),url.searchParams);
  const sort=url.searchParams.get('sort')||'updatedAt';const direction=url.searchParams.get('direction')==='asc'?1:-1;
  items=[...items].sort((a,b)=>String(a[sort]||'').localeCompare(String(b[sort]||''))*direction);
  const page=paginate(items,url.searchParams);return sendJson(res,200,{...page,items:page.items.map(x=>enriched(collection,x))});
 }
 if(req.method==='GET'&&itemId){const item=find(collection,decodeURIComponent(itemId));return item?sendJson(res,200,{item:enriched(collection,item)}):sendJson(res,404,{error:'Item not found.'});}
 if(config.readOnly)return sendJson(res,405,{error:'This resource is read-only in the current edition.'});
 if(!can(req.auth.role,config.permission))return sendJson(res,403,{error:'You do not have permission to modify this resource.'});
 if(req.method==='POST'&&!itemId){const input=sanitize(await body(req));const errors=validate(config,input);if(errors.length)return sendJson(res,422,{errors});if(input.url)input.url=safeUrl(input.url);const item=await create(collection,input,req.auth);return sendJson(res,201,{item:enriched(collection,item)});}
 if(req.method==='PATCH'&&itemId){const current=find(collection,decodeURIComponent(itemId));if(!current)return sendJson(res,404,{error:'Item not found.'});const input=sanitize(await body(req));const errors=validate(config,{...current,...input});if(errors.length)return sendJson(res,422,{errors});if(input.url)input.url=safeUrl(input.url);const item=await update(collection,current.id,input,req.auth);return sendJson(res,200,{item:enriched(collection,item)});}
 if(req.method==='DELETE'&&itemId){const ok=await remove(collection,decodeURIComponent(itemId),req.auth);return ok?sendNoContent(res):sendJson(res,404,{error:'Item not found.'});}
 return sendJson(res,405,{error:'Method not allowed.'});
}
