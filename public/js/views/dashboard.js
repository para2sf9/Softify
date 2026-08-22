import { api } from '../api.js';import { esc,badge,formatDate,relative,toast } from '../utils.js';
export async function renderDashboard(c){let d;try{d=await api('/api/dashboard')}catch(e){return toast(e.message,'error')}
 const k=d.kpis;const maxTrend=Math.max(...d.trend.map(x=>x.passed+x.failed),1);
 const kpi=(label,value,icon,note,cls='')=>`<article class="kpi-card"><div class="kpi-top"><span class="kpi-label">${esc(label)}</span><span class="kpi-icon">${icon}</span></div><strong class="${cls}">${esc(value)}</strong><small>${esc(note)}</small></article>`;
 c.innerHTML=`<section class="page">
 <header class="page-head"><div><span class="eyebrow">Engineering quality command center</span><h1>Quality Overview</h1><p>Live snapshot across requirements, testing, defects, security and releases.</p></div><div class="head-actions"><a class="button secondary" href="#/reports">View reports</a><a class="button primary" href="#/testRuns">＋ Start test run</a></div></header>
 <div class="kpi-grid">${kpi('Active projects',k.projects,'▦','Portfolio in delivery')}${kpi('Requirement coverage',k.requirementCoverage+'%','⌘',k.requirements+' requirements','positive')}${kpi('Pass rate',k.passRate+'%','✓','Across executed runs',k.passRate>=85?'positive':'warning')}${kpi('Open defects',k.openDefects,'!',k.criticalDefects+' critical',k.criticalDefects?'negative':'')}${kpi('Automation',k.automationCoverage+'%','↯','Coverage of test suite','info')}</div>
 <div class="kpi-grid" style="grid-template-columns:repeat(5,1fr)">${kpi('Test cases',k.testCases,'☷','Design repository')}${kpi('Open vulnerabilities',k.openVulnerabilities,'⬡','Security backlog',k.openVulnerabilities?'warning':'positive')}${kpi('Release readiness',k.releaseReadiness+'%','↑','Weighted across releases',k.releaseReadiness>=80?'positive':'warning')}${kpi('Executed',k.passRate+'%','▶','Latest run pass ratio','info')}${kpi('Requirements',k.requirements,'≡','Baselined scope')}</div>
 <div class="dashboard-grid">
  <div class="surface panel execution-panel"><div class="panel-head"><div><h2>Execution trend</h2><p>Pass vs fail ratio over the last 7 days</p></div><a href="#/testRuns">Executions →</a></div>
   <div class="chart-bars">${d.trend.map(t=>`<div class="bar-group"><div class="bar-pair"><div class="bar passed" style="height:${t.passed/maxTrend*100}%" title="Passed ${t.passed}%"></div><div class="bar failed" style="height:${t.failed/maxTrend*100}%" title="Failed ${t.failed}%"></div></div><span class="bar-label">${esc(t.label)}</span></div>`).join('')}</div>
   <div class="chart-legend"><span>Passed</span><span>Failed</span></div></div>
  <div class="surface panel"><div class="panel-head"><div><h2>Defect severity</h2><p>Open defects by impact</p></div><a href="#/defects">Defects →</a></div>
   <div class="metric-list">${d.defectSeverity.map(s=>`<div class="metric-line"><span>${badge(s.severity)}</span><strong>${s.count}</strong></div>`).join('')}</div>
   <div class="panel-head" style="margin-top:18px"><div><h2>Execution status</h2></div></div>
   <div class="metric-list"><div class="metric-line"><span>Total executed</span><strong>${d.execution.total}</strong></div><div class="metric-line"><span class="positive">Passed</span><strong>${d.execution.passed}</strong></div><div class="metric-line"><span class="negative">Failed</span><strong>${d.execution.failed}</strong></div><div class="metric-line"><span class="warning">Blocked</span><strong>${d.execution.blocked}</strong></div></div></div>
 </div>
 <div class="dashboard-grid" style="margin-top:15px">
  <div class="surface panel"><div class="panel-head"><div><h2>Release quality gates</h2><p>Readiness and gate status per release</p></div><a href="#/releases">Releases →</a></div>
   <div class="gate-list">${d.qualityGates.map(g=>`<div class="gate-row"><div class="gate-top"><strong>${esc(g.name)}</strong>${badge(g.gate)}</div><div class="progress"><i style="width:${g.readiness}%"></i></div><div class="gate-meta"><span>${esc(g.status)} · target ${formatDate(g.targetDate)}</span><span>${g.readiness}% ready</span></div></div>`).join('')}</div></div>
  <div class="surface panel"><div class="panel-head"><div><h2>Recent activity</h2><p>Latest lifecycle events</p></div></div>
   <div class="activity-list">${d.activities.map(a=>`<div class="activity"><span class="activity-icon">${{created:'＋',updated:'✎',deleted:'×',deployed:'☁',executed:'▶',reviewed:'♢'}[a.action]||'•'}</span><p><strong>${esc(a.actor)}</strong> ${esc(a.message)}</p><time>${relative(a.createdAt)}</time></div>`).join('')}</div></div>
 </div></section>`;
}
