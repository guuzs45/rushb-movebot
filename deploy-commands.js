require('dotenv').config();

const {
    REST,
    Routes,
    SlashCommandBuilder
} = require('discord.js');

const commands = [

    new SlashCommandBuilder()
        .setName('mover')
        .setDescription('Move membros')
        .addChannelOption(option =>
            option.setName('origem')
                .setDescription('Canal origem')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('destino')
                .setDescription('Canal destino')
                .setRequired(true))

].map(command => command.toJSON());

const rest = new REST({ version: '10' })
    .setToken(process.env.TOKEN);

rest.put(
    Routes.applicationCommands('1505958111989600256'),
    { body: commands }
)
.then(() => console.log('Comando registrado'))
.catch(console.error);