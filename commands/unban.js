const { CONSOLE_LEVELS } = require('@sentry/utils');
const { Client, Collection, Intents, ApplicationCommandOptionWithChoicesAndAutocompleteMixin } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban a user from the Discord server.')
    .addUserOption(option =>
		option.setName('offender')
			.setDescription('The user you want to unban')
			.setRequired(true))
      .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for the punishment')
			.setRequired(true)),
  
	async execute(interaction, embed, db, events, Sentry) {
  try {
    // Defer Reply
    const { MessageActionRow, ButtonBuilder } = require('discord.js');
    const username = interaction.member.user.username
    const userId = interaction.member.user.id
    const serverId = interaction.member.guild.id
    const moment = require('moment');
    const offender = interaction.options.getUser('offender');
    const offenderMember = interaction.options.getMember('offender')
    let offenderInfo = interaction.guild.members.cache.get(offender.id);
    const reason = interaction.options.getString('reason')
    const { EmbedBuilder } = require('discord.js');
    const caseId = Math.floor(Math.random()*90000) + 10000;


    // Get General Moderator ID
    const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('modId');
    const doc = await cityRef.get();

    // Set Log Channel
    const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('logChannel');
    const doc2 = await cityReff.get();
    if (doc2.exists) {
    let logChannel = interaction.guild.channels.cache.get( doc2.data().id)
    // See if they have the General Moderator role
     if(interaction.member.roles.cache.has(doc.data().id) === true) {
    // See if the offender is not banned
      try {
      const ban = await interaction.guild.bans.fetch(offender.id)
    } catch {
      // Offnder ins't banned
      embed.setTitle("😞 User not Banned")
      embed.setDescription("This user isn't banned from the server so therefore no action has been taken. Please ensure the provided information is correct and rerun the command.")
      embed.setColor("Red")
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
     
      // Send Success Message
      embed.setTitle("🎉 Success")
      embed.setDescription(`The server unban has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.`)
      embed.setColor("Green")
      embed.addFields(
        { name: 'Reason', value: `${reason}`, inline: true },
        { name: 'Case ID', value: `${caseId}`, inline: true },
    )
      interaction.reply({ embeds: [embed] })

        // Unban the user
        interaction.guild.bans.remove(offender.id, { reason: `This user was unbanned by ${username} (${userId}) for ${reason}` })

        embed.setFields([]);;
        // Log in database
        async function sendLogs() {
          const data = {
            offender: offender.id,
            reason: reason,
            user: userId,
            type: "Unban"
            }
        const res = await db.collection("bots").doc(`${serverId}`).collection('cases').doc(`${caseId}`).set(data)
        }
        sendLogs()
        
        // Send logs to log channel
        embed.setTitle("📜 Server Unban Issued")
        embed.setDescription(`<@${offender.id}> (${offender.id}) has been unbanned.`)
        embed.addFields(
        { name: 'Reason', value: `${reason}`, inline: true },
        { name: 'Case ID', value: `${caseId}`, inline: true },
        { name: 'Staff Member', value: `<@${userId}> (${userId})`, inline: true }
        )     
        embed.setColor(interaction.guild.members.me.displayColor)
        logChannel.send({ embeds: [embed] })
         
      } else {  
         // They don't have the required role to run the command
          embed.setTitle("😞 Insufficient Permissions")
          embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
          embed.setColor("Red")
         return interaction.reply({ embeds: [embed], ephemeral: true })
        }
     } else {
        // Log Channel not set
        embed.setTitle("⚠️ Logging Channel Not Set ")
        embed.setDescription("A logging channel is not set via the dashboard and the server unban has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
        embed.setColor("Red")
        return interaction.reply({ embeds: [embed], ephemeral: true })
      }
    } catch (e) { 
      Sentry.captureException(e);
      console.error('Error in unban command', e)
    }
  },
};
