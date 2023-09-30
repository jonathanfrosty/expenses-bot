import { format, previousDay, setDefaultOptions, startOfWeek, eachDayOfInterval, addDays, parse } from 'date-fns';
import { Interaction } from 'discord.js';
import { WeekData } from '../types';
import { DATE_FORMAT, INITIAL_WEEKDATA } from './constants';

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

export const getMessage = async (interaction: Interaction, weekKey: string) => {
	const messages = await interaction.channel.messages.fetch();
	return messages.find(message => message.embeds[0]?.title === weekKey);
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
