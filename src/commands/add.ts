import { SlashCommandBuilder } from 'discord.js';
import { Day } from 'date-fns';
import { constructNewWeekData, formatDate, getDates, getMessage, createEmbed, parseEmbed, DATE_FORMAT, cascadeUpdate, getLastMessage, DAY_CHOICES } from '../helpers';
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
		const userDay = interaction.options.getInteger('day') as Day;
		const userComment = interaction.options.getString('comment') ?? 'base';

		const { date, week } = getDates({ date: userDate, day: userDay });

		const weekKey = formatDate(week);
		const weekday = formatDate(date, 'EEEE') as WeekDay;

		const message = await getMessage(interaction, weekKey);
		const dayDate = formatDate(date);
		const dayKey = `${weekday} - ${dayDate}`;

		if (message) {
			const embedRecord = parseEmbed(message.embeds[0]);
			const currentValue = embedRecord.days[dayKey]?.[userComment] ?? 0;

			embedRecord.days[dayKey] = {
				...embedRecord.days[dayKey],
				[userComment]: currentValue + userAmount,
			};

			await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

			await cascadeUpdate(interaction, week, userAmount);
		}
		else {
			const newRecord = constructNewWeekData(week);

			// check last week's data to add any remaining amount to this week's initial amount
			const lastMessage = await getLastMessage(interaction);

			if (lastMessage) {
				const lastMessageRecord = parseEmbed(lastMessage.embeds[0]);
				newRecord.initial += lastMessageRecord.remaining;
			}

			const currentValue = newRecord.days[dayKey]?.[userComment] ?? 0;

			newRecord.days[dayKey] = {
				...newRecord.days[dayKey],
				[userComment]: currentValue + userAmount,
			};

			await interaction.channel.send({ embeds: [createEmbed(weekKey, newRecord)] });
		}

		interaction.client.history.unshift({
			date: dayDate,
			comment: userComment,
			command: 'add',
			amount: userAmount,
		});
	},
};

export default command;
