const fs=require('fs'),path=require('path'),http=require('http');
// baca file .env (tanpa library tambahan)
try{fs.readFileSync(path.join(__dirname,'.env'),'utf8').split(/\r?\n/).forEach(l=>{
  const m=l.match(/^\s*([\w.]+)\s*=\s*(.*?)\s*$/);
  if(m&&!l.trim().startsWith('#')&&!(m[1] in process.env))process.env[m[1]]=m[2].replace(/^["']|["']$/g,'');
})}catch(e){}
const chat=require('./api/chat.js');
const PORT=process.env.PORT||3000;
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  res.status=c=>{res.statusCode=c;return res};
  res.json=o=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(o))};
  if(req.url.startsWith('/api/chat')){
    let b='';req.on('data',d=>{b+=d;if(b.length>1e6)req.destroy()});
    req.on('end',()=>{try{req.body=JSON.parse(b||'{}')}catch(e){req.body={}}chat(req,res)});
    return;
  }
  let u;try{u=decodeURIComponent(req.url.split('?')[0])}catch(e){res.statusCode=400;return res.end('Bad request')}
  if(u==='/')u='/index.html';
  const root=path.join(__dirname,'public'),f=path.join(root,path.normalize(u));
  if(!f.startsWith(root)){res.statusCode=403;return res.end('Forbidden')}
  fs.readFile(f,(e,d)=>{
    if(e){res.statusCode=404;return res.end('Not found')}
    res.setHeader('Content-Type',MIME[path.extname(f).toLowerCase()]||'application/octet-stream');res.end(d);
  });
}).listen(PORT,()=>console.log('Lelouch AI jalan di http://localhost:'+PORT));
