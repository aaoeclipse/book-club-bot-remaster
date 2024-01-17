import { ApplicationCommandOptionBase } from "discord.js";
import { addBook } from "./interface";

const { SlashCommandBuilder } = require('discord.js');

export default {
	commands: [{
		data: new SlashCommandBuilder()
			.setName('add_book')
			.setDescription('add new book')
			.addStringOption((option: any) =>
				option.setName('title')
					.setDescription('title of the book')
					.setRequired(true))
			.addStringOption((option: any) =>
				option.setName('author')
					.setDescription('author of the book')
					.setRequired(false))
			.addStringOption((option: any) =>
				option.setName('description')
					.setDescription('description of the book')
					.setRequired(false))
	},
	{
		data: new SlashCommandBuilder()
			.setName('list_books')
			.setDescription('list books')
			.addBooleanOption((option: any) => {
				return option.setName("on_election")
					.setDescription("show only the ones elected")
			})
	},
	{
		data: new SlashCommandBuilder()
			.setName('remove_book')
			.setDescription('Remove book')
			.addStringOption((option: any) =>
				option.setName('title')
					.setDescription('title of the book')
					.setRequired(true)
			)
	},
	{
		data: new SlashCommandBuilder()
			.setName('add_book_to_election')
			.setDescription('Add book to the election')
			.addIntegerOption((option: any) =>
				option.setName("book_id")
					.setDescription("book id (from the list) to add to the elections")
			)
	},
	{
		data: new SlashCommandBuilder()
			.setName('update_book')
			.setDescription('Update book')
			.addIntegerOption((option: any) =>
				option.setName("book_id")
					.setDescription("book id to update")
					.setRequired(true)
			)
			.addStringOption((option: any) =>
				option.setName('title')
					.setDescription('title of the book')
					.setRequired(false))
			.addStringOption((option: any) =>
				option.setName('author')
					.setDescription('author of the book')
					.setRequired(false))
			.addStringOption((option: any) =>
				option.setName('description')
					.setDescription('description of the book')
					.setRequired(false))
	},
	{
		data: new SlashCommandBuilder()
			.setName('book_info')
			.setDescription('Get a more detailed view of a single book')
			.addIntegerOption((option: any) =>
				option.setName("book_id")
					.setDescription("the id of the book to display")
					.setRequired(true)
			)
	}
	]
};