const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { random } = require('mathjs');
const { createLogger, format, transports } = require('winston');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get information & commands on the bot'),
  
	async execute(interaction, embed, db, events) {
    embed.setTitle("Help is here! 🙋")
    embed.setDescription("Hi there! This bot is still undergoing development, so a commands list isn't yet public.\n\nIf you need support utilizing this bot, please send your request to the Arigo Platform Support Team via email at ``support@arigoapp.com``.")
    interaction.reply({ embeds: [embed]  })
  }}  