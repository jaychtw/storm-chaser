"""Offline M0 specimen inspection, NOT a live adapter or canonical pipeline.

Source: Japan Meteorological Agency website; see dossier and adjacent evidence
manifest for URL, retrieval metadata, content hash and reuse attribution.
Only this bulletin's observed structure is supported; fail on unknown geometry.
"""
import datetime as dt
import hashlib
import json
import pathlib
import re
import sys
import xml.etree.ElementTree as ET

path = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parents[1] / 'docs/sources/evidence/2026-10-29/jma-vptw61.xml'
raw = path.read_bytes()
root = ET.fromstring(raw)
n = {'r': 'http://xml.kishou.go.jp/jmaxml1/', 'h': 'http://xml.kishou.go.jp/jmaxml1/informationBasis1/', 'm': 'http://xml.kishou.go.jp/jmaxml1/body/meteorology1/', 'e': 'http://xml.kishou.go.jp/jmaxml1/elementBasis1/'}
assert root.tag == '{' + n['r'] + '}Report'
def utc(text):
    value = dt.datetime.fromisoformat(text)
    assert value.tzinfo is not None, 'source timezone must be explicit'
    return value.astimezone(dt.timezone.utc).isoformat().replace('+00:00', 'Z')
def get(query):
    value = root.findtext(query, namespaces=n)
    assert value, f'missing {query}'
    return value
base = dt.datetime.fromisoformat(get('h:Head/h:TargetDateTime'))
points=[]
for item in root.findall('.//m:MeteorologicalInfo', n):
    time = item.find('m:DateTime', n)
    center = item.find('.//m:CenterPart', n)
    assert time is not None and center is not None
    observed = time.attrib['type'] == '実況'
    # Decimal-degree current coordinate vs forecast-circle base point. Never
    # mistake degree-minute alternate encoding or uncertainty radii for centers.
    coordinate = center.find("e:Coordinate[@type='中心位置（度）']" if observed else "m:ProbabilityCircle/e:BasePoint[@type='中心位置（度）']", n)
    assert coordinate is not None and coordinate.text
    match = re.fullmatch(r'([+-]\d+(?:\.\d+)?)([+-]\d+(?:\.\d+)?)/', coordinate.text)
    assert match, 'unsupported coordinate encoding'
    latitude, longitude = map(float, match.groups())
    assert -90 <= latitude <= 90 and -180 <= longitude <= 180
    lead = (dt.datetime.fromisoformat(time.text)-base).total_seconds()/3600
    assert lead >= 0
    wind = [{'value':v.text, **v.attrib} for v in item.findall('.//m:WindPart/e:WindSpeed', n)]
    points.append({'kind':'analysis' if observed else 'forecast','nativeTimeType':time.attrib['type'], 'validAt':utc(time.text),'leadHoursFromAnalysis':lead, 'latitude':latitude, 'longitude':longitude,'nativeCoordinate':coordinate.text,'windAsReported':wind, 'windAveragingPeriod':None, 'pressureAsReported':[{'value':v.text, **v.attrib} for v in center.findall('e:Pressure',n)], 'uncertaintyRadiiAsReported':[{'value':v.text, **v.attrib} for v in center.findall('m:ProbabilityCircle/e:Axes/e:Axis/e:Radius',n)]})
assert len(points) == 7 and sum(p['kind']=='forecast' for p in points) == 6, 'specimen changed; review rather than silently accepting'
assert [p['leadHoursFromAnalysis'] for p in points] == [0,12,24,45,69,93,117]
assert len({p['validAt'] for p in points}) == len(points)
result={'purpose':'M0 offline specimen verification; not production data','source':'JMA','sha256':hashlib.sha256(raw).hexdigest(),'eventId':get('h:Head/h:EventID'),'typhoonNumber':get('.//m:TyphoonNamePart/m:Number'),'nameAsReported':get('.//m:TyphoonNamePart/m:Name'),'serial':get('h:Head/h:Serial'),'infoType':get('h:Head/h:InfoType'),'status':get('r:Control/r:Status'),'reportIssuedAt':utc(get('h:Head/h:ReportDateTime')),'controlDateTime':utc(get('r:Control/r:DateTime')),'analysisValidAt':utc(get('h:Head/h:TargetDateTime')),'targetDuration':get('h:Head/h:TargetDuration'),'points':points,'verification':{'analysisPoints':1,'forecastPoints':6,'finiteInRangeCoordinates':True,'explicitTimezones':True,'strictlyIncreasingValidTimes':all(points[i]['validAt']<points[i+1]['validAt'] for i in range(len(points)-1))}}
assert result['verification']['strictlyIncreasingValidTimes']
print(json.dumps(result,ensure_ascii=False,indent=2))
