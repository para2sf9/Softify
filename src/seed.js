import { initStore } from './store.js';
const force=process.argv.includes('--force');
await initStore(force);
console.log(force ? 'Softify demo data reset.' : 'Softify data initialized.');
