import fetch from 'node-fetch';

const GNEWS_API_KEY = '4062dec5ad3c4197e17922fe1806cf11';
const INTERVAL = 1000 * 60 * 10;
const cache = {};

async function getNews(topic = 'calcio OR Serie A OR Champions League OR UEFA OR Sky Sport OR Gazzetta') {
  try {
    const res = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(topic)}&lang=it&max=6&apikey=${GNEWS_API_KEY}`);
    const json = await res.json();

    if (!json.articles || json.articles.length === 0) return null;

    let text = `📢 *Ultime Notizie Calcio – ${new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}*\n\n`;

    for (const a of json.articles) {
      text += `📰 *${a.title}*\n`;
      text += `📌 ${a.source.name} – 🕒 ${a.publishedAt.replace('T', ' ').replace('Z', '')}\n`;
      text += `🔗 ${a.url}\n\n`;
    }

    return text.trim();
  } catch (err) {
    console.error('Errore nel recupero delle news:', err);
    return '❌ Errore durante il recupero delle notizie.';
  }
}

let autoNewsHandler = async (m, { conn }) => {
  const id = m.chat;
  const now = Date.now();

  if (!cache[id] || now - cache[id] > INTERVAL) {
    const news = await getNews();
    if (news) {
      cache[id] = now;
      await conn.sendMessage(id, {
        text: news,
        footer: '🗞️ Powered by GNews • news automatica ogni 10 min',
        headerType: 1
      }, { quoted: m });
    }
  }
};
autoNewsHandler.all = autoNewsHandler;

// 🔘 Comando manuale .news
autoNewsHandler.command = /^news$/i;
autoNewsHandler.tags = ['news'];
autoNewsHandler.help = ['news'];
autoNewsHandler.disabled = false;

autoNewsHandler.handler = async (m, { conn }) => {
  const news = await getNews();
  await conn.sendMessage(m.chat, {
    text: news || '📭 Nessuna notizia trovata.',
    footer: '🗞️ Notizie richieste manualmente',
    headerType: 1
  }, { quoted: m });
};

export default autoNewsHandler;