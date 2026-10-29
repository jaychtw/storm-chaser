import type {Advisory,Position} from '../shared/model';
import {eligibility} from '../shared/eligibility';

// A step is an existing source record, never a sampled/interpolated position.
export function forecastSteps(advisory:Advisory|undefined,now=Date.now()):Position[] {
 if(!advisory||eligibility(advisory,now)!=='eligible')return [];
 const analysis=advisory.points.find(p=>p.kind==='analysis');
 if(!analysis)return [];
 return [analysis,...advisory.points.filter(p=>p.kind==='forecast'&&Date.parse(p.validAt)>=now).sort((a,b)=>Date.parse(a.validAt)-Date.parse(b.validAt))];
}

export function explorerState(advisory:Advisory|undefined,selectedAt:string|null,now=Date.now()) {
 const steps=forecastSteps(advisory,now);
 const index=selectedAt===null?0:steps.findIndex(p=>p.validAt===selectedAt);
 const selected=index>=0?steps[index]:undefined;
 const next=selected?steps[index+1]:undefined;
 return {steps,index,selected,nextGapHours:next?(Date.parse(next.validAt)-Date.parse(selected!.validAt))/3600_000:null};
}
