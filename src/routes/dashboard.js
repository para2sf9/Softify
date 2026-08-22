import { sendJson } from '../utils.js';
import { list, publicList } from '../store.js';

const percent=(a,b)=>b?Math.round(a/b*100):0;
export async function dashboardRoutes(req,res,url){
 if(req.method==='GET'&&url.pathname==='/api/dashboard'){
  const testRuns=list('testRuns'), defects=list('defects'), vulns=list('vulnerabilities'), reqs=list('requirements'), tests=list('testCases'), projects=list('projects'), releases=list('releases');
  const totals=testRuns.reduce((a,r)=>({total:a.total+r.total,passed:a.passed+r.passed,failed:a.failed+r.failed,blocked:a.blocked+r.blocked,notExecuted:a.notExecuted+r.notExecuted}),{total:0,passed:0,failed:0,blocked:0,notExecuted:0});
  const covered=new Set(tests.flatMap(x=>x.requirementIds||[]));
  const openDefects=defects.filter(x=>!['Closed','Rejected','Duplicate','Won\'t Fix'].includes(x.status));
  const openVulns=vulns.filter(x=>!['Closed','Verified','Accepted'].includes(x.status));
  const automation=percent(tests.filter(x=>x.automationStatus==='Automated').length,tests.length);
  const trend=[
   {label:'Aug 16',passed:58,failed:12},{label:'Aug 17',passed:64,failed:10},{label:'Aug 18',passed:68,failed:9},{label:'Aug 19',passed:71,failed:11},{label:'Aug 20',passed:75,failed:8},{label:'Aug 21',passed:79,failed:7},{label:'Aug 22',passed:percent(totals.passed,totals.total),failed:percent(totals.failed,totals.total)}
  ];
  return sendJson(res,200,{
   kpis:{projects:projects.length,requirements:reqs.length,requirementCoverage:percent(covered.size,reqs.length),testCases:tests.length,passRate:percent(totals.passed,totals.total),openDefects:openDefects.length,criticalDefects:openDefects.filter(x=>x.severity==='Critical').length,openVulnerabilities:openVulns.length,automationCoverage:automation,releaseReadiness:Math.round(releases.reduce((a,x)=>a+x.readiness,0)/(releases.length||1))},
   execution:totals,trend,
   defectSeverity:['Critical','High','Medium','Low'].map(severity=>({severity,count:openDefects.filter(x=>x.severity===severity).length})),
   qualityGates:releases.map(x=>({id:x.id,name:x.name,gate:x.qualityGate,readiness:x.readiness,status:x.status,targetDate:x.targetDate})),
   projects:projects.map(x=>({...x,owner:list('users').find(u=>u.id===x.ownerId)?.name||'Unassigned'})),
   activities:publicList(list('activities').slice(0,10)).map(x=>({...x,actor:list('users').find(u=>u.id===x.actorId)?.name||'System'}))
  });
 }
 return false;
}
