import { SlashCommandBuilder } from 'discord.js';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT } from '../helpers';
import { SlashCommand, WeekDay } from '../types';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('sub')
		.setDescription('Subtract an expense, optionally to a specific date or most recent day')
		.addNumberOption(option =>
			option
				.setName('amount')
				.setDescription('Amount of money')
				.setRequired(true))
		.addIntegerOption(option =>
			option
				.setName('day')
				.setDescription('Most recent day of the week')
				.addChoices(
					{ name: 'Monday', value: 1 },
					{ name: 'Tuesday', value: 2 },
					{ name: 'Wednesday', value: 3 },
					{ name: 'Thursday', value: 4 },
					{ name: 'Friday', value: 5 },
				))
		.addStringOption(option =>
			option
				.setName('date')
				.setDescription(`Date (${DATE_FORMAT.toUpperCase()})`)),
	async execute(interaction) {
		const userAmount = interaction.options.getNumber('amount');
		const userDate = interaction.options.getString('date');
		const userDay = interaction.options.getInteger('day');
		const { date, week } = getDates({ date: userDate, day: userDay });

		const weekKey = formatDate(week);
		const weekday = formatDate(date, 'EEEE') as WeekDay;

		const message = await getMessage(interaction, weekKey);

		if (message) {
			const embedRecord = parseEmbed(message.embeds[0]);
			const dayDate = formatDate(date);
			const dayKey = `${weekday} - ${dayDate}`;
			embedRecord.days[dayKey] -= userAmount;
			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

			interaction.client.history.unshift({
				date: dayDate,
				command: 'sub',
				amount: userAmount,
			});
		}
	},
};

export default command;
