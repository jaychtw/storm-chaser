// No approved source-supported Taiwan ranking exists. Candidate ordering and
// bulletin recency are deliberately absent from this selection decision.
export type FocusState = {manual:boolean;selectedId:string|null};
export function resolveFocus<T extends {id:string}>(candidates:T[],focus:FocusState) {
 if(!focus.manual)return {selected:null,reason:'uncertain' as const};
 const selected=candidates.find(s=>s.id===focus.selectedId)??null;
 return {selected,reason:selected?'manual' as const:'ineligible' as const};
}
