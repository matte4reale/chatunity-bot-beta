import { generateWelcomeImage } from '../welcomeImage.js';
import { writeFileSync } from 'fs';

conn.on('group-participants-update', async (update) => {
  if (update.action === 'add') {
    const name = await conn.getName(update.participants[0]);
    const group = await conn.getName(update.id);
    const avatar = await conn.profilePictureUrl(update.participants[0], 'image').catch(() => 'https://i.imgur.com/UYiroysl.jpg');

    const imageBuffer = await generateWelcomeImage({
      name,
      group,
      avatar,
      text: 'Benvenuto nel gruppo!'
    });

    await conn.sendFile(update.id, imageBuffer, 'welcome.jpg', `👋 Benvenuto *${name}*!`, update.participants[0]);
  }
});