const { SlashCommandBuilder } = require('discord.js');

export default {
    commands: [{
        data: new SlashCommandBuilder()
            .setName('show_current_book')
            .setDescription('Show the book we are currently reading')
    },]
};