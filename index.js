require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers
    ]
});

// IDs permitidos
const usuariosPermitidos = [
    '414636718235320341',
    '217817250709635074'
];

client.once('clientReady', () => {
    console.log(`Bot online: ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'mover') {

        // Bloqueia usuários não autorizados
        if (!usuariosPermitidos.includes(interaction.user.id)) {

            return interaction.reply({
                content: '❌ Você não possui permissão para usar este comando.',
                flags: 64
            });
        }

        const origem = interaction.options.getChannel('origem');
        const destino = interaction.options.getChannel('destino');

        if (!origem || !destino) {

            return interaction.reply({
                content: '❌ Canais inválidos.',
                flags: 64
            });
        }

        const membros = origem.members;

        let total = 0;

        const agora = new Date();

        const data =
            agora.toLocaleDateString(
                'pt-BR',
                {
                    timeZone: 'America/Sao_Paulo'
                }
            );

        const hora =
            agora.toLocaleTimeString(
                'pt-BR',
                {
                    timeZone: 'America/Sao_Paulo',
                    hour: '2-digit',
                    minute: '2-digit'
                }
            );

        // Nome personalizado
        let nomeDG = 'DG';

        if (interaction.user.id === '414636718235320341') {
            nomeDG = 'DG Guuzs';
        }

        if (interaction.user.id === '217817250709635074') {
            nomeDG = 'DG Geminha';
        }

        for (const [id, member] of membros) {

            try {

                await member.voice.setChannel(destino);

                total++;

                // Delay anti rate limit
                await new Promise(resolve =>
                    setTimeout(resolve, 250)
                );

            } catch (err) {

                console.log(
                    `Erro ao mover ${member.user.tag}:`,
                    err
                );
            }
        }

        // Canal principal da DG
        const canalLogs =
            interaction.guild.channels.cache.get('1504505938865033296');

        if (canalLogs) {

            const mensagem = await canalLogs.send({
                content: `## ${nomeDG}`
            });

            const thread = await mensagem.startThread({

                name:
                    `${nomeDG} • ${data} • ${hora}`,

                autoArchiveDuration: 1440
            });

            await thread.send({

                content:
`══════════════ 💰 ══════════════
      **O QUE CADA CLASSE DEVE LOOTEAR**
══════════════ 💰 ══════════════

👑 **Caller:** ${interaction.user}
*Sacolas de Prata | Mapas | Energias Avalonianas*

🛡️ **Off Tank:** @
*Bolsas*

⏳ **Arcano Elevado**:** @
*Capuz | Capote | Elmo*

💚 **Main Healer:** @
*Sapatos | Botas | Sandálias*

☠️ **Bruxo:** @
*Peitos T6 | Artefatos de Craft*

⚔️ **DPS 01:** @
*Armas Melee*

⚔️ **DPS 02:** @
*Armas Ranged*

⚔️ **DPS 03:** @
*Capas*

⚔️ **DPS 04:** @
*Off-hands*

⚔️ **DPS 05:** @
*Armadura | Casaco | Robe*

👀 **Scout:** @
*Sacolas do Chão | O que sobrar do baú*

══════════════════════════════════════════`
            });
        }

        // Canal DPS Meter
        const canalDps =
            interaction.guild.channels.cache.get('1509353909183971498');

        if (canalDps) {

            const mensagemDps = await canalDps.send({
                content: `## ${nomeDG}`
            });

            const threadDps = await mensagemDps.startThread({

                name:
                    `${nomeDG} • ${data} • ${hora}`,

                autoArchiveDuration: 1440
            });

            await threadDps.send({

                content:
`${interaction.user}

Envie print e os dados do Dps Metter abaixo.`
            });
        }

        await interaction.reply({

            content:
                `✅ ${total} membros movidos.`,

            flags: 64
        });
    }
});

client.login(process.env.TOKEN);