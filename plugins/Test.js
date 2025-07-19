const INTERVAL = 10 * 60 * 1000;
const cache = {};

const sources = [
  { name: 'Sky Sport', url: 'https://rss.skysports.com/rss/football.xml' },
  { name: 'Gazzetta', url: 'https://www.gazzetta.it/rss/Calcio.xml' },
  { name: 'UEFA.com', url: 'https://www.uefa.com/rssfeed/news/rss.xml' }
];

async function getNews() {
  let news = [];

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
            title: titleMatch[1],
            link: linkMatch[1],
            source: src.name
          });
        }
      }
    } catch (e) {
      console.error(`❌ Errore su ${src.name}:`, e.message);
    }
  }

  if (!news.length) return null;

  let text = `📢 *Ultime Notizie Calcio (RSS)*\n\n`;
  for (const n of news.slice(0, 5)) {
    text += `📰 *${n.title}*\n📌 ${n.source}\n🔗 ${n.link}\n\n`;
  }

  return text.trim();
}

let handler = async (m, { conn }) => {
  const id = m.chat;
  const now = Date.now();

  if (!cache[id] || now - cache[id] > INTERVAL) {
    const news = await getNews();
    if (news) {
      cache[id] = now;
      await conn.sendMessage(id, {
        text: news,
        footer: '🗞️ Notizie automatiche (senza API)',
        headerType: 1
      }, { quoted: m });
    }
  }
};
handler.all = handler;

handler.command = /^news$/i;
handler.tags = ['news'];
handler.help = ['news'];
handler.handler = async (m, { conn }) => {
  const news = await getNews();
  if (news) {
    await conn.sendMessage(m.chat, {
      text: news,
      footer: '🗞️ Notizie richieste manualmente',
      headerType: 1
    }, { quoted: m });
  } else {
    m.reply('📭 Nessuna notizia trovata al momento.');
  }
};

export default handler;
