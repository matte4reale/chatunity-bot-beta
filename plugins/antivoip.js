//Crediti By Gabs - AntiPaky Aggiornato. 

let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
    if (!m.isGroup) return !1
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[conn.user.jid] || {}
    if (isBotAdmin && chat.antivoip && !isAdmin && !isOwner && !isROwner && bot.restrict) {
        
        if (m.sender.startsWith('92')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('229')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('91')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('93')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('94')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('234')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('213')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('9')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('7')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('8')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('1')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('62')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('63')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('998')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('222')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('852')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('44')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('33')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('31')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('27')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('389')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }

        if (m.sender.startsWith('212')) {
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('34')) { // Spagna
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('351')) { // Portogallo
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('40')) { // Romania
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('30')) { // Grecia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('41')) { // Svizzera
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('43')) { // Austria
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('32')) { // Belgio
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('48')) { // Polonia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('46')) { // Svezia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('47')) { // Norvegia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('45')) { // Danimarca
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('358')) { // Finlandia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('353')) { // Irlanda
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('36')) { // Ungheria
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('359')) { // Bulgaria
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('385')) { // Croazia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('386')) { // Slovenia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('421')) { // Slovacchia
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
        if (m.sender.startsWith('420')) { // Repubblica Ceca
            let responseb = await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (responseb[0].status === "404") return
        }
    }
}
export default handler;
