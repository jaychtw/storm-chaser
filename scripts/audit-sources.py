"""Capture public-source feasibility probes; never accepts or records credentials.
Run only through the configured proxy after required hosts are permitted.
A failed CONNECT is access evidence, not an agency response or a permission grant.
"""
import datetime, json, pathlib, subprocess
root = pathlib.Path(__file__).resolve().parents[1] / 'docs/sources/evidence'
root.mkdir(parents=True, exist_ok=True)
targets = {
 'cwa-catalog': 'https://opendata.cwa.gov.tw/dist/opendata-swagger.html',
 'cwa-chart-page': 'https://www.cwa.gov.tw/V8/C/P/Typhoon/TY_NEWS.html',
 'jma-active-candidate': 'https://www.jma.go.jp/bosai/typhoon/data/targetTc.json',
 'jma-xml-feed': 'https://www.data.jma.go.jp/developer/xml/feed/extra.xml',
 'jma-terms': 'https://www.jma.go.jp/jma/kishou/info/coment.html',
 'jtwc-products': 'https://www.metoc.navy.mil/jtwc/jtwc.html',
 'ibtracs-catalog': 'https://www.ncei.noaa.gov/products/international-best-track-archive',
}
records=[]
for name,url in targets.items():
 # Do not archive successful payloads before reviewing reuse terms. Only retain
 # response status/size/hash and public error classification at this stage.
 result=subprocess.run(['curl','--silent','--show-error','--location','--max-time','20','--fail','--output','/dev/null','--write-out','%{http_code}',url],capture_output=True)
 blocked=b'CONNECT tunnel failed, response 403' in result.stderr
 record={'id':name,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),
         'curlExitCode':result.returncode,'outcome':'proxy-connect-denied' if blocked else 'retrieved-unreviewed' if result.returncode==0 else 'request-failed',
         'httpStatus':result.stdout.decode().strip(),
         'payloadArchived':False}
 records.append(record)
 print(name,record['outcome'])
(root/'access-probes.json').write_text(json.dumps(records,indent=2)+'\n')
