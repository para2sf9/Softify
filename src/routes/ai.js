import { body, sendJson, text } from '../utils.js';
function titleCase(s){return s.replace(/\b\w/g,x=>x.toUpperCase())}
export async function aiRoutes(req,res,url){
 if(req.method==='POST'&&url.pathname==='/api/ai/generate-tests'){
  const input=await body(req);const requirement=text(input.requirement,1000);if(!requirement)return sendJson(res,422,{error:'Requirement text is required.'});
  const subject=text(requirement.replace(/\.$/,''),90);
  const generated=[
   ['Positive','Validate successful flow with valid data',`The system satisfies: ${subject}`],
   ['Negative','Reject invalid or malformed input','Clear validation is shown and no invalid change is persisted'],
   ['Boundary','Validate minimum and maximum supported values','Boundary values are handled according to the requirement'],
   ['Security','Attempt injection, authorization bypass, and unsafe input','Requests are safely rejected, logged, and reveal no sensitive data'],
   ['Accessibility','Complete the flow using keyboard and assistive semantics','The flow is operable, perceivable, and understandable'],
   ['Performance','Execute the flow under expected peak load','Latency, throughput, and error-rate targets are met'],
   ['Compatibility','Run on the supported browser/device matrix','Behavior and presentation remain consistent'],
   ['Recovery','Interrupt and retry the operation','The system recovers without duplicate or corrupt data']
  ].map((x,i)=>({id:`AI-TC-${String(i+1).padStart(3,'0')}`,title:`${x[0]}: ${titleCase(x[1])}`,type:x[0],priority:['Security','Positive'].includes(x[0])?'High':'Medium',steps:[`Prepare data for: ${subject}`,x[1],'Capture result and evidence'],expectedResult:x[2]}));
  return sendJson(res,200,{requirement,generated,notice:'Rule-assisted draft generation for review; no external AI service is called in this local edition.'});
 }
 if(req.method==='POST'&&url.pathname==='/api/ai/analyze-defect'){
  const input=await body(req);const description=text(input.description,1500);if(!description)return sendJson(res,422,{error:'Defect description is required.'});
  const lower=description.toLowerCase();let area='Application logic',suggestions=['Reproduce with controlled data','Compare application and service logs','Identify the first failing component'];
  if(/slow|latency|timeout|performance/.test(lower)){area='Performance / dependency bottleneck';suggestions=['Review P95/P99 by endpoint','Correlate database and downstream latency','Compare resource saturation during the failure'];}
  else if(/permission|unauthor|token|login|security/.test(lower)){area='Authentication / authorization';suggestions=['Validate identity and role claims','Review authorization at API and data layers','Check token expiry, audience, and scope'];}
  else if(/duplicate|twice|retry/.test(lower)){area='Idempotency / concurrency';suggestions=['Inspect retry behavior and idempotency keys','Review transaction boundaries','Reproduce with concurrent requests'];}
  return sendJson(res,200,{probableArea:area,suggestions,regressionScope:['Primary affected flow','Adjacent negative scenarios','API contract and audit evidence'],confidence:'Advisory'});
 }
 return false;
}
