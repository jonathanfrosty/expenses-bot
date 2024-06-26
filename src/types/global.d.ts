import { Collection } from 'discord.js';
import { CappedStack } from '../helpers';
import { MessageState, SlashCommand } from '.';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string
			CLIENT_ID: string
			GUILD_ID: string
		}
	}
}

declare module 'discord.js' {
	export interface Client {
		commands: Collection<string, SlashCommand>
		history: CappedStack<MessageState>
	}
}
