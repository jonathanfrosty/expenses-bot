import { ChatInputCommandInteraction, Message, PermissionResolvable, SlashCommandBuilder } from 'discord.js';

export interface SlashCommand {
	command: SlashCommandBuilder,
	execute: (interaction : ChatInputCommandInteraction) => void,
}

export interface Command {
	name: string,
	execute: (message: Message, args: Array<string>) => void,
	permissions: Array<PermissionResolvable>,
	aliases: Array<string>,
}
