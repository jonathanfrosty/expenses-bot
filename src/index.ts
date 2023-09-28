import 'dotenv/config';
import fs from 'fs';
import Jsoning from 'jsoning';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

client.db = new Jsoning('store.json');
client.slashCommands = new Collection();

const slashCommandsDir = './src/slash-commands';
const eventsDir = './src/events';

// register slash commands
fs.readdirSync(slashCommandsDir)
	.filter((file) => file.endsWith('.js'))
	.forEach(async (file) => {
		const { default: slashCommand } = await import(`${slashCommandsDir}/${file}`);
		client.slashCommands.set(file.split('.')[0], slashCommand);
	});

// register events
fs.readdirSync(eventsDir)
	.filter((file) => file.endsWith('.js'))
	.forEach(async (file) => {
		const { default: event } = await import(`${eventsDir}/${file}`);
		client.on(file.split('.')[0], event.bind(null, client));
	});

client.login(process.env.BOT_TOKEN);
