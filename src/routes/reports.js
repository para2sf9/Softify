import { sendJson } from '../utils.js';
import { list } from '../store.js';

const pct=(a,b)=>b?Math.round(a/b*1000)/10:0;
export async function reportRoutes(req,res,url){
 if(req.method==='GET'&&url.pathname==='/api/reports/summary'){
  const runs=list('testRuns'), defects=list('defects'), reqs=list('requirements'), cases=list('testCases'), vulns=list('vulnerabilities');
  const ex=runs.reduce((a,r)=>{a.total+=r.total;a.passed+=r.passed;a.failed+=r.failed;a.blocked+=r.blocked;return a},{total:0,passed:0,failed:0,blocked:0});
  const covered=new Set(cases.flatMap(x=>x.requirementIds||[]));
  return sendJson(res,200,{generatedAt:new Date().toISOString(),metrics:{testExecution:ex,passRate:pct(ex.passed,ex.total),requirementCoverage:pct(covered.size,reqs.length),automationCoverage:pct(cases.filter(x=>x.automationStatus==='Automated').length,cases.length),defectDensity:pct(defects.length,cases.length),openCriticalDefects:defects.filter(x=>x.severity==='Critical'&&!['Closed','Rejected'].includes(x.status)).length,openHighVulnerabilities:vulns.filter(x=>['Critical','High'].includes(x.severity)&&!['Closed','Verified'].includes(x.status)).length},releases:list('releases'),audits:list('qualityAudits')});
 }
 if(req.method==='GET'&&url.pathname==='/api/reports/export'){
  const collection=url.searchParams.get('collection')||'testCases'; const allowed=['requirements','testCases','defects','vulnerabilities','assets','testRuns','automationRuns','releases'];
  if(!allowed.includes(collection)) return sendJson(res,400,{error:'Collection cannot be exported.'});
  const data=list(collection); const keys=[...new Set(data.flatMap(Object.keys))];
  const cell=v=>`"${String(Array.isArray(v)?v.join(' | '):(v??'')).replaceAll('"','""')}"`;
  const csv=[keys.map(cell).join(','),...data.map(row=>keys.map(k=>cell(row[k])).join(','))].join('\n');
  res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="softify-${collection}.csv"`,'X-Content-Type-Options':'nosniff'});return res.end(csv);
 }
 return false;
}
