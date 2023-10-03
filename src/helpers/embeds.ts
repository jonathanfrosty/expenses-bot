import { APIEmbedField, Embed, EmbedBuilder } from 'discord.js';
import { WeekData, WeekDays } from '../types';
import { THEME_COLOR, WEEKDAYS } from './constants';

export const createEmbed = (week: string, data: WeekData) => {
	const { days, initial } = data;

	const initialField = {
		name: 'Initial',
		value: `${initial.toFixed(2)} CHF\n\u200B`,
	};

	const dayFields = Object.entries(days).map(([day, expenses]) => {
		const expensesStrings = Object.entries(expenses).map(([comment, amount]) => {
			return `${amount.toFixed(2)} CHF${comment !== 'base' ? ` (${comment})` : ''}\n`;
		});
		return { name: day, value: expensesStrings.join('') };
	});

	const totalSpent = Object.values(days).reduce(
		(daySum, day) => daySum + Object.values(day).reduce((sum, cur) => sum + cur, 0)
		, 0);
	const remaining = initial - totalSpent;

	const footerFields = [
		{ name: '\u200B\nTotal Spent', value: `${totalSpent.toFixed(2)} CHF` },
		{ name: 'Remaining', value: `${remaining.toFixed(2)} CHF` },
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
			if (WEEKDAYS.some(day => cur.name.startsWith(day))) {
				const reg = /(-?\d*\.\d*) CHF.?(?:\(([^()]*)\))*/ig;
				const matches = cur.value.matchAll(reg);

				for (const match of matches) {
					days[cur.name] = {
						...days[cur.name],
						[match[2] ?? 'base']: +match[1],
					};
				}
			}
			return days;
		}, {} as WeekDays),
		remaining: getFieldAmount(fields, 'Remaining'),
	};
};
