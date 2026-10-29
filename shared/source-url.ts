// Shared browser/server allowlist; this is not an arbitrary upstream proxy.
export function bulletinUrl(value:string) {
 const u=new URL(value);
 if(u.origin!=='https://www.data.jma.go.jp'||!/^\/developer\/xml\/data\/[\w-]+_VPTW(?:50|51|60|61)_[\w-]+\.xml$/.test(u.pathname)||u.search||u.hash||u.username||u.password)throw new Error('untrusted bulletin URL');
 return u.href;
}
