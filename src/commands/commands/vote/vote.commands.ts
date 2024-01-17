const { SlashCommandBuilder } = require('discord.js');

export default {
	commands: [{
		data: new SlashCommandBuilder()
			.setName('vote_book')
			.setDescription('vote for a book')
			.addIntegerOption((option: any) =>
				option.setName("book_id")
					.setDescription("book id (from the list) to add to the elections")
			)
	},]
};