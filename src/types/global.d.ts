import { Collection } from 'discord.js';
import { SlashCommand } from '.';
import Jsoning from 'jsoning';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			BOT_TOKEN: string,
			CLIENT_ID: string,
		}
	}
}

declare module 'discord.js' {
	export interface Client {
		slashCommands: Collection<string, SlashCommand>
		db: Jsoning
	}
}
