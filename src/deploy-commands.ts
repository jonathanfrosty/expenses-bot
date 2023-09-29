import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';

const rest = new REST().setToken(process.env.BOT_TOKEN);
const commandsDir = join(__dirname, 'commands');

(async () => {
	const commands = await Promise.all(
		readdirSync(commandsDir)
			.map(async (file) => {
				const { default: command } = await import(join(commandsDir, file));
				return command.data.toJSON();
			})
	);

	try {
		console.log(`Registering ${commands.length} slash commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		) as unknown[];

		console.log(`Successfully registered ${data.length} slash commands.`);
	}
	catch (error) {
		console.error(error);
	}
})();
