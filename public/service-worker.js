// autogen script
(()=>{var d="neilatools",p="1.3.0",u="4",m=!0,f="Something useless tools",g={dev:"next dev",build:"next build",start:"next start",lint:"next lint",genWorker:'echo "// autogen script" > public/service-worker.js && esbuild components/service-worker.js --bundle --minify >> public/service-worker.js'},h={"@emotion/react":"^11.10.5","@emotion/styled":"^11.10.5","@fontsource/roboto":"^4.5.8","@mui/icons-material":"^5.11.0","@mui/material":"^5.11.7",filepond:"^4.30.4","filepond-plugin-file-rename":"^1.1.8","filepond-plugin-image-crop":"^2.0.6","filepond-plugin-image-edit":"^1.6.3","filepond-plugin-image-preview":"^4.6.11","filepond-plugin-image-resize":"^2.0.10","lp-logger":"github:neila-a/lp-logger-no-window",mathjs:"^11.5.1",moment:"^2.29.4",next:"canary",pi:"^2.0.4",react:"18.2.0","react-dom":"18.2.0","react-filepond":"^7.1.2",sass:"^1.58.0"},v={"@types/node":"18.11.9","@types/react":"18.0.25","@types/react-dom":"18.0.8",eslint:"8.27.0","eslint-config-next":"13.0.3",typescript:"4.8.4"},l={name:d,version:p,devVersion:u,private:m,description:f,scripts:g,dependencies:h,devDependencies:v};var{version:b,devVersion:a}=l,r=`NeilaTools-${b}-${a!=0?`dev${a}`:"prod"}`,k=["/","/tool","/settings","/index.webmanifest","/favicon.png"],c=e=>console.log("%cServiceWorker","background: #52c41a;border-radius: 0.5em;color: white;font-weight: bold;padding: 2px 0.5em",e),w=()=>caches.open(r).then(e=>e.addAll(k).catch(console.error)),x=()=>caches.keys().then(e=>Promise.all(e.filter(i=>i!==r).map(i=>(c(`\u5DF2\u5220\u9664\u7F13\u5B58\u201C${i}\u201D`),caches.delete(i)))));self.addEventListener("install",e=>{e.waitUntil(w().then(()=>self.skipWaiting()))});self.addEventListener("activate",e=>e.waitUntil(x().then(()=>self.clients.claim())));self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;let{url:i}=e.request;e.respondWith(caches.open(r).then(o=>o.match(e.request).then(s=>s||fetch(e.request).then(n=>(c(`Network fetch: ${i}`),n.ok&&o.put(e.request,n.clone()),n)).catch(console.error))))});})();
