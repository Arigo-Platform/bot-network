 const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { zeros } = require('mathjs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Set a channel slowmode')
      .addStringOption(option =>
		option.setName('duration')
			.setDescription('The amount of slowmode you wish to set in seconds')
			.setRequired(true)),
  	async execute(interaction, embed, db) {

      // Basic Utilities
        const serverId = interaction.member.guild.id
        const durationstring = interaction.options.getString('duration')
        const duration = parseInt(durationstring)
    const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('modId');
const doc = await cityRef.get();
      let channel = interaction.guild.channels.cache.get(interaction.channelId)
    const username = interaction.member.user.username
    const userId = interaction.member.user.id
    
// Check for permissions
      if(interaction.member.roles.cache.has(doc.data().id) === true) {

if(duration == '0') {
  channel.setRateLimitPerUser('0', `The channel slowmode was removed by ${username} (${userId}).`)
  embed.setTitle("🎉 Slowmode Removed")
  embed.setDescription(`I've successfully disabled slowmode for this channel.`)
  embed.setColor("Green")
  return interaction.reply({ embeds: [embed] })
  }
  // Invalid Amount
 if(isNaN(duration)) {
   embed.setTitle("⚠️ Command Failure")
   embed.setDescription("Please enter a valid time for slowmode, such as `/slowmode 3`")
   embed.setColor("Red")
   return interaction.reply({ embeds: [embed] })
 }
 
// Set The Slowmode
channel.setRateLimitPerUser(duration, `This slowmode was issued by ${username} (${userId}).`)
embed.setTitle("🎉 Slowmode Set")
embed.setDescription(`I've set a slowmode in this channel for **` + "`" + duration + "`** second(s). Use the `/slowmode 0` to turn off slowmode.")
embed.setColor("Green")
interaction.reply({ embeds: [embed] })
      
 } else {
  // No Permission
embed.setTitle("😞 Insufficient Permissions")
embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
embed.setColor("Red")
interaction.reply({ embeds: [embed], ephemeral: true })
       }

    }
}