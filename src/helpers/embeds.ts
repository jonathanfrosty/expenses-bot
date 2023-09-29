import { APIEmbedField, Embed, EmbedBuilder } from 'discord.js';
import { WeekData, WeekDay, WeekDays } from '../types';
import { THEME_COLOR, WEEKDAYS } from './constants';

export const createEmbed = (week: string, data: WeekData) => {
	const { days, initial } = data;

	const initialField = {
		name: 'Initial Capital',
		value: `${initial.toFixed(2)} CHF\n\u200B`,
	};

	const dayFields = Object.entries(days).map(([day, amount]) => {
		return { name: day, value: `${amount.toFixed(2)} CHF` };
	});

	const totalSpent = Object.values(days).reduce((sum, cur) => sum + cur, 0);
	const remaining = initial - totalSpent;

	const footerFields = [
		{ name: '\u200B\nTotal Spent', value: `${totalSpent.toFixed(2)} CHF` },
		{ name: 'Remaining Capital', value: `${remaining.toFixed(2)} CHF` },
	];

	const fields = [initialField, ...dayFields, ...footerFields];

	return new EmbedBuilder()
		.setTitle(week)
		.setFields(fields)
		.setColor(THEME_COLOR);
};

const getFieldAmount = (fields: APIEmbedField[], name: string) => {
	return +fields.find(field => field.name.includes(name)).value.split(' ')[0];
};

export const parseEmbed = (embed: Embed): WeekData => {
	const { fields } = embed;

	return {
		initial: getFieldAmount(fields, 'Initial'),
		days: fields.reduce((days, cur) => {
			const name = cur.name.split(' - ')[0] as WeekDay;
			if (WEEKDAYS.includes(name)) {
				days[cur.name] = +cur.value.split(' ')[0];
			}
			return days;
		}, {} as WeekDays),
		remaining: getFieldAmount(fields, 'Remaining'),
	};
};
