import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { createHash } from 'node:crypto';
import type {Advisory, Position, Value, TextValue} from '../shared/model';
import {bulletinUrl} from '../shared/source-url';
export {bulletinUrl} from '../shared/source-url';
const parser=new XMLParser({ignoreAttributes:false,attributeNamePrefix:'@_',removeNSPrefix:true,parseTagValue:false,parseAttributeValue:false,trimValues:true,processEntities:false});
const list=<T>(v:T|T[]|undefined):T[]=>v===undefined?[]:Array.isArray(v)?v:[v];
const text=(v:any):string=>typeof v==='string'?v:typeof v?.['#text']==='string'?v['#text']:'';
function required(v:any,label:string){const s=text(v);if(!s)throw new Error(`missing ${label}`);return s;}
function date(v:any,label:string){const s=required(v,label);const m=s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/);if(!m||!Number.isFinite(Date.parse(s)))throw new Error(`invalid ${label}`);const [y,mo,d,h,mi,se]=m.slice(1,7).map(Number);const check=new Date(Date.UTC(y,mo-1,d));if(check.getUTCMonth()!==mo-1||check.getUTCDate()!==d||h>23||mi>59||se>59||(m[7]!=='Z'&&(Number(m[7].slice(1,3))>14||Number(m[7].slice(4,6))>59)))throw new Error(`invalid ${label}`);return new Date(s).toISOString();}
export const hash=(raw:string|Uint8Array)=>createHash('sha256').update(raw).digest('hex');
export function parseXml(raw:string){if(raw.length>8_000_000||/<!DOCTYPE|<!ENTITY/i.test(raw)||XMLValidator.validate(raw)!==true)throw new Error('invalid XML');const allowed=new Set(['http://www.w3.org/2005/Atom','http://www.w3.org/2001/XMLSchema-instance','http://xml.kishou.go.jp/jmaxml1/','http://xml.kishou.go.jp/jmaxml1/addition1/','http://xml.kishou.go.jp/jmaxml1/informationBasis1/','http://xml.kishou.go.jp/jmaxml1/body/meteorology1/','http://xml.kishou.go.jp/jmaxml1/elementBasis1/']);for(const m of raw.matchAll(/xmlns(?::[\w-]+)?=["']([^"']+)["']/g))if(!allowed.has(m[1]))throw new Error('unsupported XML namespace');return parser.parse(raw);}
export function discover(raw:string):string[]{const doc=parseXml(raw);if(!Object.hasOwn(doc,'feed'))throw new Error('missing Atom feed');const feed=doc.feed||{};return [...new Set(list<any>(feed.entry).flatMap(e=>list<any>(e.link).map(l=>l['@_href']).filter((s:unknown):s is string=>typeof s==='string'&&/_VPTW(?:60|61)_/.test(s)).map(bulletinUrl)))];}
function values(v:any,units:string[]):Value[]{return list<any>(v).map(x=>{const s=text(x);const num=s===''?null:Number(s);if(num!==null&&(!Number.isFinite(num)||num<0))throw new Error('invalid meteorological value');const unit=required(x['@_unit'],'unit');if(!units.includes(unit))throw new Error('unsupported native unit');return {value:num,unit,type:required(x['@_type'],'value type'),...(x['@_condition']?{condition:x['@_condition']} : {}),...(x['@_description']?{description:x['@_description']}:{})};});}
function direction(v:any):TextValue|undefined {
 if(v===undefined)return undefined;
 // Product manual, "台風の中心位置", p12: CenterPart/Direction only.
 // Never confuse it with uncertainty-circle or wind-area directions.
 if(Array.isArray(v)||v['@_type']!=='移動方向'||v['@_unit']!=='１６方位漢字')throw new Error('unsupported motion direction');
 const value=text(v)||null;
 if(value&&!['北','北北東','北東','東北東','東','東南東','南東','南南東','南','南南西','南西','西南西','西','西北西','北西','北北西'].includes(value))throw new Error('unsupported motion direction');
 return {value,unit:v['@_unit'],type:v['@_type'],...(v['@_condition']?{condition:v['@_condition']} : {}),...(v['@_description']?{description:v['@_description']} : {})};
}
export function normalize(raw:string,sourceUrl:string,retrievedAt:string):Advisory{
 const inputKind=sourceUrl.startsWith('https://xml.kishou.go.jp/jmaxml_20260917_Samples.zip#')?'official-example':'live';if(inputKind==='live')bulletinUrl(sourceUrl);const doc=parseXml(raw).Report;if(!doc||!/<Report\b[^>]*xmlns=["']http:\/\/xml\.kishou\.go\.jp\/jmaxml1\/["']/.test(raw))throw new Error('unsupported Report namespace');
 const h=doc.Head,c=doc.Control;if(!h||!c||text(c.Status)!=='通常')throw new Error('non-operational or missing status');
 if(text(h.InfoKind)!=='台風解析・予報情報（５日予報）'||!['1.0_0','1.0_1','1.0_2'].includes(text(h.InfoKindVersion)))throw new Error('unsupported bulletin kind/version');
 const eventId=required(h.EventID,'EventID');if(!/^TC\d{4,}$/.test(eventId))throw new Error('invalid EventID');
 const infoType=required(h.InfoType,'InfoType');if(!['発表','訂正','取消','遅延'].includes(infoType))throw new Error('unsupported InfoType');
 const issuedAt=date(h.ReportDateTime,'ReportDateTime'),controlAt=date(c.DateTime,'Control DateTime');
 const issuedYear=Number(issuedAt.slice(0,4));let eventYear=Math.floor(issuedYear/100)*100+Number(eventId.slice(2,4));if(eventYear>issuedYear+1)eventYear-=100;
 const analysisAt=infoType==='取消'&& !h.TargetDateTime?issuedAt:date(h.TargetDateTime,'TargetDateTime');
 const infos=list<any>(doc.Body?.MeteorologicalInfos).filter(x=>x['@_type']==='台風情報').flatMap(x=>list<any>(x.MeteorologicalInfo));
 let remark:string|null=null;let name='',typhoonNumber:string|null=null,nativeClass:string|null=null;const points:Position[]=[];
 for(const info of infos){
  const time=date(info.DateTime,'point DateTime');const observed=info.DateTime?.['@_type']==='実況';const estimated=String(info.DateTime?.['@_type']).startsWith('推定');if(!observed&&!estimated&&!String(info.DateTime?.['@_type']).includes('予報'))throw new Error('unsupported time type');
  const properties=list<any>(info.Item).flatMap(i=>list<any>(i.Kind).map(k=>k.Property).filter(Boolean));
  const naming=properties.find(p=>p.TyphoonNamePart)?.TyphoonNamePart;
  if(naming){name=text(naming.Name)||name;typhoonNumber=text(naming.Number)||typhoonNumber;remark=text(naming.Remark)||remark;}
  const cls=properties.find(p=>p.ClassPart)?.ClassPart;if(observed&&cls)nativeClass=text(cls.TyphoonClass)||null;
  const center=properties.find(p=>p.CenterPart)?.CenterPart;if(!center){if(remark?.startsWith('台風消滅')||remark==='台風発生の可能性が小さくなった'||infoType==='取消')continue;throw new Error('missing center');}
  const coordinates=observed||estimated?center.Coordinate:center.ProbabilityCircle?.BasePoint;
  const coordinate=list<any>(coordinates).find(x=>x['@_type']==='中心位置（度）');const match=text(coordinate).match(/^([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)\/$/);
  if(coordinate&&Object.hasOwn(coordinate,'@_datum'))throw new Error('unsupported explicit source datum');if(!match)throw new Error('missing or malformed decimal center');const latitude=Number(match[1]),longitude=Number(match[2]);
  if(Math.abs(latitude)>90||Math.abs(longitude)>180)throw new Error('coordinate out of range');
  const leadHours=(Date.parse(time)-Date.parse(analysisAt))/3_600_000;if(leadHours<0||leadHours>120||(observed&&leadHours!==0))throw new Error('invalid forecast horizon');
  const wind=properties.find(p=>p.WindPart)?.WindPart;
  points.push({datum:{encoding:'ISO6709-decimal-degrees',sourceAttribute:null,interpretation:'datum-attribute-omitted',plottingAssumption:'geographic-degrees-on-WGS84-basemap',precisionDegrees:0.1},validAt:time,latitude,longitude,kind:observed?'analysis':estimated?'estimate':'forecast',leadHours,winds:values(wind?.WindSpeed,['m/s','ノット']),pressure:values(center.Pressure,['hPa']),motion:values(center.Speed,['km/h','ノット']),...(center.Direction?{direction:direction(center.Direction)}:{})});
 }
 const cancelled=infoType==='取消';const terminal=remark?.startsWith('台風消滅')||remark==='台風発生の可能性が小さくなった';if(!cancelled&&!terminal&&(points.filter(p=>p.kind==='analysis').length!==1))throw new Error('missing name or unique analysis');
 points.sort((a,b)=>a.validAt.localeCompare(b.validAt));if(new Set(points.map(p=>p.validAt)).size!==points.length)throw new Error('duplicate valid time');
 const contentHash=hash(raw);return {id:`JMA:${eventId}:${contentHash}`,stormId:`JMA:${eventYear}:${eventId}`,source:'JMA',inputKind,schemaVersion:text(h.InfoKindVersion),eventId,serial:text(h.Serial),unitKey:[required(c.Title,'Control Title'),required(c.EditorialOffice,'EditorialOffice'),text(c.Status),eventId,String(eventYear)].join('|'),remark,validUntil:h.ValidDateTime?date(h.ValidDateTime,'ValidDateTime'):null,infoType,issuedAt,controlAt,analysisAt,retrievedAt:date(retrievedAt,'retrievedAt'),sourceUrl,contentHash,rawPayloadRef:`raw/${contentHash}.xml`,name:name||eventId,typhoonNumber,nativeClass,lifecycle:cancelled?'unknown':remark&&(remark.startsWith('台風消滅')||remark==='台風発生の可能性が小さくなった')||nativeClass?.includes('温帯低気圧')?'inactive':nativeClass?.includes('台風')?'active':'unknown',cancelled,points};
}
