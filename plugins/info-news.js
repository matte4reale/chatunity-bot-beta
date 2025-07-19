import fetch from 'node-fetch';

const GNEWS_API_KEY = '4062dec5ad3c4197e17922fe1806cf11';

async function getNews() {
  try {
    const res = await fetch(`https://gnews.io/api/v4/search?q=calcio&lang=it&max=5&apikey=${GNEWS_API_KEY}`);
    const json = await res.json();
    if (!json.articles || json.articles.length === 0) return null;

    let text = `📢 *Ultime Notizie Calcio*\n\n`;
    for (const a of json.articles) {
      text += `📰 *${a.title}*\n📌 ${a.source.name}\n🔗 ${a.url}\n\n`;
    }

    return text;
  } catch (e) {
    console.error('Errore fetch news:', e);
    return null;
  }
}

let handler = async (m, { conn }) => {
  const news = await getNews();
  if (!news) return m.reply('❌ Nessuna news trovata.');
  return conn.sendMessage(m.chat, { text: news }, { quoted: m });
};

handler.command = /^news$/i;
handler.help = ['news'];
handler.tags = ['news'];
export default handler;