import { SlashCommandBuilder } from 'discord.js';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT } from '../helpers';
import { SlashCommand } from '../types';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('initial')
		.setDescription('Set the initial capital, optionally for a given week')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of money')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('week')
				.setDescription(`Date (${DATE_FORMAT.toUpperCase()})`)),
	async execute(interaction) {
		const userAmount = interaction.options.getNumber('amount');
		const userWeek = interaction.options.getString('week');
		const { week } = getDates({ date: userWeek });

		const weekKey = formatDate(week);
		const message = await getMessage(interaction, weekKey);

		if (message) {
			const embedRecord = parseEmbed(message.embeds[0]);
			const original = embedRecord.initial;
			embedRecord.initial = userAmount;
			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

			interaction.client.history.unshift({
				date: weekKey,
				command: 'initial',
				amount: userAmount,
				prev: original,
			});
		}
	},
};

export default command;
