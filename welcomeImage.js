import React from 'react';
import ReactDOMServer from 'react-dom/server';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Component React per benvenuto
const WelcomeCard = ({ name, group, avatar, text }) => (
  <div style={{
    width: '800px',
    height: '400px',
    background: 'linear-gradient(to right, #8EC5FC, #E0C3FC)',
    borderRadius: '20px',
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    padding: '30px',
    boxSizing: 'border-box'
  }}>
    <img src={avatar} alt="avatar" style={{
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      marginRight: '30px',
      border: '4px solid white'
    }} />
    <div style={{ color: '#333' }}>
      <h1 style={{ margin: '0 0 10px', fontSize: '30px' }}>👋 Benvenuto, {name}!</h1>
      <h2 style={{ margin: '0 0 10px', fontSize: '24px' }}>nel gruppo: <strong>{group}</strong></h2>
      <p style={{ margin: '10px 0 0', fontSize: '18px' }}>{text}</p>
    </div>
  </div>
);

// Funzione principale
export async function generateWelcomeImage({ name, group, avatar, text }, outputPath = 'welcome.png') {
  const html = ReactDOMServer.renderToStaticMarkup(
    <WelcomeCard name={name} group={group} avatar={avatar} text={text} />
  );

  const fullHTML = `
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="margin: 0; padding: 0;">
        ${html}
      </body>
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

// Esempio test
if (require.main === module) {
  (async () => {
    const imgBuffer = await generateWelcomeImage({
      name: 'Apoena',
      group: 'Famiglia ❤️',
      avatar: 'https://i.imgur.com/UYiroysl.jpg',
      text: 'Siamo felici che tu sia qui!'
    }, 'output.png');

    fs.writeFileSync('final-welcome.png', imgBuffer);
    console.log('✅ Immagine di benvenuto salvata come final-welcome.png');
  })();
}