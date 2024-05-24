import { SlashCommandBuilder } from 'discord.js';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT, cascadeUpdate } from '../helpers';
import { SlashCommand } from '../types';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('income')
		.setDescription('Set the income amount, optionally for a given week')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Income for the week')
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
			const originalState = structuredClone(embedRecord);

			const original = embedRecord.income;
			const amountChange = userAmount - original;
			embedRecord.income = userAmount;
			embedRecord.funds += amountChange;

			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

			await cascadeUpdate(interaction, week, amountChange);

			interaction.client.history.push({ weekKey, state: originalState });
		}
	},
};

export default command;
