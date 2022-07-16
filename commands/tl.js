const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('tl')
		.setDescription('Modify the threat level')
    .addStringOption(option =>
		option.setName('threat')
			.setDescription('Set the server threat level')
			.setRequired(true)
			.addChoice('T0', '0')
			.addChoice('T1', '1')
			.addChoice('T2', '2')
    	.addChoice('T3', '3')),
  
	async execute(interaction, embed, db) {
// Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const moment = require('moment');
    const wait = require('node:timers/promises').setTimeout;

    
// Defining basic varvs
        const threat = interaction.options.getString('threat');

        const { MessageEmbed } = require('discord.js');
        const serverId = interaction.member.guild.id
let chat = interaction.guild.channels.cache.get("944434855452749844")
let commands = interaction.guild.channels.cache.get("944434847777165312")
 let updates = interaction.guild.channels.cache.get("864016187242971175")


 if(interaction.member.roles.cache.has("864016187226718251") === true) {

if(threat === '3') {
console.log(threat)
chat.setRateLimitPerUser(5, "Threat Level 1 Inititated");
commands.setRateLimitPerUser(10, "Threat Level 1 Inititated");
interaction.member.guild.setVerificationLevel(4)
embed.setTitle("Threat Level 3 Initiated")
embed.setDescription(`Due to recent events that occured in the server, security protocols have been actived by <@${userId}> to mitigate further damange.`)
embed.setColor("RED")
interaction.reply({ embeds: [embed], ephemeral: true })
chat.send({ embeds: [embed] })
commands.send({ embeds: [embed] })
updates.send({ embeds: [embed] })

}

if(threat === '2') {
console.log(threat)
chat.setRateLimitPerUser(3, "Threat Level 2 Inititated");
commands.setRateLimitPerUser(5, "Threat Level 2 Inititated");
interaction.member.guild.setVerificationLevel(3)
embed.setTitle("Threat Level 2 Initiated")
embed.setDescription(`Due to recent events that occured in the server, security protocols have been actived by <@${userId}> to mitigate further damange.`)
embed.setColor("RED")
interaction.reply({ embeds: [embed], ephemeral: true })
chat.send({ embeds: [embed] })
commands.send({ embeds: [embed] })
updates.send({ embeds: [embed] })

}

   if(threat === '1') {
console.log(threat)
chat.setRateLimitPerUser(2, "Threat Level 1 Inititated");
commands.setRateLimitPerUser(3, "Threat Level 1 Inititated");
interaction.member.guild.setVerificationLevel(2)
embed.setTitle("Threat Level 1 Initiated")
embed.setDescription(`Due to recent events that occured in the server, security protocols have been actived by <@${userId}> to mitigate further damange.`)
embed.setColor("YELLOW")
interaction.reply({ embeds: [embed], ephemeral: true })
chat.send({ embeds: [embed] })
commands.send({ embeds: [embed] })
updates.send({ embeds: [embed] })

}
   if(threat === '0') {
console.log(threat)
chat.setRateLimitPerUser(0, "Threat Level 0 Inititated");
commands.setRateLimitPerUser(0, "Threat Level 0 Inititated");
interaction.member.guild.setVerificationLevel(1)
embed.setTitle("Threat Level Removal Protocol Initiated")
embed.setDescription(`<@${userId}> has cleared the server and has decided to restore full & regular access to Arigo Community. For any questions involving the recent events that occured, please email Arigo Trust & Safety at ` + "``moderation@arigoapp.com``.")
embed.setColor("GREEN")
interaction.reply({ embeds: [embed], ephemeral: true })
chat.send({ embeds: [embed] })
commands.send({ embeds: [embed] })
updates.send({ embeds: [embed] })

}

 }
  }}