const PARA_MODEL='humarin/chatgpt_paraphraser_on_T5_base';
async function paraphrase(text){const r=await fetch('https://api-inference.huggingface.co/models/'+PARA_MODEL,{method:'POST',headers:{'Content-Type':'application/json'},
body:JSON.stringify({inputs:text,parameters:{num_return_sequences:3,num_beams:5,max_length:256,do_sample:false},options:{wait_for_model:true}})});
if(r.status===429)throw new Error('Rate limit reached. Try again shortly.');if(r.status===401||r.status===403)throw new Error('This model needs sign-in on Hugging Face. See README to switch models.');
if(!r.ok)throw new Error('Paraphrase model is unavailable.');const j=await r.json();return j.map(x=>x.generated_text||x.summary_text).filter(Boolean)}
