import {execFileSync} from 'node:child_process';import {readFile,readdir,writeFile} from 'node:fs/promises';import {join} from 'node:path';
let notice=await readFile('docs/pages/NOTICE.txt','utf8');
const graph=JSON.parse(execFileSync('npm',['ls','--omit=dev','--all','--json'],{encoding:'utf8'}));
const browserNames=new Set(['maplibre-gl']);function visit(n){for(const [name,dep] of Object.entries(n.dependencies??{})){browserNames.add(name);visit(dep);}}visit(graph.dependencies['maplibre-gl']);
const paths=execFileSync('npm',['ls','--omit=dev','--parseable','--all'],{encoding:'utf8'}).trim().split('\n').slice(1);
for(const dir of [...new Set(paths)].sort()){
 const p=JSON.parse(await readFile(join(dir,'package.json'),'utf8'));
 if(!browserNames.has(p.name))continue;
 const files=(await readdir(dir)).filter(f=>/^(licen[cs]e|copying|notice)(\.|$)/i.test(f));
 notice+='\n\n--- '+p.name+' '+p.version+' ('+p.license+') ---\n';
 if(!files.length){if(p.name.startsWith('@esbuild/')){notice+=await readFile('node_modules/esbuild/LICENSE.md','utf8');continue;}const readme=await readFile(join(dir,'README.md'),'utf8');const start=readme.search(/^## License/m);if(start>=0&&readme.includes('Permission is hereby granted')){notice+=readme.slice(start);continue;}throw Error('Missing license notice: '+p.name);}
 for(const f of files){const s=await readFile(join(dir,f),'utf8');if(s.length>100000)throw Error('Notice size bound');notice+=s+'\n';}
}
await writeFile('dist/NOTICE.txt',notice);console.log('Preserved production dependency notices:',paths.length);
