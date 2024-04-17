import 'dotenv/config';
import { readdirSync } from 'fs';
import { parse, join } from 'path';
import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { MessageState } from './types';
import { CappedStack } from './helpers';

const client = new Client({
	intents: [GatewayIntentBits.Guilds],
});

client.commands = new Collection();
client.history = new CappedStack<MessageState>(100);

const commandsDir = join(__dirname, 'commands');
const eventsDir = join(__dirname, 'events');

// register slash commands
readdirSync(commandsDir)
	.forEach(async (file) => {
		const { default: command } = await import(join(commandsDir, file));
		client.commands.set(parse(file).name, command);
	});

// register events
readdirSync(eventsDir)
	.forEach(async (file) => {
		const { default: event } = await import(join(eventsDir, file));
		client.on(parse(file).name, event);
	});

client.login(process.env.BOT_TOKEN).then(() => console.log('🤖 Bot running'));
