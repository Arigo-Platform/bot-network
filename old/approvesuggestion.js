const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('approvesuggestion')
		.setDescription('Consider a suggestion')
  .addNumberOption(option =>
		option.setName('id')
			.setDescription('The suggestion ID you wish to consider')
			.setRequired(true))
  .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for considering the suggestion')
			.setRequired(true)),
	async execute(interaction, embed, db) {
// Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        const serverId = interaction.member.guild.id
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const reason = interaction.options.getString('reason')
        const suggestionId = interaction.options.getNumber('id')
// Check For Permissions

// Scan Database:
const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('banModId');
const doc = await cityRef.get();
    
// Check if user has permissions:
 if(interaction.member.roles.cache.has(doc.data().id) === true) {
// User Has Permissions:

// Check For Suggestion
const suggestioncheck = db.collection('bots').doc(`${serverId}`).collection('suggestions').doc(`${suggestionId}`);
const result = await suggestioncheck.get();
    if(result.exists) {
// The Suggestion Does Exist:

// Check if suggestion is valid:

// Get Suggestion Channel ID:
  const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionChannel');
const channelid = await cityReff.get();
let suggestionchannel = interaction.guild.channels.cache.get(channelid.data().id)
 console.log(channelid.data().id)
// Get the author information:
authorInfo = await interaction.guild.members.fetch(result.data().author)
const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async message => {
// Edit Suggestion Message:
embed.setTitle(`Suggestion from ${authorInfo.user.username} | Denied by ${interaction.user.username}`)
embed.setDescription(result.data().suggestion)
embed.addFields(
{ name: 'Reason', value: `${reason}`, inline: true  }
	)
embed.setFooter({
text: `ID: ${suggestionId} | Powered by Arigo Platform`,
iconURL: interaction.client.user.displayAvatarURL()
})
embed.setColor("GREEN")
message.edit({ embeds: [embed] })
    }) 
// Reply to interaction (success):
embed.setTitle("Suggestion approved! 🎉")
embed.setColor("GREEN")
interaction.reply({ embeds: [embed], ephemeral: true }) 
    } else {
// The Suggestion Doesn't Exist:
embed.setTitle("😞 Suggestion Not Found")
embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
embed.setColor("RED")
interaction.reply({ embeds: [embed], ephemeral: true })
    }
// Update Suggestion
// DM User
// Post Success Message
 } else {
   // User Doesn't Have Permissions:
  embed.setTitle("😞 Insufficient Permissions")
  embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
  embed.setColor("RED")
   interaction.reply({ embeds: [embed], ephemeral: true })
 }


  }
}