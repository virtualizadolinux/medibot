const { Client, GatewayIntentBits, Routes, Partials, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const { REST } = require('@discordjs/rest');
const db = require('./database');
require('dotenv').config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    partials: [Partials.Channel]
});

const token = process.env.TOKEN;
const channelId = process.env.CHANNEL_ID;

const commands = [
    new SlashCommandBuilder()
    .setName('lembrar')
    .setDescription('Cria um lembrete no formato HH:MM tarefa')
    .addStringOption(option =>
    option.setName('horario').setDescription('Horário (ex: 18:00)').setRequired(true))
    .addStringOption(option =>
    option.setName('mensagem').setDescription('Mensagem do lembrete').setRequired(true)),

    new SlashCommandBuilder()
    .setName('ver-tarefas')
    .setDescription('Ver todos os lembretes cadastrados')
];

const rest = new REST({ version: '10' }).setToken(token);

client.once(Events.ClientReady, async () => {
    console.log(`✅ MediBot está online como ${client.user.tag}`);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
                       { body: commands }
        );
        console.log('✅ Comandos registrados!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }

    setInterval(async () => {
        const agora = new Date();
        const hora = agora.toTimeString().slice(0, 5);

        const lembretes = await db.getLembretesPorHora(hora);

        for (const lembrete of lembretes) {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId(`feita_${lembrete.id}`)
                .setLabel('✅ Marcar como feita')
                .setStyle(ButtonStyle.Success)
            );

            const canal = await client.channels.fetch(channelId);
            if (canal) {
                canal.send({ content: `
