const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('emojify')
		.setDescription('Turn text into emojis')
        .addStringOption(option =>
            option.setName('text')
                .setDescription('The text you\'d like to translate into emojis')
                .setRequired(true)),
	async execute(interaction, embed, db, events, Sentry) {
    // Define the Var
    const userId = interaction.member.user.id
    const serverId = interaction.member.guild.id
    const emoji = require('discord-emoji-convert');
    const text = interaction.options.getString('text')
    console.log("/")
    try {
    try {
        emoji.convert(text)
    } catch {
        embed.setTitle("Uh oh!")
        embed.setDescription("I was unable to capture the emojis for ```" + text + "```.")
        embed.setColor("Red")
        events.info('Emojify', { user: `${userId}`, text: `${text}`, success: `false`, serverId: `${serverId}` });
        return interaction.reply({ embeds: [embed] })
    }
        events.info('Emojify', { user: `${userId}`, text: `${text}`, success: `true`, serverId: `${serverId}` });
        interaction.reply({ content: emoji.convert(text) })
    } catch (e) {
        Sentry.captureException(e);
        console.error('Error in emojify command', e)

      }

    }
}
