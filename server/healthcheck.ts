try{const r=await fetch(`http://127.0.0.1:${process.env.STORM_API_PORT??8787}/api/health`,{signal:AbortSignal.timeout(5000)});if(!r.ok)throw new Error('API HTTP failure');const s=await r.json();console.log(JSON.stringify(s));if(s.health?.state!=='fresh')process.exitCode=1;}catch{console.error('local API unavailable');process.exitCode=1;}
export {};
