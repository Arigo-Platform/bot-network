const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggest')
		.setDescription('Create a server suggestion')
  .addStringOption(option =>
		option.setName('suggestion')
			.setDescription('The suggestion you wish to share')
			.setRequired(true)),
	async execute(interaction, embed, db, events, Sentry) {

try {
// Basic needs 🤖
        const { MessageActionRow, ButtonBuilder } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        const serverId = interaction.member.guild.id
        const moment = require('moment');

    // Check for Suggestion Channel ID
    const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionChannel');
const sid = await cityReff.get();
if (sid.exists) {
let logChannel = interaction.guild.channels.cache.get(sid.data().id)
// Get Current Suggestion ID
        var docRef1 = db.collection("bots").doc(`${serverId}`).collection('suggestions').doc('current_number');
        docRef1.get().then((doc) => {
          if(doc.exists) {
            const suggestionId = doc.data().current
          
// Get Suggestion & Assign Basic Information

const suggestion = interaction.options.getString('suggestion');

// Post in database

    // Post Suggestion
           
            
    embed.setColor(interaction.guild.members.me.displayColor)
    embed.setTitle(`New Suggestion from ${interaction.member.user.username}`)
    embed.setDescription(suggestion)
    embed.setFooter({
  text: `ID: ${suggestionId} | Powered by Arigo`,
iconURL: interaction.client.user.displayAvatarURL()
  })
  logChannel.send({ embeds: [embed], fetchReply: true }).then(function (message) {
    message.react("👍")
    message.react("🤷")
    message.react("👎")
    async function quickstart() {
    const data = {
      author: userId,
      suggestion: suggestion,
      id: suggestionId,
      msgId: message.id,
    
    }
      const res = await db.collection("bots").doc(`${serverId}`).collection('suggestions').doc(`${suggestionId}`).set(data);
      events.info('Suggest', { user: `${userId}`, suggestionId: `${suggestionId}`, suggestion: `${suggestion}`, serverId: `${serverId}` });
    const data2 = {
      current: parseInt(suggestionId + parseInt("1"))
    }
        const res2 = await db.collection("bots").doc(`${serverId}`).collection('suggestions').doc("current_number").set(data2);
          } quickstart();

  })
  }
})


  // Reply to user
  embed.setTitle("Suggestion posted! 🎉")
  embed.setDescription(`Your suggestion has been posted to <#${sid.data().id}>, thank you for your contributions.`)
  embed.setColor("Green")
  interaction.reply({ embeds: [embed] })

                

} else {
    embed.setTitle("⚠️ Suggestion Channel Not Set ")
    embed.setDescription("A suggestion channel is not set via the dashboard and the command was unable to be run. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Suggestion Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com).")
    embed.setColor("Red")
  interaction.reply({ embeds: [embed], ephemeral: true })
}
    } catch (e) {
      Sentry.captureException(e);
      console.error('Error in ping command', e)

    }
  }
}