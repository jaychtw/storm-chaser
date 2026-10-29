import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';
import {copy,readLocale,formatTime,type Locale} from './i18n';
import {availableStorms,parseScenario,fixtureIssuedAt,type Track} from './fixtures';
import {StormMap} from './map';
import {liveView,escapeHTML as E,type MapStorm} from './live';
import {resolveFocus} from './focus';
import {ForecastExplorer} from './explorer';
import {selectPublishedPoint,type PointSelection} from './point-selection';
import {isLiveSnapshot} from './snapshot-contract';
import {nativeLabel,reportedValue,reportedDirection} from './data-labels';
import {eligibility,advisoryStale,EXPIRE_MS} from '../shared/eligibility';
import type {LiveSnapshot,Position,Value} from '../shared/model';

let storage:Storage|undefined;try{storage=localStorage;}catch{}
let locale:Locale=readLocale(storage);
const params=new URLSearchParams(location.search);
const pages=import.meta.env.STORM_PAGES==='1';
let demo=!pages&&params.get('mode')==='demo',scenario=parseScenario(params.get('scenario'));
let snapshot:LiveSnapshot|null=null,clientError=false,clientInvalid=false,manual=false,selectedId:string|null=null,statusOpen=false,mapFailed=false;
let point:PointSelection|null=null,pointLost=false;
const tracks=new Set<Track>(['A','B']);
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<a class="skip-link" href="#workspace"></a><div id="header"></div><main id="workspace" tabindex="-1"><section id="intro"></section><div class="command-grid"><aside id="storm-rail"></aside><section class="map-column"><div id="map-heading"></div><div class="map-frame"><div id="map"></div><div id="map-overlay"></div><div id="map-meta"></div></div><div id="map-tools"></div><section id="explorer" aria-label="Forecast-Time Explorer"></section><section id="detail"></section></section><aside id="sources"></aside></div><section id="coverage"></section></main><footer id="footer"></footer><div class="sr-only" id="announcements" aria-live="polite"></div>`;
const el=(id:string)=>document.getElementById(id)!;
const time=(v:string)=>formatTime(v,locale);
const explorer=new ForecastExplorer(el('explorer'));
const links={CWA:'https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html',JMA:'https://www.jma.go.jp/bosai/map.html#contents=typhoon',JTWC:'https://www.metoc.navy.mil/jtwc/jtwc.html'};
let map:StormMap|undefined,detailOpen=!matchMedia('(max-width:640px)').matches,nativeOpen=false;
let lastSignature='';
function currentView(now=Date.now()) {
 const view=liveView(snapshot,clientError,now);
 const storms:MapStorm[]=demo?availableStorms(scenario):view.storms;
 const focus=resolveFocus(storms,{manual,selectedId});
 // Authored demo focus is separate from the live uncertainty contract.
 const selected=demo&&!manual?storms[0]??null:focus.selected;
 return {...view,storms,selected,focus};
}
function focusKey():string|null {
 const active=document.activeElement as HTMLElement|null;
 if(!active||active===document.body)return null;
 if(active.id)return `#${CSS.escape(active.id)}`;
 for(const key of ['data-storm','data-track','data-map-storm','data-map-point','data-forecast-time']) {
  const value=active.getAttribute(key);if(value!==null)return `[${key}="${CSS.escape(value)}"]`;
 }
 return null;
}
function restoreFocus(key:string|null) {
 if(!key)return;
 const target=document.querySelector<HTMLElement>(key)??document.querySelector<HTMLElement>('#selection-notice')??document.querySelector<HTMLElement>('#detail-summary')??el('auto');
 if(target.matches(':disabled'))document.querySelector<HTMLElement>('#explorer-range')?.focus({preventScroll:true});
 else if(document.activeElement!==target)target.focus({preventScroll:true});
}
function values(xs:Value[]|undefined) {
 return xs?.length?xs.map(v=>E(reportedValue(v,locale))).join('<br>'):copy[locale].noValue;
}
function motion(p:Position|undefined) {
 const t=copy[locale];
 return `<dl class="motion"><div><dt>${t.motionDirection}</dt><dd>${E(reportedDirection(p?.direction,locale))}</dd></div><div><dt>${t.motionSpeed}</dt><dd>${values(p?.motion)}</dd></div></dl>`;
}
function render(force=false) {
 const now=Date.now(),v=currentView(now),{storms,selected,state}=v;
 const a=selected?.advisory,t=copy[locale];
 if(point&&(!selected||point.stormId!==selected.id||!tracks.has(point.track)||(!demo&&!selected.forecastTimes?.includes(point.validAt)))){point=null;pointLost=true;}
 const signature=JSON.stringify([demo,scenario,locale,manual,selectedId,statusOpen,mapFailed,clientError,clientInvalid,snapshot,storms.map(s=>s.forecastTimes),state,v.expiredCount,point,pointLost,detailOpen,nativeOpen]);
 if(!force&&signature===lastSignature)return;
 lastSignature=signature;
 const focused=focusKey();
 const label=demo?t.synthetic:state==='fresh'?t.fresh:state==='stale'?t.staleLive:state==='unavailable'?t.unavailableLive:t.unknownLive;
 const cycle=demo?fixtureIssuedAt:a?.issuedAt;
 const selectionGone=!demo&&manual&&!selected;
 const rationale=selectionGone?t.selectionLost:manual?t.whyManual:demo?selected?t.whyAuto:t.uncertain:t.neutralBody;
 const collectionExplanation=clientInvalid?t.apiInvalid:clientError?t.apiFailed:!snapshot||snapshot.health.state==='unknown'?t.awaiting:snapshot.health.error==='collection-failed'?t.collectionFailed:snapshot.health.partial?t.collectionPartial:state==='fresh'?t.collectionOK:!snapshot.advisories.length?t.collectionUnknown:t.liveStaleBody;
 document.documentElement.lang=locale;document.title=`Storm Chaser · ${t.region}`;
 app.querySelector('.skip-link')!.textContent=locale==='en'?'Skip to workspace':'跳至主要內容';
 el('header').innerHTML=`<header class="topbar"><a class="brand" href="${import.meta.env.BASE_URL}" aria-label="Storm Chaser"><span class="brand-mark" aria-hidden="true">◉</span><span>STORM CHASER<small>${t.region}</small></span></a><div class="header-status"><span class="status-dot"></span>${demo?t.demo:t.live}<span class="header-divider">/</span>${label}</div><div class="header-actions"><label class="sr-only" for="data-mode">${t.mode}</label><select id="data-mode"><option value="live">${t.liveMode}</option><option value="demo">${t.demoMode}</option></select><button id="status-button" class="quiet" aria-expanded="${statusOpen}" aria-controls="coverage">${t.status} ↗</button><button id="language" class="language" aria-label="${locale==='en'?'切換至繁體中文':'Switch to English'}">${locale==='en'?'繁體中文':'ENGLISH'}</button></div></header><div class="demo-band ${demo?'':'live-band'}"><span>${demo?t.demoNote:t.liveNote}</span><span>${demo?t.fixtureTime:t.cycleInfo} · ${cycle?time(cycle):t.selectForCycle}</span></div>`;
 el('intro').innerHTML=`<div><div class="eyebrow">01 <span>/</span> ${t.theater}</div><h1>${t.title}</h1><p>${t.subtitle}</p></div><div class="region-stamp"><span class="crosshair" aria-hidden="true">⌖</span><div><small>${t.focus} · ${t.taiwan}</small><strong>24° N <span>/</span> 121° E</strong></div></div>`;
 el('storm-rail').innerHTML=`<div class="section-heading"><h2>${t.systems}</h2><span class="count">${String(storms.length).padStart(2,'0')}</span></div><div class="focus-control"><span>${t.focus}</span><button id="auto" aria-pressed="${!manual}">${t.auto}</button><span class="mode">${manual?t.manual:''}</span></div><div class="storm-list">${storms.map(s=>`<button class="storm-card ${selected?.id===s.id?'is-selected':''}" data-storm="${E(s.id)}" aria-pressed="${selected?.id===s.id}"><span class="storm-index">${demo?t.synthetic:'JMA'} <span>${!demo&&advisoryStale(s.advisory!,now)?t.staleLive:''}</span></span><span class="storm-title"><span aria-hidden="true">◉</span> ${E(s.name)}<span class="arrow" aria-hidden="true">↗</span></span><span class="storm-sub">${demo?t.stormType:s.advisory?.nativeClass?E(nativeLabel(s.advisory.nativeClass,locale)):t.currentUnknown}</span><span class="coords">${Math.abs(s.position[1]).toFixed(1)}° ${s.position[1]>=0?'N':'S'} / ${Math.abs(s.position[0]).toFixed(1)}° ${s.position[0]>=0?'E':'W'}</span>${s.advisory?`<span class="storm-issue">${t.issued}: ${time(s.advisory.issuedAt)}</span>`:''}</button>`).join('')||`<div class="empty-rail">${t.emptyFocus}</div>`}</div><div class="rationale"><span class="eyebrow">${!manual&&!demo?t.neutralTitle:t.why}</span><p>${rationale}</p><small>${t.notHazard}</small></div>${demo?`<div class="scenario-control"><label for="scenario">${t.scenario}</label><select id="scenario"><option value="multi">${t.multi}</option><option value="empty">${t.empty}</option><option value="outage">${t.outage}</option></select></div>`:''}`;
 el('map-heading').innerHTML=`<div class="map-heading"><h2>${t.basin}</h2><span class="map-tag" data-health="${demo?'demo':state}">${label}</span></div>`;
 const emptyTitle=demo?t.emptyTitle:state==='unknown'?t.unknownLive:state==='unavailable'?t.unavailableLive:t.liveEmpty;
 const emptyBody=demo?t.emptyBody:state==='unknown'?t.awaiting:t.liveEmptyBody;
 el('map-overlay').innerHTML=`${!storms.length?`<div class="map-state" role="status"><span class="state-icon" aria-hidden="true">◎</span><h3>${emptyTitle}</h3><p>${emptyBody}</p></div>`:''}${(demo&&scenario==='outage')||(!demo&&storms.length&&state!=='fresh')?`<div class="outage-banner" role="status"><strong>${demo?t.outageTitle:t.staleEligible}</strong><p>${demo?t.outageBody:collectionExplanation}</p></div>`:''}${mapFailed?`<div class="map-error" role="status">${t.mapFallback}</div>`:''}`;
 el('map-meta').innerHTML=`<span class="geography">${t.geography}</span><button id="reset" class="map-reset">⌖ ${t.reset}</button>`;
 const visibleTracks:Track[]=demo?['A','B']:['A'];
 el('map-tools').innerHTML=`${!demo?`<div class="focus-overview"><strong>${manual?t.manual:t.neutralTitle}</strong><p>${rationale}</p></div>`:''}<div class="layer-toolbar" role="group" aria-label="${demo?t.layers:t.liveTracks}"><span class="layer-label">${t.legend}</span><span class="center-legend">● ${demo?t.observed:t.officialObservation}</span>${visibleTracks.map(track=>`<label class="track-toggle"><input type="checkbox" data-track="${track}" ${tracks.has(track)?'checked':''}><span class="line-key key-${track}"></span>${demo?track==='A'?t.trackA:t.trackB:t.liveTracks}</label>`).join('')}</div><p class="map-note">${demo?t.tracksNote:t.liveTrackNote}</p><p class="map-note">${t.pointHint}</p>${!demo?`<p class="map-note datum-notice">${t.datumNotice}</p>${v.expiredCount?`<div class="expiry-notice" role="status"><p>${t.expiryNotice}</p>${v.excluded.filter(record=>['source-expired','age-expired'].includes(eligibility(record,now))).map(record=>`<p>${E(record.name)} · ${eligibility(record,now)==='source-expired'?t.sourceExpired:t.ageExpired} · ${t.issued}: ${time(record.issuedAt)}</p>`).join('')}</div>`:''}`:''}<a id="source-jump" class="source-jump" href="#sources">${t.sourceStations} ↓</a>`;
 const observed=a?.points.find(p=>p.kind==='analysis');
 const forecastPoint=a?.points.find(p=>p.kind==='forecast'&&p.validAt===point?.validAt);
 const forecastList=a&&selected?`<div class="forecast-list" role="group" aria-label="${t.forecastList}"><p>${t.forecastList}</p>${selected.forecastTimes?.map((validAt,i)=>`<button data-forecast-time="${validAt}" ${tracks.has('A')?'':'disabled'}>${time(validAt)} · +${selected.forecastLeads?.[i]} ${t.hours}</button>`).join('')}</div>`:'';
 const nativeTerms=observed?[a?.nativeClass,...observed.winds.flatMap(x=>[x.type,x.unit,x.condition,x.description]),...observed.pressure.flatMap(x=>[x.type,x.unit,x.description]),...observed.motion.flatMap(x=>[x.type,x.unit,x.condition,x.description]),observed.direction?.value,observed.direction?.unit,observed.direction?.condition,observed.direction?.description].filter(Boolean):[];
 el('detail').innerHTML=selected?`<details class="detail-disclosure" ${detailOpen?'open':''}><summary id="detail-summary">${t.details} · ${E(selected.name)}</summary><div class="detail-heading"><div><span class="eyebrow">${t.selected}</span><h2>${E(selected.name)} <small>${demo?t.synthetic:'JMA'}</small></h2></div><span class="detail-cycle">${demo?t.fixtureTime:t.issued}<br>${cycle?time(cycle):t.noValue}</span></div><dl class="metrics"><div><dt>${demo?t.position:t.officialObservation}</dt><dd>${Math.abs(selected.position[1])}° ${selected.position[1]>=0?'N':'S'} / ${Math.abs(selected.position[0])}° ${selected.position[0]>=0?'E':'W'}<br>${observed?time(observed.validAt):''}</dd></div><div><dt>${t.wind} / ${t.pressure}</dt><dd>${demo?t.unreported:values(observed?.winds)+'<br>'+values(observed?.pressure)}</dd></div></dl>${a?`${forecastList}${motion(observed)}<p class="map-note">${t.averaging}</p><p class="map-note datum-notice">${t.datumNotice}</p><dl class="source-times"><div><dt>${t.control}</dt><dd>${time(a.controlAt)}</dd></div><div><dt>${t.retrieved}</dt><dd>${time(a.retrievedAt)}</dd></div>${a.validUntil?`<div><dt>${t.explicitValidity}</dt><dd>${time(a.validUntil)}</dd></div>`:''}<div><dt>${t.localValidity}</dt><dd>${time(new Date(Date.parse(a.issuedAt)+EXPIRE_MS).toISOString())}</dd></div></dl><details id="native-terms" ${nativeOpen?'open':''}><summary id="native-summary">${t.sourceNative}</summary><p>${[...new Set(nativeTerms)].map(x=>E(x!)).join(' · ')}</p></details><a id="bulletin-link" class="source-link" target="_blank" rel="noopener noreferrer" href="${E(a.sourceUrl)}">${t.liveSourceLabel} ↗</a><p class="map-note">${t.editNotice}</p>`:''}<p class="no-warning">${t.noWarnings}</p>${point?`<div class="point-detail" role="status"><strong>${t.info} · ${demo?point.track==='A'?t.trackA:t.trackB:t.officialForecast}</strong><p>${t.valid}: ${time(point.validAt)} · +${point.lead} ${t.hours}</p>${forecastPoint?`${motion(forecastPoint)}<p>${values(forecastPoint.winds)}<br>${values(forecastPoint.pressure)}</p>`:''}<button id="close-point">${t.close}</button></div>`:''}${pointLost?`<p id="point-lost" role="status">${t.pointLost}</p>`:''}</details>`:!demo&&!manual&&storms.length?'':`<div class="empty-detail" ${selectionGone?'id="selection-notice" tabindex="-1" role="status"':''}><h2>${selectionGone?t.emptyFocus:!demo?t.neutralTitle:t.emptyFocus}</h2><p>${selectionGone?t.selectionLost:!demo&&storms.length?t.neutralBody:emptyBody}</p></div>`;
 el('sources').innerHTML=`<div class="section-heading"><h2 tabindex="-1" id="source-heading">${t.sourceStations}</h2><span class="station-icon" aria-hidden="true">⌁</span></div><p class="station-intro">${t.sourceNote}</p>${(['JMA','CWA','JTWC'] as const).map((agency,i)=>{
  const active=!demo&&agency==='JMA';
  const explanation=active?collectionExplanation:demo?t.sourceGap:agency==='CWA'?t.cwaPending:t.jtwcPending;
  return `<article class="source-card" data-source="${agency}"><header><span class="agency-number">0${i+1}</span><h3>${agency}</h3><span class="unverified-dot" aria-hidden="true"></span></header><p class="agency-name">${t[agency.toLowerCase() as 'jma'|'cwa'|'jtwc']}</p><div class="chart-placeholder"><span aria-hidden="true">↗</span><small>${t.chart}</small><p>${t.linkOnly}</p></div><span class="source-state">${active?t.integrated:t.unverified}</span><p class="source-gap">${explanation}</p>${active&&snapshot?.health.partial&&collectionExplanation!==t.collectionPartial?`<p class="source-gap">${t.collectionPartial}</p>`:''}${active?`<p class="source-state">${t.collectionState}: ${label}</p>`:''}<div class="source-timing">${active&&a?`${t.issued}: ${time(a.issuedAt)}<br>${t.analysisTime}: ${time(a.analysisAt)}<br>${t.control}: ${time(a.controlAt)}<br>${t.retrieved}: ${time(a.retrievedAt)}<br>`:active?`${t.selectForCycle}<br>`:''}${active&&snapshot?.health.lastCheckedAt?`${t.lastCheck}: ${time(snapshot.health.lastCheckedAt)}`:t.noCheck}<br>${active&&snapshot?.health.lastSuccessAt?`${t.lastSuccess}: ${time(snapshot.health.lastSuccessAt)}`:t.sourceTime}</div><a id="source-${agency}" class="source-link" href="${links[agency]}" target="_blank" rel="noopener noreferrer" aria-label="${agency} · ${t.openSource} (${t.external})">${t.openSource}<span aria-hidden="true">↗</span></a></article>`;
 }).join('')}`;
 el('coverage').innerHTML=`<div class="coverage-bar"><span class="eyebrow">${t.evidence}</span><strong>${demo?t.coverage:t.liveCoverage}</strong><button id="coverage-toggle" aria-expanded="${statusOpen}" aria-controls="coverage-body">${t.statusTitle} ${statusOpen?'−':'+'}</button></div><div id="coverage-body" ${statusOpen?'':'hidden'}><p>${demo?t.statusBody:t.liveStatusBody}</p>${!demo?`<p>${t.datumNotice}</p><p>${t.archiveNotice}</p>${snapshot?`<p>${t.lastResponse}: ${time(snapshot.asOf)}</p><p>${t.expired}: ${v.expiredCount} · ${t.inactive}: ${snapshot.inactiveCount}</p>`:''}`:''}<p>${t.uncertain}</p></div>`;
 el('footer').innerHTML=`<span class="footer-brand">STORM CHASER <span>/</span> V1 · ${pages?'PAGES':'LOCAL'}</span><p>${t.disclaimer}</p>`;
 (el('data-mode') as HTMLSelectElement).value=demo?'demo':'live';
 if(pages){el('data-mode').hidden=true;el('data-mode').style.display='none';(el('data-mode') as HTMLSelectElement).disabled=true;el('footer').insertAdjacentHTML('beforeend',`<p>${locale==='en'?'Pages edition · periodically published JMA data; updates may be delayed or fail. Recent bulletins only, not complete basin coverage. Source: JMA; extracted and visualized by Storm Chaser. Not an official warning service.':'Pages 版本 · 定期發布氣象廳資料；更新可能延遲或失敗。僅近期電文，並非完整海域涵蓋。來源：日本氣象廳；Storm Chaser 擷取及視覺化，非官方警報服務。'}</p>`);}
 el('data-mode').onchange=e=>{if(pages)return;demo=(e.target as HTMLSelectElement).value==='demo';manual=false;selectedId=null;point=null;pointLost=false;const u=new URL(location.href);u.searchParams.set('mode',demo?'demo':'live');history.replaceState(null,'',u);render();map?.reset(currentView().selected);el('data-mode').focus();};
 el('language').onclick=()=>{locale=locale==='en'?'zh-TW':'en';try{storage?.setItem('storm-chaser-locale',locale);}catch{}render();el('language').focus();};
 const toggle=()=>{statusOpen=!statusOpen;render();el('coverage-toggle').focus();};
 el('status-button').onclick=toggle;el('coverage-toggle').onclick=toggle;
 el('auto').onclick=()=>{manual=false;selectedId=null;point=null;pointLost=false;render();map?.reset(demo?currentView().selected:null);el('auto').focus();};
 document.querySelectorAll<HTMLButtonElement>('[data-storm]').forEach(btn=>btn.onclick=()=>choose(btn.dataset.storm!));
 document.querySelectorAll<HTMLInputElement>('[data-track]').forEach(input=>input.onchange=()=>{const track=input.dataset.track as Track;input.checked?tracks.add(track):tracks.delete(track);point=null;pointLost=false;render(true);document.querySelector<HTMLInputElement>(`[data-track="${track}"]`)?.focus();});
 if(demo){(el('scenario') as HTMLSelectElement).value=scenario;el('scenario').onchange=e=>{scenario=parseScenario((e.target as HTMLSelectElement).value);point=null;pointLost=false;render();el('scenario').focus();};}
 el('reset').onclick=()=>map?.reset(currentView().selected);
 el('source-jump').onclick=e=>{e.preventDefault();el('source-heading').scrollIntoView({block:'start'});el('source-heading').focus({preventScroll:true});};
 const disclosure=document.querySelector<HTMLDetailsElement>('.detail-disclosure');
 if(disclosure)disclosure.ontoggle=()=>{if(disclosure.isConnected)detailOpen=disclosure.open;};
 const native=document.querySelector<HTMLDetailsElement>('#native-terms');if(native)native.ontoggle=()=>{if(native.isConnected)nativeOpen=native.open;};
 document.querySelectorAll<HTMLButtonElement>('[data-forecast-time]').forEach(btn=>btn.onclick=()=>setPoint(btn.dataset.forecastTime!,'A',0,true));
 if(point)el('close-point').onclick=()=>{point=null;render();el('detail-summary').focus();};
 el('explorer').setAttribute('aria-label',t.explorerTitle);
 explorer.render(a,point?.track==='A'?point.validAt:null,locale,{demo,enabled:tracks.has('A'),stale:state!=='fresh',lost:pointLost,emptyMessage:selectionGone?t.selectionLost:undefined},validAt=>setPoint(validAt,'A',0,false),now);
 map?.setLabels(t);
 map?.update(storms,selected,demo?tracks:new Set(tracks.has('A')?['A']:[]),choose,(validAt,track,lead)=>setPoint(validAt,track,lead,true),t,point?.validAt);
 restoreFocus(focused);
}
function setPoint(validAt:string,track:Track,demoLead:number,openDetails:boolean) {
 const selected=currentView().selected;if(!selected||!tracks.has(track))return;
 const result=demo?{point:{validAt,track,lead:demoLead,stormId:selected.id}}:selectPublishedPoint(selected,validAt,track,false);
 if(!result)return;
 point=result.point;pointLost=false;if(openDetails)detailOpen=true;render();
 if(openDetails&&point)el('close-point').focus({preventScroll:true});
 el('announcements').textContent=`${demo?copy[locale].synthetic:point?copy[locale].explorerForecast:copy[locale].explorerAnalysis} · ${time(validAt)}`;
}
function choose(id:string) {
 if(!currentView().storms.some(s=>s.id===id))return;
 selectedId=id;manual=true;point=null;pointLost=false;render();map?.reset(currentView().selected);
 el('announcements').textContent=`${copy[locale].manual}: ${currentView().selected?.name??''}`;
 document.querySelector<HTMLButtonElement>(`[data-storm="${CSS.escape(id)}"]`)?.focus({preventScroll:true});
}
let refreshing=false;
async function refresh() {
 if(refreshing)return;
 refreshing=true;
 // Expire before network I/O, including resume while requests are hung/offline.
 if(!demo)render();
 let invalidReply=false;
 try {
  const r=await fetch(pages?import.meta.env.BASE_URL+'data/live.json':'/api/live',{cache:'no-store',signal:AbortSignal.timeout(10_000)});
  if(!r.ok)throw new Error('local API');
  let next:unknown;try{next=await r.json();}catch{invalidReply=true;throw new Error('invalid local JSON');}if(!isLiveSnapshot(next)){invalidReply=true;throw new Error('invalid local data');}
  const changed=JSON.stringify(snapshot?.advisories.map(a=>a.id))!==JSON.stringify(next.advisories.map((a:{id:string})=>a.id));
  snapshot=next;clientError=false;clientInvalid=false;
  if(!demo&&changed)el('announcements').textContent=copy[locale].updated;
 }catch{clientError=true;clientInvalid=invalidReply;}
 finally{refreshing=false;if(!demo)render();}
}
render();
try{map=new StormMap(el('map'),copy[locale],()=>{if(!mapFailed){mapFailed=true;render();}});render(true);}catch{mapFailed=true;render();}
void refresh();
setInterval(()=>{void refresh();},30_000);
// Local expiry is independent of fetch success and background timer frequency.
setInterval(()=>{if(!demo)render();},5_000);
const resume=()=>{if(!demo)render();void refresh();};
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')resume();});
window.addEventListener('pageshow',resume);
window.addEventListener('focus',resume);
window.addEventListener('online',resume);
window.addEventListener('offline',()=>{clientError=true;clientInvalid=false;if(!demo)render();});
