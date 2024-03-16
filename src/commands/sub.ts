import { SlashCommandBuilder } from 'discord.js';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT, cascadeUpdate, DAY_CHOICES } from '../helpers';
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
				.addChoices(...DAY_CHOICES))
		.addStringOption(option =>
			option
				.setName('date')
				.setDescription(`Date (${DATE_FORMAT.toUpperCase()})`))
		.addStringOption(option =>
			option
				.setName('comment')
				.setDescription('Add a comment to the expense')),
	async execute(interaction) {
		const userAmount = interaction.options.getNumber('amount');
		const userDate = interaction.options.getString('date');
		const userDay = interaction.options.getInteger('day');
		const userComment = interaction.options.getString('comment') ?? 'base';

		const { date, week } = getDates({ date: userDate, day: userDay });

		const weekKey = formatDate(week);
		const weekday = formatDate(date, 'EEEE') as WeekDay;

		const message = await getMessage(interaction, weekKey);

		if (message) {
			const embedRecord = parseEmbed(message.embeds[0]);
			const dayDate = formatDate(date);
			const dayKey = `${weekday} - ${dayDate}`;
			const currentValue = embedRecord.days[dayKey]?.[userComment] ?? 0;

			if (userComment !== 'base' && currentValue === userAmount) {
				delete embedRecord.days[dayKey][userComment];
			}
			else {
				embedRecord.days[dayKey] = {
					...embedRecord.days[dayKey],
					[userComment]: currentValue - userAmount,
				};
			}

			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

			await cascadeUpdate(interaction, week, userAmount * -1);

			interaction.client.history.unshift({
				date: dayDate,
				command: 'sub',
				amount: userAmount,
			});
		}
	},
};

export default command;
