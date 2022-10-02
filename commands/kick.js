const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
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
  
	async execute(interaction, embed, db) {
// Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const moment = require('moment');
// Defining basic varvs
        const offender = interaction.options.getUser('offender');
        const forkick = interaction.options.getMember('offender');
        let offenderInfo = interaction.guild.members.cache.get(offender.id)
        const reason = interaction.options.getString('reason')
        const { MessageEmbed } = require('discord.js');
        const caseId = Math.floor(Math.random()*90000) + 10000;
        const serverId = interaction.member.guild.id
        const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('kickModId');
        const doc = await cityRef.get();

// Set Log Channel
    const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('logChannel');
const doc2 = await cityReff.get();
if (doc2.exists) {
let logChannel = interaction.guild.channels.cache.get( doc2.data().id)
  
 // See if they have the mod role
  
 if(interaction.member.roles.cache.has(doc.data().id) === true) {
// They have permissions, check if user is kickable
    try {
   if(offenderInfo.kickable === true) {


     // Send success message
     embed.setTitle("🎉 Success")
     embed.setDescription(`The server kick has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.`)
     embed.setColor("GREEN")
    embed.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true },
	)
    interaction.reply({ embeds: [embed] })


  // DM Offender
    const { MessageEmbed } = require('discord.js');
    const embedtoSend = new MessageEmbed()
     embedtoSend.setAuthor({
  name: interaction.member.user.username,
  iconURL: interaction.member.user.avatarURL()
  }),
     embedtoSend.setFooter({
  text: "Powered by Arigo Platform",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
     embedtoSend.setColor(interaction.guild.me.displayColor)
     embedtoSend.setTimestamp()
     embedtoSend.setTitle("🔨 Server Kick")
     embedtoSend.setDescription("You have been kicked from the server ``" + interaction.member.guild.name + "``" + ` by <@${userId}> (${userId}), please remember that Arigo Community strives to provide community-safety.\n\nYou can locate the Arigo Community Guidelines [here](https://corp.arigoapp.com/policy/community-guidelines).`)
       embedtoSend.addFields(
  { name: 'Reason', value: `${reason}`, inline: true },
  { name: 'Case ID', value: `${caseId}`, inline: true })
offender.send({ embeds: [embedtoSend] }).then(value => {
}).catch(error => {  
  embed.fields = [];
  embed.setTitle("😞 Unable to Notify")
  embed.setDescription(`I was unable to DM the user due to their privacy settings, although they've still been kicked.`)
  embed.setColor("RED")
  interaction.followUp({ embeds: [embed], ephemeral: true })
});   
      interaction.guild.members.kick(`${forkick.user.id}`, `This user was kicked by ${username} (${userId}) for ${reason}.`)
  embed.fields = [];
  const data = {
    offender: offender.id,
    reason: reason,
    user: userId,
    type: "Kick"
  }
  const res = await db.collection("bots").doc(`${serverId}`).collection('cases').doc(`${caseId}`).set(data)
     embed.setTitle("📜 Server Kick Issued")
     embed.setDescription(`<@${offender.id}> (${offender.id}) has been kicked from ` + "``" + interaction.member.guild.name + "``. You can find the infraction information below.")
     embed.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true },
      { name: 'Staff Member', value: `<@${userId}> (${userId})`, inline: true }
	)     
       embed.setColor(interaction.guild.me.displayColor)
  logChannel.send({ embeds: [embed] })

      }
    } catch {
      embed.setTitle("😞 Command Error")
      embed.setDescription(`I was unable to kick this user from the server, this is most likely because they're not within the server.`)
      embed.setColor("RED")
      return interaction.reply({ embeds: [embed], ephemeral: true })
    }
  } else {  
   // They don't have the required role to run the command
    embed.setTitle("😞 Insufficient Permissions")
    embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
    embed.setColor("RED")
   return interaction.reply({ embeds: [embed], ephemeral: true })

   
  }
} else {
    embed.setTitle("⚠️ Logging Channel Not Set ")
    embed.setDescription("A logging channel is not set via the dashboard and the server kick has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
    embed.setColor("RED")
    return interaction.reply({ embeds: [embed], ephemeral: true})

}
  },
};