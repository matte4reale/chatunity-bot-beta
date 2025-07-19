import React from 'react';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer';
import fs from 'fs';

// Costruzione del componente manuale (senza JSX)
const WelcomeCard = ({ name, group, avatar, text }) =>
  React.createElement('div', {
    style: {
      width: '800px',
      height: '400px',
      background: 'linear-gradient(to right, #8EC5FC, #E0C3FC)',
      borderRadius: '20px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      alignItems: 'center',
      padding: '30px',
      boxSizing: 'border-box'
    }
  }, [
    React.createElement('img', {
      key: 'avatar',
      src: avatar,
      style: {
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        marginRight: '30px',
        border: '4px solid white'
      }
    }),
    React.createElement('div', { key: 'text', style: { color: '#333' } }, [
      React.createElement('h1', { key: 'h1', style: { fontSize: '30px', margin: '0 0 10px' } }, `👋 Benvenuto, ${name}!`),
      React.createElement('h2', { key: 'h2', style: { fontSize: '24px', margin: '0 0 10px' } }, `nel gruppo: ${group}`),
      React.createElement('p', { key: 'p', style: { fontSize: '18px', margin: '10px 0 0' } }, text)
    ])
  ]);

export async function generateWelcomeImage({ name, group, avatar, text }, outputPath = 'welcome.png') {
  const html = ReactDOMServer.renderToStaticMarkup(
    WelcomeCard({ name, group, avatar, text })
  );

  const fullHTML = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="margin:0;padding:0;">${html}</body>
    </html>
  `;

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(fullHTML);
  const element = await page.$('body');
  await element.screenshot({ path: outputPath });
  await browser.close();

  return fs.readFileSync(outputPath);
}

if (require.main === module) {
  (async () => {
    const buffer = await generateWelcomeImage({
      name: 'Apoena',
      group: 'Famiglia 💖',
      avatar: 'https://i.imgur.com/UYiroysl.jpg',
      text: 'Benvenuto nel gruppo!'
    }, 'benvenuto-apoena.png');

    fs.writeFileSync('benvenuto-apoena.png', buffer);
    console.log('✅ Immagine creata con successo');
  })();
}