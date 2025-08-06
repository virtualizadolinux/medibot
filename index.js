const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');

require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

const channelId = process.env.CHANNEL_ID;

client.once('ready', () => {
    console.log(`✅ MediBot está online como ${client.user.tag}`);

    const channel = client.channels.cache.get(channelId);
    if (!channel) {
        console.error("❌ Canal não encontrado! Verifique o CHANNEL_ID.");
        return;
    }

    // 🕙 10:00
    cron.schedule('0 10 * * *', () => {
        channel.send('💊 Lembrete: Tomar o **remédio para falta de memória**.');
    }, {
        timezone: "America/Sao_Paulo"
    });

    // 🕑 14:00
    cron.schedule('0 14 * * *', () => {
        channel.send('💊 Lembrete: Tomar o **remédio de controle de gritos**.');
    }, {
        timezone: "America/Sao_Paulo"
    });

    // 🕖 19:00
    cron.schedule('0 19 * * *', () => {
        channel.send('💊 Lembrete: Tomar o **remédio do autismo**.');
    }, {
        timezone: "America/Sao_Paulo"
    });

});
client.login(process.env.TOKEN);
