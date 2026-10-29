import {defineConfig} from 'vite';
import {localApiPort} from './shared/config';
const target=`http://127.0.0.1:${localApiPort(process.env.STORM_API_PORT)}`;
export default defineConfig({server:{host:'127.0.0.1',proxy:{'/api':target}},preview:{host:'127.0.0.1',proxy:{'/api':target}}});
