const { SlashCommandBuilder } = require('discord.js');

export default {
    commands: [{
        data: new SlashCommandBuilder()
            .setName('set_book_progress')
            .setDescription('Set the current chapter of the book that is in progress')
            .addIntegerOption((option: any) =>
                option.setName("current_chapter")
                    .setDescription("the current chapter of the book you're on")
                    .setRequired(true)
            ),
    }, {
        data: new SlashCommandBuilder()
            .setName('next_chapter')
            .setDescription('Progress on the current book 1 chapter'),
    }, {
        data: new SlashCommandBuilder()
            .setName('curr_progress')
            .setDescription('Show your progress of the current book'),
    }
    ]
};