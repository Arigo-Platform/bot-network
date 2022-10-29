const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeout a user in the Discord server.')
    .addUserOption(option =>
		option.setName('offender')
			.setDescription('The user you want to timeout')
			.setRequired(true))
      .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for the punishment')
			.setRequired(true))
    .addStringOption(option =>
		option.setName('duration')
			.setDescription('The duration of timeout')
			.setRequired(true)),
  
	async execute(interaction, embed, db, events) {
// Basic needs 🤖
      const ms = require('ms')

        const { MessageActionRow, ButtonBuilder } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        const moment = require('moment');
// Defining basic varvs
        const offender = interaction.options.getUser('offender');
    const forkick = interaction.options.getMember('offender');
    const duration = interaction.options.getString('duration');
            let offenderInfo = interaction.guild.members.cache.get(offender.id)
        const reason = interaction.options.getString('reason')
        const { EmbedBuilder } = require('discord.js');
        const caseId = Math.floor(Math.random()*90000) + 10000;
        const serverId = interaction.member.guild.id
    const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('timeoutModId');
const doc = await cityRef.get();
   if(offenderInfo.kickable === true) {
     // Set Log Channel
    const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('logChannel');
const doc2 = await cityReff.get();
if (doc2.exists) {
let logChannel = interaction.guild.channels.cache.get( doc2.data().id)
  
 // See if they have the mod role
  
 if(interaction.member.roles.cache.has(doc.data().id) === true) {
// They have permissions, check if user is kickable


    
     // Send success message
     embed.setTitle("🎉 Success")
     embed.setDescription(`The server timeout has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.`)
     embed.setColor("Green")
    embed.addFields(
      { name: 'Reason', value: `${reason}` },
      { name: 'Case ID', value: `${caseId}` },
      { name: 'Duration', value: `${duration}`}
	)
    interaction.reply({ embeds: [embed] })


  // DM Offender
    const { EmbedBuilder } = require('discord.js');
    const embedtoSend = new EmbedBuilder()
     embedtoSend.setAuthor({
  name: interaction.member.user.username,
  iconURL: interaction.member.user.avatarURL()
  }),
     embedtoSend.setFooter({
  text: "Powered by Arigo Platform",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
     embedtoSend.setColor(interaction.guild.members.me.displayColor)
     embedtoSend.setTimestamp()
     embedtoSend.setTitle("🔨 Server Timeout")
     embedtoSend.setDescription("You have been timed out in the server ``" + interaction.member.guild.name + "``" + ` by <@${userId}> (${userId}), please remember that Arigo Community strives to provide community-safety.\n\nYou can locate the Arigo Community Guidelines [here](https://corp.arigoapp.com/policy/community-guidelines).`)
   embedtoSend.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true },
     { name: 'Duration', value: `${duration}`, inlne: true })
offender.send({ embeds: [embedtoSend] }).then(value => {
    // Remove Case Information
  interaction.followUp({ content: "To remove this case, please run ``/case " + caseId + "`` " + `and utilize the "Remove Case" button`, ephemeral: true })
}).catch(error => {  
	embed.setTitle("🎉 Success")
  embed.setDescription(`The server timeout has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.\n\n` + "I was unable to DM the user due to their privacy settings on Discord. The timeout **has** still been issued & logged.")
  embed.setColor("Yellow")
  embed.setFields([]);;

  interaction.editReply({ embeds: [embed] })
});   

     const forkickduration = ms(duration) / 60000
        forkick.timeout(forkickduration * 60 * 1000, `This user was timed out by ${username} (${userId}) for ${reason}, through the Arigo Platform Bot Network. To report abuse, please contact abuse@arigoapp.com`)
  embed.setFields([]);;
  const data = {
    offender: offender.id,
    reason: reason,
    user: userId,
    type: "Timeout",
    duration: duration
  }
  const res = await db.collection("bots").doc(`${serverId}`).collection('cases').doc(`${caseId}`).set(data)
   // Log in Datadog
   events.info('Timeout', { punisher: `${userId}`, offender: `${offender.id}`, caseId: `${caseId}`, serverId: `${serverId}`, reason: `${reason}`, duration: `${duration}` });
     embed.setTitle("📜 Server Timeout Issued")
     embed.setDescription(`<@${offender.id}> (${offender.id}) has been timed out in ` + "``" + interaction.member.guild.name + "``. You can find the infraction information below.")
     embed.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true },
      { name: 'Staff Member', value: `<@${userId}> (${userId})`, inline: true },
      { name: 'Duration', value: duration, inline: true }
	)     
       embed.setColor(interaction.guild.members.me.displayColor)
  logChannel.send({ embeds: [embed] })

  } else {  
   // They don't have the required role to run the command
    embed.setTitle("😞 Insufficient Permissions")
    embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
   embed.setColor("Red")
   interaction.reply({ embeds: [embed], ephemeral: true })
  }
      
   

} else {
  embed.setTitle("⚠️ Logging Channel Not Set ")
  embed.setDescription("A logging channel is not set via the dashboard and the server timeout has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
  embed.setColor("Red")
  interaction.reply({ embeds: [embed], ephemeral: true })
}
     } else {
       embed.setTitle("⚠️ Command Failure")
        embed.setDescription("I was unable to timeout the user; please ensure my role is above theirs and you're not attempting to mute the server owner.\n\nIf this problem persists, please contact the Arigo Platform Support Team via email at ``support@arigoapp.com``.")
        embed.setColor("Red")
  interaction.reply({ embeds: [embed], ephemeral: true })
     }


  },
}