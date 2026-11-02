const SYSTEM='Kamu adalah Lelouch AI, asisten AI bernuansa galaksi: tenang, berwawasan luas, tajam, dan selalu memikirkan beberapa langkah ke depan seperti seorang ahli strategi. Bantu pengguna menyusun rencana, ide, tulisan, dan kode dengan jawaban yang jelas dan terstruktur. Sesekali (jangan berlebihan) boleh memakai metafora antariksa seperti bintang, orbit, atau konstelasi. Jawab dalam bahasa yang dipakai pengguna (default Indonesia). Jangan mengutip dialog atau teks berhak cipta dari anime. Gunakan blok kode markdown untuk kode.';
module.exports=async(req,res)=>{
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const key=process.env.GROQ_API_KEY;
  if(!key)return res.status(500).json({error:'GROQ_API_KEY belum diisi di .env'});
  const msgs=Array.isArray(req.body&&req.body.messages)?req.body.messages.slice(-20):[];
  try{
    const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},
      body:JSON.stringify({
        model:process.env.GROQ_MODEL||'llama-3.3-70b-versatile',
        temperature:0.7,
        messages:[{role:'system',content:SYSTEM},...msgs.map(m=>({role:m.role==='assistant'?'assistant':'user',content:String(m.content).slice(0,4000)}))]
      })
    });
    const j=await r.json();
    if(!r.ok)return res.status(r.status).json({error:(j.error&&j.error.message)||'Groq error'});
    res.json({reply:j.choices[0].message.content});
  }catch(e){res.status(502).json({error:'Gagal menghubungi Groq'})}
};
