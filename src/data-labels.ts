import {copy,type Locale} from './i18n';
import type {Value,TextValue} from '../shared/model';

const compass = ['北','北北東','北東','東北東','東','東南東','南東','南南東','南','南南西','南西','西南西','西','西北西','北西','北北西'];
const compassEN = ['North','North-northeast','Northeast','East-northeast','East','East-southeast','Southeast','South-southeast','South','South-southwest','Southwest','West-southwest','West','West-northwest','Northwest','North-northwest'];
const compassTW = ['北','北北東','東北','東北東','東','東南東','東南','南南東','南','南南西','西南','西南西','西','西北西','西北','北北西'];

export function nativeLabel(value:string,locale:Locale):string {
 const t=copy[locale];
 const terms:Record<string,string>={
  '最大風速':t.maxWind,'最大瞬間風速':t.gust,'中心気圧':t.centralPressure,
  '移動速度':t.motionSpeed,'移動方向':t.motionDirection,
  'ノット':t.knots,'m/s':'m/s','km/h':'km/h','hPa':'hPa',
  'ゆっくり':t.slow,'ほとんど停滞':t.stationary,'不定':t.variable,'中心付近':t.nearCenter,
  '台風(TY)':`${t.typhoonClass} (TY)`,'台風(STS)':`${t.tropicalCycloneClass} (STS)`,
  '台風(TS)':`${t.tropicalCycloneClass} (TS)`,'熱帯低気圧(TD)':`${t.tropicalDepression} (TD)`,
  '温帯低気圧(LOW)':`${t.extratropical} (LOW)`,
 };
 return terms[value]??`${t.untranslated}: ${value}`;
}

export function reportedValue(v:Value,locale:Locale) {
 const t=copy[locale];
 // Qualitative motion is not zero speed. Numeric descriptions remain in the
 // source-native disclosure; no automatic prose translation is presented.
 const condition=v.condition?` · ${nativeLabel(v.condition,locale)}`:'';
 const missingDescription=v.value===null&&v.description&&v.description!==v.condition?` · ${nativeLabel(v.description,locale)}`:'';
 return `${nativeLabel(v.type,locale)}: ${v.value??t.noValue} ${nativeLabel(v.unit,locale)}${condition}${missingDescription}`;
}

export function reportedDirection(v:TextValue|undefined,locale:Locale) {
 if(!v)return copy[locale].noValue;
 const index=v.value===null?-1:compass.indexOf(v.value);
 const value=v.value===null?copy[locale].noValue:index>=0?(locale==='en'?compassEN:compassTW)[index]:`${copy[locale].untranslated}: ${v.value}`;
 return value+(v.condition?` · ${nativeLabel(v.condition,locale)}`:'');
}
