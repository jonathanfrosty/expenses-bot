import { SlashCommandBuilder } from 'discord.js';
import { SlashCommand, WeekDay } from '../types';
import { formatDate, getDates, getMessage, createEmbed, parseEmbed } from '../helpers';

const command: SlashCommand = {
	keepReply: true,
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

				if (action.command === 'initial') {
					embedRecord.initial = action.prev;
				}
				else if (['add', 'sub'].includes(action.command)) {
					const dayKey = `${weekday} - ${formatDate(date)}`;
					embedRecord.days[dayKey] += action.command === 'add' ? action.amount * -1 : action.amount;
				}

				await message.edit({ embeds: [createEmbed(weekKey, embedRecord)] });

				await interaction.editReply(`Reverted \`${action.command} ${action.amount}\` for ${action.date}`);
			}
			else {
				await interaction.editReply('No actions to undo');
			}
		}
		else {
			await interaction.editReply('No actions to undo');
		}
	},
};

export default command;
