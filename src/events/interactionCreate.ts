import { Interaction } from 'discord.js';
import { createErrorEmbed } from '../helpers';

export default async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await interaction.deferReply();
		await command.execute(interaction);
		await interaction.deleteReply();
	}
	catch (error: unknown) {
		console.error(new Date().toUTCString(), error);
		const embeds = [createErrorEmbed((error as Error).message)];

		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ embeds });
		}
		else {
			await interaction.reply({ embeds });
		}
	}
};
