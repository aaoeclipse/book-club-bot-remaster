import path from "node:path";
import fs from "node:fs"
import getTokens from "../utils/token";
import { REST, Routes } from "discord.js";

const { TOKEN, SECRET, CLIENT_ID } = getTokens()
const GUILD_ID = '847884257439121418'

const commands = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {

	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandsPathFolders = fs.readdirSync(commandsPath);

	const commandFiles = commandsPathFolders.filter(file => file.endsWith('.commands.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);

		const commandsFile = require(filePath).default;

		for (const command of commandsFile.commands) {

			if ('data' in command) {
				commands.push(command.data.toJSON());
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}

	}
}

console.log("FINISH ")
console.log("🚀 ~ file: loadCommands.ts:10 ~ commands:", commands)
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(TOKEN);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data: any = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
