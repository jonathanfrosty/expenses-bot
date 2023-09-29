import { SlashCommandBuilder } from 'discord.js';
import { subWeeks } from 'date-fns';
import { constructNewWeekData, formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT } from '../helpers';
import { SlashCommand, WeekDay } from '../types';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an expense, optionally to a specific date or most recent day')
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
		const dayDate = formatDate(date);
		const dayKey = `${weekday} - ${dayDate}`;

		if (message) {
			const embedRecord = parseEmbed(message.embeds[0]);
			embedRecord.days[dayKey] += userAmount;
			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });
		}
		else {
			const newRecord = constructNewWeekData(week);
			const lastWeekKey = formatDate(subWeeks(week, 1));
			const lastWeekMessage = await getMessage(interaction, lastWeekKey);

			if (lastWeekMessage) {
				const lastWeekRecord = parseEmbed(lastWeekMessage.embeds[0]);
				newRecord.initial += lastWeekRecord.remaining;
				newRecord.remaining += newRecord.initial;
			}

			newRecord.days[dayKey] += userAmount;
			await interaction.channel.send({ embeds: [createEmbed(weekKey, newRecord)] });
		}

		interaction.client.history.unshift({
			date: dayDate,
			command: 'add',
			amount: userAmount,
		});
	},
};

export default command;
