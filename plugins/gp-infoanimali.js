import axios from 'axios';

const infoAnimalePlugin = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `﹒⋆❛ ${usedPrefix + command} <nome animale>\n❥ Per favore indica un animale di cui vuoi informazioni!\nEsempio: *${usedPrefix + command} fennec*`, m);
  }

  const animale = text.trim();

  const prompt = `
Crea una scheda informativa decorata e leggibile per l'animale "*${animale}*".

❥ Il tono deve essere divulgativo ma leggero. Usa simboli estetici ma non esagerati.
❥ Rispondi sempre in italiano.
❥ Il formato deve essere **esattamente** questo (modifica solo i dati reali, non lo stile):

·´¯\` ˚｡⋆『 ˗ˏˋ${animale.toUpperCase()}ˎˊ˗ 』⋆｡˚⟡´¯\`·.

🦊 *Nome comune:* ${animale}
📚 *Nome scientifico:* (es. Vulpes vulpes)
🌍 *Habitat:* (es. Foreste temperate, deserti, savane...)
🍽️ *Dieta:* (erbivoro, onnivoro, carnivoro – dettaglia con esempi)
📏 *Dimensioni:* (lunghezza/peso medio)
🧠 *Comportamento:* (solitario, sociale, notturno, ecc.)
🎨 *Caratteristiche:* (es. pelo, becco, artigli, dentatura...)

╭─❍ 『 💫 』 *CURIOSITÀ*
│• Inserisci 2-3 curiosità interessanti e brevi
╰───────────────

⚠️ *Stato di conservazione:* (es. a rischio minimo / vulnerabile / in pericolo)

⋆ ˚｡✦ *Fonte dati: AI Zoologica*
⋆ ˚｡✦ *Consulta sempre fonti ufficiali per ricerche accademiche*

𖦹﹒✧･ﾟﾟ･:*:･ﾟ✧﹒𖦹
> 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐝 𝐛𝐲 𝐜𝐡𝐚𝐭𝐮𝐧𝐢𝐭𝐲 ✦
`;

  try {
    await conn.sendPresenceUpdate('composing', m.chat);
    const res = await axios.post("https://luminai.my.id", {
      content: prompt,
      user: m.pushName || "utente",
      prompt: `Rispondi sempre in italiano.`,
      webSearchMode: false
    });

    const risposta = res.data.result;
    if (!risposta) throw new Error("Risposta vuota dall'API.");

    return await conn.reply(m.chat, risposta, m);

  } catch (err) {
    console.error('[❌ infoanimale plugin errore]', err);
    return await conn.reply(m.chat, '⚠️ Errore durante l’elaborazione della scheda animale. Riprova più tardi.', m);
  }
};

infoAnimalePlugin.help = ['infoanimale <animale>'];
infoAnimalePlugin.tags = ['animali', 'ai', 'divulgazione'];
infoAnimalePlugin.command = /^infoanimale$/i;

export default infoAnimalePlugin;