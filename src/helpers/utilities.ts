import { format, previousDay, setDefaultOptions, startOfWeek, eachDayOfInterval, addDays, parse, addWeeks } from 'date-fns';
import { Collection, Interaction, Message } from 'discord.js';
import { DATE_FORMAT, INITIAL_WEEKDATA } from './constants';
import { createEmbed, parseEmbed } from './embeds';
import { WeekData } from '../types';

setDefaultOptions({ weekStartsOn: 1 });

interface GetDatesProps {
	date?: string
	day?: number
}

export const getDates = ({ date, day }: GetDatesProps): { date: Date, week: Date } => {
	if (date) {
		const then = parse(date, DATE_FORMAT, new Date());
		return { date: then, week: startOfWeek(then) };
	}

	const today = new Date();

	if (day) {
		const previous = previousDay(today, day);
		return { date: previous, week: startOfWeek(previous) };
	}

	return { date: today, week: startOfWeek(today) };
};

export const formatDate = (date: Date, pattern?: string) => format(date, pattern ?? 'dd.MM.yyyy');

const getWeekMessage = (messages: Collection<string, Message>, weekKey: string) => messages.find(message => message.embeds[0]?.title === weekKey);

export const getMessage = async (interaction: Interaction, weekKey: string) => {
	const messages = await interaction.channel.messages.fetch();
	return getWeekMessage(messages, weekKey);
};

export const getLastMessage = async (interaction: Interaction) => {
	const messages = await interaction.channel.messages.fetch({ limit: 2 });
	return messages.last();
};

export const constructNewWeekData = (start: Date): WeekData => {
	const data = structuredClone(INITIAL_WEEKDATA);

	eachDayOfInterval({ start, end: addDays(start, 4) })
		.forEach(date => {
			const key = `${formatDate(date, 'EEEE')} - ${formatDate(date)}`;
			data.days[key] = { base: 0 };
		});

	return data;
};

export const cascadeUpdate = async (interaction: Interaction, updatedWeek: Date, amount: number) => {
	let week = addWeeks(updatedWeek, 1);
	let message = null;

	while ((message = getWeekMessage(interaction.channel.messages.cache, formatDate(week)))) {
		const record = parseEmbed(message.embeds[0]);
		record.initial -= amount;
		await message.edit({ embeds: [createEmbed(formatDate(week), record)] });
		week = addWeeks(week, 1);
	}
};
