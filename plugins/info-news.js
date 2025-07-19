const allSources = {
  calcio: [
    { name: 'Gazzetta', url: 'https://www.gazzetta.it/rss/Calcio.xml' },
    { name: 'Tuttosport', url: 'https://www.tuttosport.com/rss/calcio.xml' },
    { name: 'Corriere dello Sport', url: 'https://www.corrieredellosport.it/rss/calcio' }
  ],
  basket: [
    { name: 'Sky Sport - Basket', url: 'https://sport.sky.it/rss/basket.xml' }
  ],
  tennis: [
    { name: 'Ubitennis', url: 'https://www.ubitennis.com/feed/' }
  ],
  formula1: [
    { name: 'FormulaPassion', url: 'https://formulapassion.it/feed' }
  ],
  mma: [
    { name: 'MMA Mania', url: 'https://www.mmamania.com/rss/index.xml' }
  ],
  ciclismo: [
    { name: 'Tuttobiciweb', url: 'https://www.tuttobiciweb.it/rss' }
  ]
};

async function getNews(sport = 'calcio') {
  const sources = allSources[sport] || allSources['calcio'];
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
      console.error(`Errore su ${src.name}:`, e.message);
    }
  }

  if (!news.length) return null;

  let text = `📢 *Ultime Notizie ${sport.toUpperCase()}*\n\n`;
  for (const n of news.slice(0, 5)) {
    text += `📰 *${n.title}*\n📌 ${n.source}\n🔗 ${n.link}\n\n`;
  }

  return text.trim();
}

let handler = async (m, { conn }) => {
  const user = m.sender;
  const data = global.db.data.users[user] || {};
  const sport = data.preferredSport || 'calcio';

  const news = await getNews(sport);

  if (news) {
    await conn.sendMessage(m.chat, {
      text: news,
      footer: `🗞️ Notizie richieste manualmente • Sport: ${sport.toUpperCase()}`,
      headerType: 1
    }, { quoted: m });
  } else {
    m.reply('📭 Nessuna notizia trovata al momento.');
  }
};

handler.command = /^news$/i;
handler.tags = ['news'];
handler.help = ['news'];

export default handler;