import { WeekData } from '../types';

export const INITIAL_WEEKDATA: WeekData = {
	days: {},
	initial: 55,
	remaining: 55,
};

export const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export const DATE_FORMAT = 'dd.MM.yyyy';

export const THEME_COLOR = '#4B88D8';
