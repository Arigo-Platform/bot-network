const { CONSOLE_LEVELS } = require('@sentry/utils');
const { Client, Collection, Intents, ApplicationCommandOptionWithChoicesAndAutocompleteMixin } = require('discord.js');
const { SlashCommandBuilder } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the Discord server.')
    .addUserOption(option =>
		option.setName('offender')
			.setDescription('The user you want to kick')
			.setRequired(true))
      .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for the punishment')
			.setRequired(true)),
  
	async execute(interaction, embed, db, events, Sentry) {
  try {
    // Define Variables
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

    // Get Kick Moderator ID
    const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('kickModId');
    const doc = await cityRef.get();

    // Set Log Channel
    const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('logChannel');
    const doc2 = await cityReff.get();
    if (doc2.exists) {
    let logChannel = interaction.guild.channels.cache.get( doc2.data().id)
    // See if they have the Kick Moderator role
     if(interaction.member.roles.cache.has(doc.data().id) === true) {
    // See if the offender is kickable
    if(offenderMember.kickable === true) {
      // Send Success Message
      embed.setTitle("🎉 Success")
      embed.setDescription(`The server kick has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.`)
      embed.setColor("Green")
      embed.addFields(
        { name: 'Reason', value: `${reason}`, inline: true },
        { name: 'Case ID', value: `${caseId}`, inline: true },
    )
      interaction.reply({ embeds: [embed] })
      // Structure DM to offender
      const embedtoSend = new EmbedBuilder()
      embedtoSend.setAuthor({
      name: interaction.member.user.username,
      iconURL: interaction.member.user.avatarURL()
      }),
      embedtoSend.setFooter({
      text: "Designed by Arigo Platform",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      embedtoSend.setColor(interaction.guild.members.me.displayColor)
      embedtoSend.setTimestamp()
      embedtoSend.setTitle("🔨 Server Kick")
      embedtoSend.setDescription("You have been kicked from ``" + interaction.member.guild.name + "``" + ` by <@${userId}> (${userId}).`)
      embedtoSend.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true })
      // Send DM to offender
        offender.send({ embeds: [embedtoSend] }).catch(error => {  
          setTimeout(() => {  
        // If their DMs are off
        embed.setFields([]);
        embed.setTitle("😞 Unable to Notify")
        embed.setDescription(`I was unable to DM the user due to their privacy settings, although they've still been banned.`)
        embed.setColor("Red")
        interaction.followUp({ embeds: [embed], ephemeral: true })
      }, 500);
    });   
        // Kick the user
       
        offenderInfo.kick(`This user was kicked by ${username} (${userId}) for ${reason}`)    
       
        embed.setFields([]);;
        // Log in database
        async function sendLogs() {
          const data = {
            offender: offender.id,
            reason: reason,
            user: userId,
            type: "Kick"
            }
        const res = await db.collection("bots").doc(`${serverId}`).collection('cases').doc(`${caseId}`).set(data)
        }
        sendLogs()
        
        // Send logs to log channel
        embed.setTitle("📜 Server Kick Issued")
        embed.setDescription(`<@${offender.id}> (${offender.id}) has been kicked.`)
        embed.addFields(
        { name: 'Reason', value: `${reason}`, inline: true },
        { name: 'Case ID', value: `${caseId}`, inline: true },
        { name: 'Staff Member', value: `<@${userId}> (${userId})`, inline: true }
        )     
        embed.setColor(interaction.guild.members.me.displayColor)
        logChannel.send({ embeds: [embed] })
      } else {
          // The bot cannot kick the user
          embed.setTitle("😞 Insufficient Permissions")
          embed.setDescription("I was unable to kick this member, please ensure my role is higher than the offender and be sure you're not trying to kick the server owner.")
          embed.setColor("Red")
          return interaction.reply({ embeds: [embed], ephemeral: true })
      }
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
        embed.setDescription("A logging channel is not set via the dashboard and the server kick has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
        embed.setColor("Red")
        return interaction.reply({ embeds: [embed], ephemeral: true })
      }
    } catch (e) { 
      Sentry.captureException(e);
      console.error('Error in kick command', e)
    }
  },
};
