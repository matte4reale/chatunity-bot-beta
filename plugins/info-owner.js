import fs from 'fs';

let handler = async function (m, { conn }) {
  const data = global.owner.filter(([id, isCreator]) => id && isCreator);

  const contactsToSend = data.map(([id, name]) => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;type=CELL;type=VOICE;waid=${id.replace('@s.whatsapp.net','')}:${id.replace('@s.whatsapp.net','')}
END:VCARD`.replace(/\n/g, '\r\n');

    return {
      displayName: name,
      vcard
    };
  });

  await conn.sendMessage(m.chat, {
    contacts: {
      displayName: 'Proprietari di questo bot',
      contacts: contactsToSend
    }
  }, { quoted: m });
};

handler.help = ['owner'];
handler.tags = ['main'];
handler.command = ['padroni','owner'];
export default handler;