const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { random } = require('mathjs');
const { createLogger, format, transports } = require('winston');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Get information & commands on the bot'),
  
	async execute(interaction, embed, db, events, Sentry) {
    try {
    const userId = interaction.member.user.id
    const serverId = interaction.member.guild.id
    embed.setTitle("Help is here! 🙋 - Systems Fully Operational")
    embed.setDescription("Hi there! This bot is still undergoing development, so a commands list isn't yet public.\n\nIf you need support utilizing this bot, please send your request to the Arigo Platform Support Team via email at ``support@arigoapp.com``.")
    interaction.reply({ embeds: [embed]  })
    events.info('Help', { user: `${userId}`, serverId: `${serverId}` });
    
  } catch (e) {
    Sentry.captureException(e);
    console.error('Error in help command', e)

  }
  }}  