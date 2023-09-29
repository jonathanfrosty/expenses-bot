import { ChatInputCommandInteraction, Message, PermissionResolvable, SlashCommandBuilder } from 'discord.js';
import { WEEKDAYS } from '../helpers/constants';

export interface SlashCommand {
	data: Partial<SlashCommandBuilder>
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>
	keepReply?: boolean
}

export interface Command {
	name: string
	execute: (message: Message, args: Array<string>) => void
	permissions: Array<PermissionResolvable>
	aliases: Array<string>
}

export type WeekDay = typeof WEEKDAYS[number];

export type WeekDays = {
	[key: string]: number
}

export interface WeekData {
	days: WeekDays
	initial: number
	remaining: number
}

export interface Action {
	date: string
	command: 'add' | 'sub' | 'initial'
	amount: number
	prev?: number
}
