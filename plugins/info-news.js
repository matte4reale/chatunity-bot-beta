const sources = [
  { name: 'Gazzetta', url: 'https://www.gazzetta.it/rss/Calcio.xml' },
  { name: 'Tuttosport', url: 'https://www.tuttosport.com/rss/calcio.xml' },
  { name: 'Corriere dello Sport', url: 'https://www.corrieredellosport.it/rss/calcio' }
];

async function getNews() {
  const news = [];

  for (const src of sources) {
    try {
      const res = await fetch(src.url);
      const xml = await res.text();

      const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 3);

      for (const item of items) {
        const titleMatch = item[1].match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item[1].match(/<title>(.*?)<\/title>/);
        const linkMatch = item[1].match(/<link>(.*?)<\/link>/);

        if (titleMatch && linkMatch) {
          news.push({
            title: titleMatch[1].trim(),
            link: linkMatch[1].trim(),
            source: src.name
          });
        }
      }
    } catch (e) {
      console.error(`❌ Errore su ${src.name}:`, e.message);
    }
  }

  if (!news.length) return null;

  let text = `📢 *Ultime Notizie Calcio (Italia)*\n\n`;
  for (const n of news.slice(0, 5)) {
    text += `📰 *${n.title}*\n📌 ${n.source}\n🔗 ${n.link}\n\n`;
  }

  return text.trim();
}

let handler = async (m, { conn }) => {
  try {
    const news = await getNews();
    if (news) {
      await conn.sendMessage(m.chat, {
        text: news,
        footer: '🔧 Developed by Matte',
        headerType: 1
      }, { quoted: m });
    } else {
      await m.reply('📭 Nessuna notizia trovata al momento.');
    }
  } catch (err) {
    console.error('❌ Errore durante l\'invio delle notizie:', err);
    await m.reply('⚠️ Si è verificato un errore durante il recupero delle notizie.');
  }
};

handler.command = /^news$/i;
handler.tags = ['news'];
handler.help = ['news'];

export default handler;