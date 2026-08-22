import http from 'node:http';
try { process.loadEnvFile?.(); } catch {}
const [{ app }, { initStore }, { PORT, HOST }] = await Promise.all([import('./src/app.js'), import('./src/store.js'), import('./src/config.js')]);
await initStore();
const server=http.createServer(app);
server.listen(PORT,HOST,()=>console.log(`Softify 2.0 running at http://localhost:${PORT}`));
