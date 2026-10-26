const SUM_MODEL='facebook/bart-large-cnn';
async function summarize(text){const r=await fetch('https://api-inference.huggingface.co/models/'+SUM_MODEL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({inputs:text,options:{wait_for_model:true}})});
if(r.status===429)throw new Error('Rate limit reached. Try again shortly.');if(!r.ok)throw new Error('Summarization model is unavailable.');const j=await r.json();return j[0].summary_text}
