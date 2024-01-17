const { SlashCommandBuilder } = require('discord.js');

export default {
	commands: [{
		data: new SlashCommandBuilder()
			.setName('create_election')
			.setDescription('Create elections'),
	}, {
		data: new SlashCommandBuilder()
			.setName('finish_elections')
			.setDescription('Finish elections and pick the most voted book'),
	}
	]
};