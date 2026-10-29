import {forecastSteps} from './explorer-model';
import type {MapStorm} from './live';
import type {Track} from './fixtures';

export type PointSelection={validAt:string;track:Track;lead:number;stormId:string};
export function selectPublishedPoint(storm:MapStorm|null,validAt:string,track:Track,demo:boolean,now=Date.now()):{point:PointSelection|null}|null {
 if(!storm)return null;
 if(!demo){
  if(track!=='A')return null;
  const p=forecastSteps(storm.advisory,now).find(p=>p.validAt===validAt);
  if(!p)return null;
  return {point:p.kind==='analysis'?null:{validAt:p.validAt,track,lead:p.leadHours,stormId:storm.id}};
 }
 return null; // Authored demo points are handled separately, never as JMA.
}
