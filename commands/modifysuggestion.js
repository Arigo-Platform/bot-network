 const { SlashCommandBuilder } = require('discord.js');
const { ButtonStyle, ActionRowBuilder, Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
.setName('modifysuggestion')
	.setDescription('Modify the status of a suggestion')
	.addStringOption(option =>
		option.setName('status')
			.setDescription('Set the status of the suggestion')
			.setRequired(true)
      .addChoices(
				{ name: 'Approve', value: 'approve' },
				{ name: 'Deny', value: 'deny' },
				{ name: 'Consider', value: 'consider' },
        { name: 'Delete', value: 'delete' },
			))
  .addNumberOption(option =>
		option.setName('id')
			.setDescription('The suggestion ID you wish to consider')
			.setRequired(true))
  .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for considering the suggestion')
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
        const type = interaction.options.getString('status');
       const reason = interaction.options.getString('reason');
        const suggestionId = interaction.options.getNumber('id');

if(type === 'approve') {

 // Scan Database:
const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionModify');
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
// Get the author information:
authorInfo = await interaction.guild.members.fetch(result.data().author)
const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async message => {
  events.info('ModifySuggestion', { user: `${userId}`, type: 'approve', suggestionId: `${suggestionId}`, serverId: `${serverId}`, reason: `${reason}` });
  // DM User
  const { EmbedBuilder } = require('discord.js');
  const sLink = new ActionRowBuilder()  
          .addComponents(
				new ButtonBuilder()	.setURL(`https://discord.com/channels/${serverId}/${channelid.data().id}/${message.id}`)
					.setLabel('View Suggestion')
					.setStyle(ButtonStyle.Link)
        )   
  const todmembed = new EmbedBuilder()
    todmembed.setColor(interaction.guild.members.me.displayColor)
    todmembed.setTitle("💡 Suggestion Status Update")
    todmembed.setDescription(`Hello, <@${authorInfo.user.id}>! Your suggestion in ` + "``" + interaction.member.guild.name + "`` has been reviewed by <@" + interaction.user.id + ">.")
      authorInfo.send({ embeds: [todmembed], components: [sLink] 
          }).catch(error => {  
  // Could not DM the user - DMs off
}); 
  
// Edit Suggestion Message:
embed.setTitle(`Suggestion from ${authorInfo.user.username} | Approved by ${interaction.user.username}`)
embed.setDescription(result.data().suggestion)
embed.addFields(
{ name: 'Reason', value: `${reason}`, inline: true  }
	)
// embed.setFooter({
// text: `ID: ${suggestionId} | Powered by Arigo Platform`,
// iconURL: interaction.client.user.displayAvatarURL()
// })
embed.setColor("Green")
message.edit({ embeds: [embed] })
    }) 
// Reply to interaction (success):
embed.setTitle("Suggestion approved! 🎉")
embed.setColor("Green")
interaction.reply({ embeds: [embed], ephemeral: true }) 
    } else {
// The Suggestion Doesn't Exist:
embed.setTitle("😞 Suggestion Not Found")
embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
embed.setColor("Red")
interaction.reply({ embeds: [embed], ephemeral: true })
    }

 } else {
   // User Doesn't Have Permissions:
  embed.setTitle("😞 Insufficient Permissions")
  embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
  embed.setColor("Red")
   interaction.reply({ embeds: [embed], ephemeral: true })
 }
} else if(type === 'deny') {

 // Scan Database:
const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionModify');
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
// Get the author information:
authorInfo = await interaction.guild.members.fetch(result.data().author)
const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async message => {
  events.info('ModifySuggestion', { user: `${userId}`, type: 'deny', suggestionId: `${suggestionId}`, serverId: `${serverId}`, reason: `${reason}` });

  // DM User
    const { EmbedBuilder } = require('discord.js');
    const sLink = new ActionRowBuilder()  
          .addComponents(
				new ButtonBuilder()	.setURL(`https://discord.com/channels/${serverId}/${channelid.data().id}/${message.id}`)
					.setLabel('View Suggestion')
					.setStyle(ButtonStyle.Link)
        )   
  const todmembed = new EmbedBuilder()
    todmembed.setColor(interaction.guild.members.me.displayColor)
    todmembed.setTitle("💡 Suggestion Status Update")
    todmembed.setDescription(`Hello, <@${authorInfo.user.id}>! Your suggestion in ` + "``" + interaction.member.guild.name + "`` has been reviewed by <@" + interaction.user.id + ">.")
      authorInfo.send({ embeds: [todmembed], components: [sLink] 
          }).catch(error => {  
  // Could not DM the user - DMs off
}); 
  
// Edit Suggestion Message:
embed.setTitle(`Suggestion from ${authorInfo.user.username} | Denied by ${interaction.user.username}`)
embed.setDescription(result.data().suggestion)
embed.addFields(
{ name: 'Reason', value: `${reason}`, inline: true  }
	)
// embed.setFooter({
// text: `ID: ${suggestionId} | Powered by Arigo Platform`,
// iconURL: interaction.client.user.displayAvatarURL()
// })
embed.setColor("Red")
message.edit({ embeds: [embed] })
    }) 
// Reply to interaction (success):
embed.setTitle("Suggestion denied! 🎉")
embed.setColor("Green")
interaction.reply({ embeds: [embed], ephemeral: true }) 
    } else {
// The Suggestion Doesn't Exist:
embed.setTitle("😞 Suggestion Not Found")
embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
embed.setColor("Red")
interaction.reply({ embeds: [embed], ephemeral: true })
    }

 } else {
   // User Doesn't Have Permissions:
  embed.setTitle("😞 Insufficient Permissions")
  embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
  embed.setColor("Red")
   interaction.reply({ embeds: [embed], ephemeral: true })
 }
} if(type === 'consider') {

 // Scan Database:
const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('suggestionModify');
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
// Get the author information:
authorInfo = await interaction.guild.members.fetch(result.data().author)
const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async message => {
  events.info('ModifySuggestion', { user: `${userId}`, type: 'consider', suggestionId: `${suggestionId}`, serverId: `${serverId}`, reason: `${reason}` });

  // DM User
  const { EmbedBuilder } = require('discord.js');
  const sLink = new ActionRowBuilder()  
          .addComponents(
				new ButtonBuilder()	.setURL(`https://discord.com/channels/${serverId}/${channelid.data().id}/${message.id}`)
					.setLabel('View Suggestion')
					.setStyle(ButtonStyle.Link)
        )   
  const todmembed = new EmbedBuilder()
    todmembed.setColor(interaction.guild.members.me.displayColor)
    todmembed.setTitle("💡 Suggestion Status Update")
    todmembed.setDescription(`Hello, <@${authorInfo.user.id}>! Your suggestion in ` + "``" + interaction.member.guild.name + "`` has been reviewed by <@" + interaction.user.id + ">.")
      authorInfo.send({ embeds: [todmembed], components: [sLink]
          }).catch(error => {  
  // Could not DM the user - DMs off
}); 
  
// Edit Suggestion Message:
embed.setTitle(`Suggestion from ${authorInfo.user.username} | Considered by ${interaction.user.username}`)
embed.setDescription(result.data().suggestion)
embed.addFields(
{ name: 'Reason', value: `${reason}`, inline: true  }
	)
// embed.setFooter({
// text: `ID: ${suggestionId} | Powered by Arigo Platform`,
// iconURL: interaction.client.user.displayAvatarURL()
// })
embed.setColor("Yellow")
message.edit({ embeds: [embed] })
    }) 
// Reply to interaction (success):
embed.setTitle("Suggestion considered! 🎉")
embed.setColor("Green")
interaction.reply({ embeds: [embed], ephemeral: true }) 
    } else {
// The Suggestion Doesn't Exist:
embed.setTitle("😞 Suggestion Not Found")
embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
embed.setColor("Red")
interaction.reply({ embeds: [embed], ephemeral: true })
    }

 } else {
   // User Doesn't Have Permissions:
  embed.setTitle("😞 Insufficient Permissions")
  embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
  embed.setColor("Red")
   interaction.reply({ embeds: [embed], ephemeral: true })
 }
} if(type === 'delete') {

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
// Get the author information:
authorInfo = await interaction.guild.members.fetch(result.data().author)
const msg = suggestionchannel.messages.fetch(result.data().msgId).then(async message => {
  // DM User
  events.info('ModifySuggestion', { user: `${userId}`, type: 'delete', suggestionId: `${suggestionId}`, serverId: `${serverId}`, reason: `${reason}` });

const { EmbedBuilder } = require('discord.js');
const sLink = new ActionRowBuilder()  
          .addComponents(
				new ButtonBuilder()	.setURL(`https://discord.com/channels/${serverId}/${channelid.data().id}/${message.id}`)
					.setLabel('View Suggestion')
					.setStyle(ButtonStyle.Link)
        )   
  const todmembed = new EmbedBuilder()
    todmembed.setColor(interaction.guild.members.me.displayColor)
    todmembed.setTitle("💡 Suggestion Status Update")
    todmembed.setDescription(`Hello, <@${authorInfo.user.id}>! Your suggestion in ` + "``" + interaction.member.guild.name + "`` has been reviewed by <@" + interaction.user.id + ">.")
      authorInfo.send({ embeds: [todmembed], components: [sLink] 
          }).catch(error => {  
  // Could not DM the user - DMs off
}); 
  
// Edit Suggestion Message:
embed.setTitle(`Suggestion from ${authorInfo.user.username} | Deleted by ${interaction.user.username}`)
embed.setDescription("**``Suggestion Deleted``**")
embed.addFields(
{ name: 'Reason', value: `${reason}`, inline: true  }
	)
// embed.setFooter({
// text: `ID: ${suggestionId} | Powered by Arigo Platform`,
// iconURL: interaction.client.user.displayAvatarURL()
// })
embed.setColor("BLACK")
message.edit({ embeds: [embed] })
    }) 
// Reply to interaction (success):
embed.setTitle("Suggestion deleted! 🎉")
embed.setColor("Green")
interaction.reply({ embeds: [embed], ephemeral: true }) 
    } else {
// The Suggestion Doesn't Exist:
embed.setTitle("😞 Suggestion Not Found")
embed.setDescription("I was unable find a suggestion with the ID of ``" + suggestionId + "``.")
embed.setColor("Red")
interaction.reply({ embeds: [embed], ephemeral: true })
    }

 } else {
   // User Doesn't Have Permissions:
  embed.setTitle("😞 Insufficient Permissions")
  embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
  embed.setColor("Red")
   interaction.reply({ embeds: [embed], ephemeral: true })
 }
}
} catch (e) {
  Sentry.captureException(e);
  console.error('Error in modifysuggestion command', e)

}

    }
}