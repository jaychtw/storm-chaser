export function localApiPort(value:string|undefined) {
 const port=value===undefined?8787:Number(value);
 if(!Number.isInteger(port)||port<1||port>65535)throw new Error('STORM_API_PORT must be an integer from 1 to 65535');
 return port;
}
