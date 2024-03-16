import { WeekData } from '../types';

export const EXPENSES_BOT_ID = '1156354841791168523';

export const INITIAL_WEEKDATA: WeekData = {
	days: {},
	initial: 55,
};

export const DAY_CHOICES = [
	{ name: 'Monday', value: 1 },
	{ name: 'Tuesday', value: 2 },
	{ name: 'Wednesday', value: 3 },
	{ name: 'Thursday', value: 4 },
	{ name: 'Friday', value: 5 },
	{ name: 'Saturday', value: 6 },
	{ name: 'Sunday', value: 0 },
];

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const DATE_FORMAT = 'dd.MM.yyyy';

export const THEME_COLOR = '#4B88D8';
