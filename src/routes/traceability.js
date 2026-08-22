import { sendJson } from '../utils.js';
import { list } from '../store.js';
export async function traceabilityRoutes(req,res,url){
 if(req.method==='GET'&&url.pathname==='/api/traceability'){
  const rows=list('requirements').map(r=>{
   const cases=list('testCases').filter(t=>(t.requirementIds||[]).includes(r.id)); const caseIds=new Set(cases.map(x=>x.id));
   const defects=list('defects').filter(d=>(d.requirementIds||[]).includes(r.id)||caseIds.has(d.testCaseId));
   return {requirement:r,testCases:cases,defects,covered:cases.length>0,passed:cases.some(t=>t.status==='Passed')||list('testRuns').some(run=>run.projectId===r.projectId&&run.passed>0)};
  });
  return sendJson(res,200,{rows,summary:{total:rows.length,covered:rows.filter(x=>x.covered).length,uncovered:rows.filter(x=>!x.covered).length}});
 }
 return false;
}
