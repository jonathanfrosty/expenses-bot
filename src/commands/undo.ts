import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../types';
import { getDates, getMessage, createEmbed, cascadeUpdate, parseEmbed } from '../helpers';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('undo')
		.setDescription('Undo the last action'),
	async execute(interaction) {
		const entry = interaction.client.history.shift();

		if (entry) {
			const { weekKey, state } = entry;
			const message = await getMessage(interaction, weekKey);

			if (message) {
				await message.edit({ embeds: [createEmbed(weekKey, state)] });

				const { week } = getDates({ date: weekKey });
				const { initial } = parseEmbed(message.embeds[0]);
				const amountChange = state.initial - initial;
				await cascadeUpdate(interaction, week, amountChange);
			}
		}
	},
};

export default command;
