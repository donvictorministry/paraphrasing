import { buildAlternatives } from './rewrite.js';

/**
 * Paraphrasing Engine
 * Tries the free Hugging Face model for the first two alternatives, and fills the rest
 * (or everything, if the model is unavailable) with the offline sentence-level rewriter.
 * Always returns four labelled alternatives: Standard, Fluent, Formal, Concise.
 */
export async function getParaphrasedAlternatives(text) {
  if (!text || text.trim().length === 0) {
    throw new Error('Please enter text to paraphrase.');
  }

  const local = buildAlternatives(text);
  let model = [];
  try {
    const hfRes = await fetch('https://api-inference.huggingface.co/models/Vamsi/T5_Paraphrase_Paws', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: `paraphrase: ${text} </s>`, parameters: { num_return_sequences: 2, num_beams: 6 } })
    });
    if (hfRes.ok) {
      const data = await hfRes.json();
      if (Array.isArray(data)) {
        model = data.map(d => (d.generated_text || '').replace(/^paraphrased:\s*/i, '').trim()).filter(Boolean);
      }
    }
  } catch (e) {
    console.warn('Public HF model unavailable, using offline rewriter');
  }

  const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
  const seen = new Set([norm(text)]);
  return local.map((alt, i) => {
    let candidate = i < 2 && model[i] ? model[i] : alt.text;
    if (seen.has(norm(candidate))) candidate = alt.text;
    seen.add(norm(candidate));
    return { label: alt.label, text: candidate };
  });
}
