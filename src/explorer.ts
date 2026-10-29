import type {Advisory,Value} from '../shared/model';
import {copy,formatTime,type Locale} from './i18n';
import {explorerState} from './explorer-model';
import {reportedValue,reportedDirection} from './data-labels';
import {escapeHTML as E} from './live';

export class ForecastExplorer {
 private structure='';
 private evidenceOpen=false;
 constructor(private host:HTMLElement){}
 render(advisory:Advisory|undefined,selectedAt:string|null,locale:Locale,
  options:{demo:boolean;enabled:boolean;stale:boolean;lost:boolean;emptyMessage?:string},
  onSelect:(validAt:string)=>void,now=Date.now()) {
  this.host.hidden=options.demo;
  if(options.demo)return;
  const evidence=this.host.querySelector<HTMLDetailsElement>('#explorer-evidence');
  if(evidence)this.evidenceOpen=evidence.open;
  const t=copy[locale],model=explorerState(advisory,selectedAt,now);
  const usable=options.enabled&&model.steps.length>1;
  const explanation=!advisory?(options.emptyMessage??t.explorerPrompt):!options.enabled?t.explorerHidden:model.steps.length<2?t.explorerNoForecast:t.explorerInstructions;
  // Keep the native range element attached while stepping/dragging. Replacing
  // it on each input loses pointer capture and interrupts keyboard interaction.
  const structure=JSON.stringify([advisory?.id,model.steps.map(p=>p.validAt),locale,usable]);
  if(structure!==this.structure) {
   this.structure=structure;
   this.host.innerHTML=`<div class="explorer-heading"><div><span class="eyebrow">${t.explorerPOC}</span><h2>${t.explorerTitle}</h2></div><span id="explorer-kind"></span></div><p id="explorer-instructions"></p><p id="explorer-status" role="status"></p>${usable?`<div class="explorer-controls"><button id="explorer-previous" aria-label="${t.explorerPrevious}">←</button><div class="explorer-range-wrap"><label for="explorer-range">${t.explorerSteps}</label><input id="explorer-range" type="range" min="0" max="${model.steps.length-1}" step="1" value="0" aria-describedby="explorer-gaps explorer-instructions"><div class="explorer-ticks" aria-hidden="true">${model.steps.map(p=>`<span>${p.kind==='analysis'?t.officialObservation:`+${p.leadHours} ${t.hours}`}</span>`).join('')}</div></div><button id="explorer-next" aria-label="${t.explorerNext}">→</button></div><p id="explorer-gaps" class="map-note">${t.explorerGaps}</p>`:''}<div id="explorer-readout"></div>`;
  }
  const get=(id:string)=>this.host.querySelector<HTMLElement>('#'+id)!;
  get('explorer-instructions').textContent=explanation;
  get('explorer-status').textContent=[options.stale&&advisory?t.staleEligible:'',options.lost?t.pointLost:''].filter(Boolean).join(' · ');
  const selected=model.selected;
  get('explorer-kind').textContent=selected?(selected.kind==='analysis'?t.explorerAnalysis:t.explorerForecast):'';
  this.host.dataset.selectedTime=selected?.validAt??'';
  this.host.dataset.kind=selected?.kind??'none';
  this.host.dataset.advisory=advisory?.id??'';
  if(usable) {
   const range=get('explorer-range') as HTMLInputElement;
   range.value=String(Math.max(0,model.index));
   range.setAttribute('aria-valuetext',selected?`${selected.kind==='analysis'?t.explorerAnalysis:t.explorerForecast} · +${selected.leadHours} ${t.hours} · ${formatTime(selected.validAt,locale)}`:t.pointLost);
   range.oninput=()=>{const p=model.steps[Number(range.value)];if(p)onSelect(p.validAt);};
   const previous=get('explorer-previous') as HTMLButtonElement,next=get('explorer-next') as HTMLButtonElement;
   previous.disabled=model.index<=0;next.disabled=model.index<0||model.index>=model.steps.length-1;
   previous.onclick=()=>{const p=model.steps[model.index-1];if(p)onSelect(p.validAt);};
   next.onclick=()=>{const p=model.steps[model.index+1];if(p)onSelect(p.validAt);};
  }
  const values=(xs:Value[])=>xs.length?xs.map(v=>E(reportedValue(v,locale))).join('<br>'):t.noValue;
  get('explorer-readout').innerHTML=selected&&advisory?`<div class="explorer-time"><span>${t.valid}</span><strong>${formatTime(selected.validAt,locale)}</strong><span>+${selected.leadHours} ${t.hours} · ${t.explorerStepOf} ${model.index+1} ${t.explorerOf} ${model.steps.length}</span></div><div class="explorer-context"><p>${t.location}: ${Math.abs(selected.latitude)}° ${selected.latitude>=0?'N':'S'} / ${Math.abs(selected.longitude)}° ${selected.longitude>=0?'E':'W'}</p><p>${t.issued}: ${formatTime(advisory.issuedAt,locale)}</p>${model.nextGapHours!==null?`<p>${t.explorerNextGap}: ${model.nextGapHours} ${t.hours}</p>`:''}</div><details id="explorer-evidence" ${this.evidenceOpen?'open':''}><summary id="explorer-evidence-summary">${t.sourceDetails}</summary><p>${values(selected.winds)}<br>${values(selected.pressure)}</p><p>${t.motionDirection}: ${E(reportedDirection(selected.direction,locale))}<br>${values(selected.motion)}</p><p class="map-note">${t.averaging}</p></details><a id="explorer-source" class="source-link" href="${E(advisory.sourceUrl)}" target="_blank" rel="noopener noreferrer">${t.liveSourceLabel} ↗</a>`:'';
  // Persist disclosure across step changes; open state is local presentation,
  // never a new source/advisory selection.
 }
}
