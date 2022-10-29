const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { random } = require('mathjs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Display the ping & uptime of the bot'),
  
	async execute(interaction, embed, db) {
    var ping = Date.now() - interaction.createdTimestamp + " ms";
    embed.setTitle("Ping 🙋")
    embed.setDescription("The bot's ping is ``" + ping + "``.")
    interaction.reply({ embeds: [embed]  })

  }}  