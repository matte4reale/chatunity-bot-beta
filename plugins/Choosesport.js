let handler = async (m, { args }) => {
  const sport = args[0]?.toLowerCase();
  const valid = ['calcio', 'basket', 'tennis', 'formula1', 'mma', 'ciclismo'];

  if (!valid.includes(sport)) return m.reply('❌ Sport non valido.');

  global.db.data.users[m.sender] = global.db.data.users[m.sender] || {};
  global.db.data.users[m.sender].preferredSport = sport;

  return m.reply(`✅ Hai impostato il tuo sport preferito su *${sport.toUpperCase()}*! Usa ora .news`);
};

handler.command = /^chooseSport$/i;
handler.help = ['chooseSport <sport>'];
handler.tags = ['settings'];
export default handler;
