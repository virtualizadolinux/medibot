const { REST, Routes } = require('discord.js');

const commands = [
    {
        name: 'lembrar',
        description: 'Criar um lembrete',
        options: [
            {
                name: 'hora',
                type: 3,
                description: 'Ex: 18:00',
                required: true,
            },
            {
                name: 'mensagem',
                type: 3,
                description: 'O que lembrar',
                required: true,
            }
        ]
    },
{
    name: 'ver-tarefas',
    description: 'Ver os lembretes pendentes'
}
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registrando comandos...');
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            { body: commands }
        );
        console.log('✅ Comandos registrados com sucesso!');
    } catch (err) {
        console.error('Erro ao registrar comandos:', err);
    }
})();
