import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand, WeekDay } from '../types';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed, cascadeUpdate } from '../helpers';

const command: SlashCommand = {
	data: new SlashCommandBuilder()
		.setName('undo')
		.setDescription('Undo the last action'),
	async execute(interaction) {
		const action = interaction.client.history.shift();

		if (action) {
			const { date, week } = getDates({ date: action.date });
			const weekKey = formatDate(week);
			const weekday = formatDate(date, 'EEEE') as WeekDay;

			const message = await getMessage(interaction, weekKey);

			if (message) {
				const embedRecord = parseEmbed(message.embeds[0]);

				let amountChange = 0;

				if (action.command === 'initial') {
					embedRecord.initial = action.prev;
					amountChange = action.prev - action.amount;
				}
				else if (['add', 'sub'].includes(action.command)) {
					const dayKey = `${weekday} - ${formatDate(date)}`;

					amountChange = action.command === 'add'
						? action.amount
						: action.amount * -1;

					embedRecord.days[dayKey][action.comment ?? 'base'] -= amountChange;

					Object.entries(embedRecord.days[dayKey]).forEach(([comment, amount]) => {
						if (comment !== 'base' && amount === 0) {
							delete embedRecord.days[dayKey][comment];
						}
					});
				}

				await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

				await cascadeUpdate(interaction, week, amountChange);
			}
		}
	},
};

export default command;
