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
	async execute(interaction, embed, db) {
    // Define the Var
    const emoji = require('discord-emoji-convert');
    const text = interaction.options.getString('text')
    console.log("/")
    try {
        emoji.convert(text)
    } catch {
        embed.setTitle("Uh oh!")
        embed.setDescription("I was unable to capture the emojis for ```" + text + "```.")
        embed.setColor("Red")
        return interaction.reply({ embeds: [embed] })
    }
        interaction.reply({ content: emoji.convert(text) })
    }
}
