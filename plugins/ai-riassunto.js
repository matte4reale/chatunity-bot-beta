import { chatgpt } from '../lib/openai.js';

let handler = async (m, { text, quoted }) => {
  let input = text || (quoted?.text || quoted?.body || '');

  if (!input || input.length < 20) {
    return m.reply('📌 *Usa il comando così:*\n\n• `.riassunto Questo è il testo da riassumere`\n• Oppure rispondi a un messaggio lungo con `.riassunto`');
  }

  if (input.length > 2500) {
    return m.reply('❌ Il messaggio è troppo lungo (max 2500 caratteri).');
  }

  let prompt = `Fai un riassunto chiaro, semplice e sintetico di questo testo:\n\n${input}`;
  try {
    let res = await chatgpt(prompt);
    return m.reply('📚 *Riassunto GPT:*\n\n' + res.trim());
  } catch (err) {
    console.error(err);
    return m.reply('❌ Errore nel generare il riassunto.');
  }
};

handler.help = ['riassunto <testo>'];
handler.tags = ['ai', 'tools'];
handler.command = /^riassunto$/i;

export default handler;