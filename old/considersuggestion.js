const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('considersuggestion')
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
        let logChannel = interaction.guild.channels.cache.get('954136882361540610')
        const serverId = interaction.member.guild.id
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const moment = require('moment');
        const reason = interaction.options.getString('reason')


    // Check for permissions
    const checkperms = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionModify');
const role = await checkperms.get();
 if(interaction.member.roles.cache.has(role.data().id) === true) {
// Get Suggestion ID
const suggestionId = interaction.options.getNumber('id');
// Check if suggestion is valid


            const suggestioncheck = db.collection('bots').doc(`${serverId}`).collection('suggestions').doc(`${suggestionId}`);
const result = await suggestioncheck.get();
    if(result.exists) {
// Get suggestion channel ID
      const cityReff = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionChannel');
const channelid = await cityReff.get();
let suggestionchannel = interaction.guild.channels.cache.get(channelid.data().id)
// Get Author
let authorInfo = await interaction.guild.members.fetch(result.data().author)// Edit Suggestion
// Edit Suggestion
      const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async messages => {
      embed.setTitle(`Suggestion from ${authorInfo.user.username} | Considered by ${interaction.user.username}`)
      embed.setDescription(result.data().suggestion)
      embed.addFields(
      { name: 'Reason', value: `${reason}`, inline: true  }
	)
      embed.setFooter({
  text: `ID: ${suggestionId} | Powered by Arigo Platform`,
  iconURL: "https://cdn.arigoapp.com/logo"
  })
      embed.setColor("YELLOW")
      messages.edit({ embeds: [embed] })
// DM suggestor
      embed.fields = []
    embed.setColor(interaction.guild.me.displayColor)
      embed.setTitle("Suggestion Status Update")
      embed.setDescription(`Hi, <@${authorInfo.user.id}>! Your [suggestion](https://discord.com/channels/${serverId}/${suggestionchannel}/${messages.id}) in ` + "``" + interaction.member.guild.name + "`` has been reviewed by <@" + interaction.user.id + ">.")
      authorInfo.send({ embeds: [embed] 
          }).catch(error => {  
  // Could not DM the user - DMs off
}); 
      })
// Reply to interaction
    embed.setTitle("Suggestion considered! 🎉")
    interaction.reply({ embeds: [embed], ephemeral: true})
  
    } else {
      embed.setTitle("😞 Suggestion Not Found")
      embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
      embed.setColor("RED")
      interaction.reply({ embeds: [embed], ephemeral: true})
    }


// No Suggestion Found
} else {
embed.setTitle("😞 Insufficient Permissions")
embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + role.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
   embed.setColor("RED")
   interaction.reply({ embeds: [embed], ephemeral: true })
}
  }
}