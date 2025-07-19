//welcome creato da samakavare github.com/realvare
import { WAMessageStubType } from '@whiskeysockets/baileys';
import puppeteer from 'puppeteer';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groupBackgroundCache = new Map();
const profilePicCache = new Map();
const DEFAULT_AVATAR_URL = 'https://i.ibb.co/BKHtdBNp/default-avatar-profile-icon-1280x1280.jpg';

let defaultAvatarBuffer = null;
const preloadDefaultAvatar = async () => {
    if (!defaultAvatarBuffer) {
        try {
            const res = await fetch(DEFAULT_AVATAR_URL);
            if (res.ok) defaultAvatarBuffer = Buffer.from(await res.arrayBuffer());
        } catch (error) {
            console.error('Errore nel precaricamento avatar di default:', error);
        }
    }
};

preloadDefaultAvatar();

async function getUserName(conn, jid, pushNameFromStub = '') {
    const isValid = str => str && typeof str === 'string' && str.length > 1 && str.length < 26 && !/^\d+$/.test(str);
    
    if (isValid(pushNameFromStub)) return pushNameFromStub;
    
    const contact = conn.contacts?.[jid];
    if (contact) {
        if (isValid(contact.notify)) return contact.notify;
        if (isValid(contact.name)) return contact.name;
        if (isValid(contact.pushName)) return contact.pushName;
        if (isValid(contact.verifiedName)) return contact.verifiedName;
    }
    
    try {
        const nameFromApi = await Promise.race([
            conn.getName(jid),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout getName')), 1000))
        ]);
        if (isValid(nameFromApi)) return nameFromApi;
    } catch {}
    
    const phoneNumber = jid.split('@')[0];
    return `Utente ${phoneNumber}`;
}

async function getUserProfilePic(conn, jid) {
    if (profilePicCache.has(jid)) {
        return profilePicCache.get(jid);
    }
    
    try {
        const url = await Promise.race([
            conn.profilePictureUrl(jid, 'image'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout profile pic')), 1500))
        ]);
        
        if (url) {
            const res = await Promise.race([
                fetch(url),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetch')), 2000))
            ]);
            
            if (res.ok) {
                const buffer = Buffer.from(await res.arrayBuffer());
                profilePicCache.set(jid, buffer);
                return buffer;
            }
        }
    } catch {}
    
    if (defaultAvatarBuffer) {
        profilePicCache.set(jid, defaultAvatarBuffer);
        return defaultAvatarBuffer;
    }
    
    return null;
}

async function getGroupBackgroundImage(groupJid, conn) {
    if (groupBackgroundCache.has(groupJid)) return groupBackgroundCache.get(groupJid);
    
    let buffer = null;
    try {
        const url = await Promise.race([
            conn.profilePictureUrl(groupJid, 'image'),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout group pic')), 1500))
        ]).catch(() => null);
        
        if (url) {
            const res = await Promise.race([
                fetch(url),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetch group')), 2000))
            ]);
            if (res.ok) buffer = Buffer.from(await res.arrayBuffer());
        }
        
        if (!buffer) {
            const fallback = path.join(__dirname, '..', 'media', 'benvenuto-addio.jpg');
            buffer = await fs.readFile(fallback);
        }
        
        groupBackgroundCache.set(groupJid, buffer);
        return buffer;
    } catch {
        return null;
    }
}

const WelcomeCard = ({
    backgroundUrl,
    pfpUrl,
    isGoodbye,
    username,
    groupName
}) => {
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Noto+Sans:wght@700&family=Roboto:wght@700&family=Open+Sans:wght@700&family=Lato:wght@700&family=Montserrat:wght@700&family=Inter:wght@700&family=Ubuntu:wght@700&family=Source+Sans+Pro:wght@700&family=Nunito:wght@700&family=Raleway:wght@700&family=Oswald:wght@700&family=PT+Sans:wght@700&family=Merriweather:wght@700&family=Playfair+Display:wght@700&family=Fira+Sans:wght@700&family=Work+Sans:wght@700&family=Kanit:wght@700&display=swap');
        
        body { margin: 0; }
        
        #root {
            width: 3200px;
            height: 1600px;
            position: relative;
            overflow: hidden;
            font-family: 'Poppins', 'Noto Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Inter', 'Ubuntu', 'Source Sans Pro', 'Nunito', 'Raleway', 'Oswald', 'PT Sans', 'Merriweather', 'Playfair Display', 'Fira Sans', 'Work Sans', 'Kanit', 'Segoe UI', 'Helvetica Neue', 'Arial', 'DejaVu Sans', 'Liberation Sans', 'Nimbus Sans L', 'Lucida Grande', 'Tahoma', 'Verdana', 'Geneva', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium', 'Trebuchet MS', 'Arial Unicode MS', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', 'Droid Sans', 'Droid Serif', 'Times New Roman', 'Times', 'serif', sans-serif;
            background-color: #333;
        }
        .background {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url(${backgroundUrl || ''});
            background-size: cover;
            background-position: center;
            filter: blur(14px);
            transform: scale(1.15);
        }
        .card {
            position: absolute;
            top: 120px; bottom: 120px; left: 140px; right: 140px;
            background-color: rgba(40, 40, 40, 0.88);
            border-radius: 40px;
            box-shadow: 0 0 35px rgba(0, 0, 0, 0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            padding: 90px 0;
            box-sizing: border-box;
        }
        .pfp-container {
            margin-bottom: 60px;
        }
        .pfp {
            width: 420px;
            height: 420px;
            border-radius: 50%;
            border: 18px solid #FFF;
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.95);
            object-fit: cover;
        }
        .text-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            text-align: center;
            transform: translateY(-80px);
        }
        .title {
            font-size: 185px;
            font-weight: 700;
            text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 255, 255, 0.9);
            margin: 0;
            font-family: 'Poppins', 'Noto Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Inter', 'Ubuntu', 'Source Sans Pro', 'Nunito', 'Raleway', 'Oswald', 'PT Sans', 'Merriweather', 'Playfair Display', 'Fira Sans', 'Work Sans', 'Kanit', 'Segoe UI', 'Helvetica Neue', 'Arial', 'DejaVu Sans', 'Liberation Sans', 'Nimbus Sans L', 'Lucida Grande', 'Tahoma', 'Verdana', 'Geneva', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium', 'Trebuchet MS', 'Arial Unicode MS', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', 'Droid Sans', 'Droid Serif', 'Times New Roman', 'Times', 'serif', sans-serif;
        }
        .username {
            font-size: 140px;
            font-weight: 700;
            text-shadow: 6px 6px 12px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 255, 255, 0.8);
            margin: 20px 0 0 0;
            transform: translateY(-40px);
            font-family: 'Poppins', 'Noto Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Inter', 'Ubuntu', 'Source Sans Pro', 'Nunito', 'Raleway', 'Oswald', 'PT Sans', 'Merriweather', 'Playfair Display', 'Fira Sans', 'Work Sans', 'Kanit', 'Segoe UI', 'Helvetica Neue', 'Arial', 'DejaVu Sans', 'Liberation Sans', 'Nimbus Sans L', 'Lucida Grande', 'Tahoma', 'Verdana', 'Geneva', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium', 'Trebuchet MS', 'Arial Unicode MS', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', 'Droid Sans', 'Droid Serif', 'Times New Roman', 'Times', 'serif', sans-serif;
        }
        .group-name {
            font-size: 125px;
            font-weight: 700;
            color: #ffffff;
            text-shadow: 5px 5px 10px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.7);
            margin: 15px 0 0 0;
            transform: translateY(-30px);
            font-family: 'Poppins', 'Noto Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Inter', 'Ubuntu', 'Source Sans Pro', 'Nunito', 'Raleway', 'Oswald', 'PT Sans', 'Merriweather', 'Playfair Display', 'Fira Sans', 'Work Sans', 'Kanit', 'Segoe UI', 'Helvetica Neue', 'Arial', 'DejaVu Sans', 'Liberation Sans', 'Nimbus Sans L', 'Lucida Grande', 'Tahoma', 'Verdana', 'Geneva', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium', 'Trebuchet MS', 'Arial Unicode MS', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', 'Droid Sans', 'Droid Serif', 'Times New Roman', 'Times', 'serif', sans-serif;
        }
        .footer {
            position: absolute;
            bottom: 8px;
            font-size: 90px;
            font-weight: 700;
            text-shadow: 4px 4px 8px rgba(0, 0, 0, 0.6);
            color: #ffffff;
            font-family: 'Poppins', 'Noto Sans', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Inter', 'Ubuntu', 'Source Sans Pro', 'Nunito', 'Raleway', 'Oswald', 'PT Sans', 'Merriweather', 'Playfair Display', 'Fira Sans', 'Work Sans', 'Kanit', 'Segoe UI', 'Helvetica Neue', 'Arial', 'DejaVu Sans', 'Liberation Sans', 'Nimbus Sans L', 'Lucida Grande', 'Tahoma', 'Verdana', 'Geneva', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium', 'Trebuchet MS', 'Arial Unicode MS', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Android Emoji', 'EmojiOne Color', 'Twemoji Mozilla', 'Droid Sans', 'Droid Serif', 'Times New Roman', 'Times', 'serif', sans-serif;
        }
        .stars-decoration {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .star {
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
            animation: twinkle 2s ease-in-out infinite alternate;
        }
        .star:nth-child(1) { top: 15%; left: 10%; animation-delay: 0s; }
        .star:nth-child(2) { top: 25%; left: 85%; animation-delay: 0.3s; }
        .star:nth-child(3) { top: 35%; left: 5%; animation-delay: 0.6s; }
        .star:nth-child(4) { top: 45%; left: 90%; animation-delay: 0.9s; }
        .star:nth-child(5) { top: 55%; left: 8%; animation-delay: 1.2s; }
        .star:nth-child(6) { top: 65%; left: 87%; animation-delay: 1.5s; }
        .star:nth-child(7) { top: 75%; left: 12%; animation-delay: 1.8s; }
        .star:nth-child(8) { top: 85%; left: 88%; animation-delay: 2.1s; }
        .star:nth-child(9) { top: 20%; left: 20%; animation-delay: 0.4s; }
        .star:nth-child(10) { top: 30%; left: 75%; animation-delay: 0.7s; }
        .star:nth-child(11) { top: 40%; left: 15%; animation-delay: 1s; }
        .star:nth-child(12) { top: 50%; left: 80%; animation-delay: 1.3s; }
        .star:nth-child(13) { top: 60%; left: 18%; animation-delay: 1.6s; }
        .star:nth-child(14) { top: 70%; left: 82%; animation-delay: 1.9s; }
        .star:nth-child(15) { top: 80%; left: 22%; animation-delay: 2.2s; }
        .star:nth-child(16) { top: 90%; left: 78%; animation-delay: 2.5s; }
        
        @keyframes twinkle {
            0% { opacity: 0.3; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1.2); }
        }
    `;

    const titleText = isGoodbye ? '𝐀𝐃𝐃𝐈𝐎.ᐟ' : '𝐁𝐄𝐍𝐕𝐄𝐍𝐔𝐓𝐎.ᐟ';
    
    const stars = Array.from({ length: 16 }, (_, i) => 
        React.createElement('div', { key: i, className: 'star' })
    );
    
    return React.createElement('html', { lang: 'it' },
        React.createElement('head', null,
            React.createElement('style', { dangerouslySetInnerHTML: { __html: styles } })
        ),
        React.createElement('body', null,
            React.createElement('div', { id: 'root' },
                React.createElement('div', { className: 'background' }),
                React.createElement('div', { className: 'stars-decoration' }, ...stars),
                React.createElement('div', { className: 'card' },
                    React.createElement('div', { className: 'pfp-container' },
                        React.createElement('img', { src: pfpUrl, className: 'pfp', alt: 'Profile Picture' })
                    ),
                    React.createElement('div', { className: 'text-container' },
                        React.createElement('h1', { className: 'title' }, titleText),
                        React.createElement('h2', { className: 'username' }, `${username}`),
                        React.createElement('p', { className: 'group-name' }, `${groupName}` || '.ᐟ')
                    ),
                    React.createElement('div', { className: 'footer' },
                        '⭒─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ✦⋆⁺₊✧ 𝓿𝓪𝓻𝓮𝓫𝓸𝓽 ✧₊⁺⋆✦─ׄ─ׅ─ׄ⭒─ׄ─ׅ─ׄ⭒'
                    )
                )
            )
        )
    );
};

let browserPool = [];
const MAX_BROWSER_INSTANCES = 2;

async function getBrowser() {
    if (browserPool.length > 0) {
        return browserPool.pop();
    }
    
    return await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-default-apps',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-sync',
            '--disable-translate',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-ipc-flooding-protection'
        ],
        headless: true,
        defaultViewport: { width: 3200, height: 1600 }
    });
}

async function releaseBrowser(browser) {
    if (browserPool.length < MAX_BROWSER_INSTANCES) {
        browserPool.push(browser);
    } else {
        await browser.close();
    }
}

async function createImage(title, username, groupName, profilePicBuffer, isGoodbye, groupJid, who, conn) {
    let browser;
    try {
        const [backgroundBuffer, defaultPfpBuffer] = await Promise.all([
            getGroupBackgroundImage(groupJid, conn),
            defaultAvatarBuffer || (await fetch(DEFAULT_AVATAR_URL)).buffer()
        ]);
        
        const backgroundUrl = backgroundBuffer ? `data:image/jpeg;base64,${backgroundBuffer.toString('base64')}` : '';
        const pfpUrl = profilePicBuffer ? 
            `data:image/jpeg;base64,${profilePicBuffer.toString('base64')}` : 
            `data:image/jpeg;base64,${defaultPfpBuffer.toString('base64')}`;
        
        const element = React.createElement(WelcomeCard, {
            backgroundUrl,
            pfpUrl,
            isGoodbye,
            username,
            groupName,
        });
        const html = ReactDOMServer.renderToStaticMarkup(element);
        
        browser = await getBrowser();
        const page = await browser.newPage();
        
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font') {
                req.continue();
            } else if (req.url().includes('googleapis.com') || req.url().includes('gstatic.com') || req.url().includes('fonts.gstatic.com')) {
                req.continue();
            } else if (req.resourceType() === 'image' && req.url().startsWith('data:')) {
                req.continue();
            } else {
                req.abort();
            }
        });
        
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.evaluateHandle('document.fonts.ready');
        
        const rootElement = await page.$('#root');
        if (!rootElement) throw new Error(`${global.errore}`);

        const imageBuffer = await rootElement.screenshot({ 
            type: 'png',
            optimizeForSpeed: true
        });
        
        await page.close();
        await releaseBrowser(browser);
        
        return imageBuffer;
    } catch (error) {
        console.error("Errore durante la creazione dell'immagine con Puppeteer:", error);
        if (browser) {
            try {
                await browser.close();
            } catch (closeError) {
                console.error("Errore durante la chiusura del browser:", closeError);
            }
        }
        return null;
    }
}

const requestCounter = { count: 0, lastReset: Date.now(), isBlocked: false, blockUntil: 0 };

function checkAntiSpam() {
    const now = Date.now();
    if (now - requestCounter.lastReset > 30000) {
        requestCounter.count = 0;
        requestCounter.lastReset = now;
    }
    if (requestCounter.isBlocked) {
        if (now < requestCounter.blockUntil) return false;
        requestCounter.isBlocked = false;
        requestCounter.count = 0;
    }
    requestCounter.count++;
    if (requestCounter.count > 12) {
        requestCounter.isBlocked = true;
        requestCounter.blockUntil = now + 30000;
        return false;
    }
    return true;
}

export async function before(m, { conn, groupMetadata }) {
    if (!m.isGroup || !m.messageStubType) return true;
    if (!checkAntiSpam()) return true;
    
    const chat = global.db?.data?.chats?.[m.chat];
    if (!chat || chat.welcome === false) return true;
    
    const who = m.messageStubParameters?.[0];
    const pushNameFromStub = m.messageStubParameters?.[1];
    if (!who || typeof who !== 'string' || !who.includes('@')) return true;
    
    try {
        const [username, profilePic] = await Promise.all([
            getUserName(conn, who, pushNameFromStub),
            Promise.race([
                getUserProfilePic(conn, who),
                new Promise(resolve => setTimeout(() => resolve(null), 3000))
            ])
        ]);
        
        const groupJid = m.chat;
        const groupName = groupMetadata?.subject || '㌌';
        const memberCount = groupMetadata?.participants?.length || 0;
        
        let displayName = username;
        if (username.startsWith('@') || username === '𝐍𝐮𝐨𝐯𝐨 𝐌𝐞𝐦𝐛𝐫𝐨') {
            displayName = `${who.split('@')[0]}`;
        }
        
        const sendWelcomeMessage = async (isGoodbye = false) => {
            const caption = isGoodbye ?
                `*\`Addio\`* @${who.split('@')[0]} 👋\n┊ _Ha abbandonato il gruppo_\n╰► *\`Membri\`* ${memberCount - 1}` :
                `*\`Benvenuto/a\`* @${who.split('@')[0]} *✧*\n┊ *\`In\`* *${groupName}*\n*╰►* *\`Membri:\`* ${memberCount + 1}`;
            try {
                const image = await Promise.race([
                    createImage(
                        isGoodbye ? 'GOODBYE' : 'WELCOME',
                        displayName,
                        groupName,
                        profilePic,
                        isGoodbye,
                        groupJid,
                        who,
                        conn
                    ),
                    new Promise((_, reject) => setTimeout(() => reject(new Error(`${global.errore}`)), 8000))
                ]);
                
                if (image) {
                    await conn.sendMessage(m.chat, {
                        image,
                        caption,
                        mentions: [who]
                    });
                } else {
                    throw new Error(`${global.errore}`);
                }
            } catch (err) {
                console.error("Fallback a messaggio di testo:", err.message);
                await conn.sendMessage(m.chat, {
                    text: caption,
                    mentions: [who]
                });
            }
        };

        if (
            m.messageStubType === WAMessageStubType.GROUP_PARTICIPANT_ADD ||
            m.messageStubType === 'GROUP_MEMBERSHIP_JOIN_APPROVAL_REQUEST_NON_ADMIN_ADD'
        ) {
            await sendWelcomeMessage(false);
        } else if (
            [WAMessageStubType.GROUP_PARTICIPANT_REMOVE, WAMessageStubType.GROUP_PARTICIPANT_LEAVE].includes(m.messageStubType)
        ) {
            await sendWelcomeMessage(true);
        }
    } catch (error) {
        console.error('Errore nel gestore `before` di benvenuto:', error);
    }
    
    return true;
}

setInterval(() => {
    const now = Date.now();
    for (const [key, value] of profilePicCache.entries()) {
        if (now - value.timestamp > 300000) {
            profilePicCache.delete(key);
        }
    }
}, 60000);