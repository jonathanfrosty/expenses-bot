import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { WEEKDAYS } from '../helpers/constants';

export interface SlashCommand {
	data: Partial<SlashCommandBuilder>
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>
	keepReply?: boolean
}

export type WeekDay = typeof WEEKDAYS[number];

export type Expenses = {
	[key: string]: number
}

export type WeekDays = {
	[key: string]: Expenses
}

export interface WeekData {
	days: WeekDays
	initial: number
	remaining?: number
}

export interface MessageState {
  weekKey: string;
  state: WeekData;
}
