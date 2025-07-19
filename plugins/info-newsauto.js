const INTERVAL = 10 * 60 * 1000; 
const lastSent = {};

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

// Funzione per l’invio automatico (eseguita ogni messaggio da handler.js)
let autoHandler = async (m, conn) => {
  const chat = m.chat;
  const now = Date.now();

  if (!lastSent[chat] || now - lastSent[chat] >= INTERVAL) {
    const news = await getNews();
    if (news) {
      lastSent[chat] = now;
      await conn.sendMessage(chat, {
        text: news,
        footer: '🗞️ Notizie automatiche (ogni 10 minuti)',
        headerType: 1
      }, { quoted: m });
    }
  }
};

export default {
  all: autoHandler
};