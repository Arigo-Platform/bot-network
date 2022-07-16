const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user in the Discord server.')
    .addUserOption(option =>
		option.setName('offender')
			.setDescription('The user you want to warn')
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
        const reason = interaction.options.getString('reason')
        const { MessageEmbed } = require('discord.js');
        const caseId = Math.floor(Math.random()*90000) + 10000;
        const serverId = interaction.member.guild.id

// Check for permission 😃
async function quickstart() {

const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('logChannel');
const doc = await cityRef.get();
if (doc.exists) {
let logChannel = interaction.guild.channels.cache.get( doc.data().id)
// Check for proper permissions
  const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('warnModId');
const doc2 = await cityReff.get();
  
  if(interaction.member.roles.cache.has(doc2.data().id) === true) {
    
  

// Add in database
  const data = {
    offender: offender.id,
    reason: reason,
    user: userId,
    type: "Warn"
  }
  const res = await db.collection("bots").doc(`${serverId}`).collection('cases').doc(`${caseId}`).set(data)
// Post success message
  embed.setTitle("🎉 Success")
     embed.setDescription(`The server warn has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.`)
     embed.setColor("GREEN")
    embed.addFields(
      { name: 'Reason', value: `${reason}` },
      { name: 'Case ID', value: `${caseId}` },
	)
    interaction.reply({ embeds: [embed] })
  
// Attempt to DM offender
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
     embedtoSend.setTitle("🔨 Server Warn")
     embedtoSend.setDescription("You have been warned in the server ``" + interaction.member.guild.name + "``" + ` by <@${userId}> (${userId}), please remember that Arigo Community strives to provide community-safety.\n\nYou can locate the Arigo Community Guidelines [here](https://corp.arigoapp.com/policy/community-guidelines).`)
      embedtoSend.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true })
    
offender.send({ embeds: [embedtoSend] }).then(value => {
  // Remove Case Information
  interaction.followUp({ content: "To remove this case, please run ``/case " + caseId + "`` " + `and utilize the "Remove Case" button`, ephemeral: true })
}).catch(error => {  
  console.log(error)
	embed.setTitle("🎉 Success")
  embed.setDescription(`The server warn has been issued to <@${offender.id}> (${offender.id}) and has been successfully logged.\n\n` + "I was unable to DM the user due to their privacy settings on Discord. The warning **has** still been issued & logged.")
  embed.setColor("YELLOW")
  embed.fields = [];
  interaction.editReply({ embeds: [embed] })
});     
    
    // Log to log channel
embed.fields = []
embed.setTitle("📜 Warning Issued")
     embed.setDescription(`<@${offender.id}> (${offender.id}) has been warned in ` + "``" + interaction.member.guild.name + "``. You can find the infraction information below.")
     embed.addFields(
      { name: 'Reason', value: `${reason}`, inline: true },
      { name: 'Case ID', value: `${caseId}`, inline: true },
      { name: 'Staff Member', value: `<@${userId}> (${userId})`, inline: true }
	)     
       embed.setColor(interaction.guild.me.displayColor)
  logChannel.send({ embeds: [embed] })


    } else {
     embed.setTitle("😞 Insufficient Permissions")
     embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc2.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
     embed.setColor("RED")
       interaction.reply({ embeds: [embed], ephemeral: true })

    }
    } else {  
  // No Log Channel ID Set 😔
      embed.setTitle("⚠️ Logging Channel Not Set ")
  embed.setDescription("A logging channel is not set via the dashboard and the server warn has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
  embed.setColor("RED")
  interaction.reply({ embeds: [embed], ephemeral: true})

    }

                  } quickstart();

  },
};