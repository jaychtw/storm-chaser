import maplibregl, { type GeoJSONSource, type Map as GLMap } from 'maplibre-gl';
import type { FeatureCollection, Feature, LineString } from 'geojson';
import type { Copy } from './i18n';
import { type Track, pointTime } from './fixtures';
import type {MapStorm} from './live';
export class StormMap {
  map: GLMap;
  markers: maplibregl.Marker[] = [];
  labels: maplibregl.Marker[] = [];
  loaded = false;
  pending?: () => void;
  constructor(container: HTMLElement, t: Copy, onError: () => void) {
    this.map = new maplibregl.Map({
      container, center: [135, 24], zoom: 2, minZoom: 2, maxZoom: 8,
      maxBounds: [[85,-10],[180,65]], attributionControl: false,
      style: {version: 8, sources: {
        countries: {type:'geojson', data:'/geography/countries.geojson'},
        grid: {type:'geojson', data:this.grid()}, tracks: {type:'geojson', data:{type:'FeatureCollection',features:[]}},
      }, layers: [
        {id:'water',type:'background',paint:{'background-color':'#0c1822'}},
        {id:'grid',type:'line',source:'grid',paint:{'line-color':'#29404d','line-width':0.6,'line-opacity':0.5}},
        {id:'land',type:'fill',source:'countries',paint:{'fill-color':'#1c2b34'}},
        {id:'coast',type:'line',source:'countries',paint:{'line-color':'#42545b','line-width':1}},
        {id:'track-a',type:'line',source:'tracks',filter:['==','track','A'],paint:{'line-color':'#6dd8d0','line-width':2.5}},
        {id:'track-b',type:'line',source:'tracks',filter:['==','track','B'],paint:{'line-color':'#ddb67a','line-width':2.5,'line-dasharray':[2,2]}},
      ]},
      locale: {'NavigationControl.ZoomIn':t.zoomIn,'NavigationControl.ZoomOut':t.zoomOut,'NavigationControl.ResetBearing':t.north},
    });
    this.map.addControl(new maplibregl.NavigationControl({showCompass:false}), 'top-right');
    this.map.on('load',()=>{ this.loaded=true; this.map.resize(); this.pending?.(); });
    this.map.on('idle',()=>{container.dataset.ready='true';});
    const recordCamera=()=>{const c=this.map.getCenter();container.dataset.camera=JSON.stringify([c.lng,c.lat,this.map.getZoom()]);};this.map.on('moveend',recordCamera);recordCamera();
    new ResizeObserver(()=>this.map.resize()).observe(container);
    this.map.on('error', onError);
    this.setLabels(t);
  }
  grid(): FeatureCollection {
    const features: Feature<LineString>[]=[];
    for(let lng=90;lng<=180;lng+=10) features.push({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[lng,-10],[lng,65]]}});
    for(let lat=0;lat<=60;lat+=10) features.push({type:'Feature',properties:{},geometry:{type:'LineString',coordinates:[[85,lat],[180,lat]]}});
    return {type:'FeatureCollection',features};
  }
  setLabels(t: Copy) {
    this.labels.forEach(m=>m.remove());
    this.labels = ([ [t.china,111,29], [t.japan,137,37], [t.philippines,122,13], [t.taiwan,121,23.7] ] as const).map(([text,lng,lat])=>{
      const el=document.createElement('span'); el.className='geo-label'+(text===t.taiwan?' taiwan':''); el.textContent=text;
      return new maplibregl.Marker({element:el}).setLngLat([lng,lat]).addTo(this.map);
    });
    const buttons=this.map.getContainer().querySelectorAll('.maplibregl-ctrl-zoom-in, .maplibregl-ctrl-zoom-out');
    buttons.forEach((el,i)=>{el.setAttribute('aria-label',i===0?t.zoomIn:t.zoomOut);el.setAttribute('title',i===0?t.zoomIn:t.zoomOut);});
    this.map.getCanvas().setAttribute('aria-label',t.map);
  }
  update(storms: MapStorm[], selected: MapStorm|null, tracks: Set<Track>, onStorm:(id:string)=>void, onPoint:(validAt:string,track:Track,lead:number)=>void, t:Copy,exploredAt?:string) {
    const run=()=>{
      this.map.getContainer().dataset.ready='false';
      this.markers.forEach(m=>m.remove()); this.markers=[];
      const features: Feature<LineString>[]=[];
      for(const storm of storms) {
        const el=document.createElement('button'); el.type='button'; el.className='storm-pin'+(storm.id===selected?.id?' active':''); el.dataset.mapStorm=storm.id;el.setAttribute('aria-label',`${storm.advisory?"JMA":t.synthetic} ${storm.name}`);el.setAttribute('aria-pressed',String(storm.id===selected?.id));
        el.textContent='◉'; el.onclick=()=>onStorm(storm.id);
        const name=document.createElement('span');name.textContent=storm.name; el.append(name);
        this.markers.push(new maplibregl.Marker({element:el}).setLngLat(storm.position).addTo(this.map));
      }
      if(selected) for(const track of tracks) {
        if(selected.tracks[track].length<2)continue;
        features.push({type:'Feature',properties:{track},geometry:{type:'LineString',coordinates:selected.tracks[track]}});
        selected.tracks[track].slice(1).forEach((p,i)=>{
          const el=document.createElement('button');el.type='button';el.className='forecast-dot track-'+track;
          const lead=selected.forecastLeads?.[i]??(i+1)*12;
          el.dataset.mapPoint=`${selected.id}|${track}|${selected.forecastTimes?.[i]??pointTime(i+1)}`;
          el.dataset.position=JSON.stringify(p);
          const explored=Boolean(selected.advisory&&selected.forecastTimes?.[i]===exploredAt);
          el.classList.toggle('is-explored',explored);el.setAttribute('aria-pressed',String(explored));
          el.setAttribute('aria-label',`${selected.advisory?'JMA':track==='A'?t.trackA:t.trackB} +${lead} ${t.hours}`);
          el.onclick=()=>onPoint(selected.forecastTimes?.[i]??pointTime(i+1),track,lead);
          this.markers.push(new maplibregl.Marker({element:el}).setLngLat(p).addTo(this.map));
        });
      }
      (this.map.getSource('tracks') as GeoJSONSource).setData({type:'FeatureCollection',features});
    };
    this.pending=run;if(this.loaded)run();
  }
  reset(storm?: MapStorm|null) { if(storm){const b=new maplibregl.LngLatBounds();[storm.position,...storm.tracks.A,[121,24] as [number,number]].forEach(p=>b.extend(p));this.map.fitBounds(b,{padding:{top:55,bottom:55,left:45,right:95},maxZoom:4,duration:0});}else this.map.jumpTo({center:[135,24],zoom:2}); }
}
