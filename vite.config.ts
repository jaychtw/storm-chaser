import {defineConfig} from 'vite';
import {localApiPort} from './shared/config';
const target=`http://127.0.0.1:${localApiPort(process.env.STORM_API_PORT)}`;
export default defineConfig({resolve:{alias:process.env.STORM_PAGES==='1'?[{find:'./fixtures',replacement:new URL('./src/pages-fixtures.ts',import.meta.url).pathname}]:[]},define:{'import.meta.env.STORM_PAGES':JSON.stringify(process.env.STORM_PAGES??'0')},base:process.env.STORM_PAGES==='1'?'/storm-chaser/':'/',server:{host:'127.0.0.1',proxy:{'/api':target}},preview:{host:'127.0.0.1',proxy:{'/api':target}}});
