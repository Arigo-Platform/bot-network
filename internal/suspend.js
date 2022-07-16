const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('suspend')
		.setDescription('Suspend a users access to Arigo Platform.')
  
      .addStringOption(option =>
		option.setName('userid')
			.setDescription('The Discord User ID of the suspending account.')
			.setRequired(true))

    
     .addStringOption(option =>
		option.setName('reason')
			.setDescription('Reason for the platform suspension.')
			.setRequired(true))


    
  .addStringOption(option =>
		option.setName('appeal')
			.setDescription('Appeal status of the user.')
			.addChoice('True', '✅')
			.addChoice('False', '❌')
    		.setRequired(true)),

	async execute(interaction, embed, db) {
// Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        let logChannel = interaction.guild.channels.cache.get('952322005682778142')
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const moment = require('moment');

    // test
      
// Get ID

const offender = interaction.options.getString('userid');
const reason = interaction.options.getString('reason');
const appeal = interaction.options.getString('appeal');
// Check if the leave is for personal reasons

if(interaction.member._roles.includes("884605737840570399")){
  // do code things here
  const id = Math.floor(Math.random()*90000) + 10000;
  embed.setTitle("Success! :tada:")
  embed.setDescription(`I've successfully suspended <@${offender}> from Arigo Platform for ` + "``" + reason + "``. The appeal status for this case " + `(${id}) has been set to ${appeal}.`)
  embed.setColor("GREEN")
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();

if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;

const timelog = dd + '/' + mm + '/' + yyyy;

          const data = {
          appeal: appeal,
          date: timelog,
          discordId: offender,
          reason: reason
};
        const res = await db.collection('suspensions').doc(`${id}`).set(data);
  interaction.reply({ embeds: [embed] })

} else {
  embed.setTitle("Uh oh!")
        embed.setDescription("Only members in Arigo Trust & Safety have the authorization to suspend Arigo Platform accounts.")
        embed.setColor("RED")
        interaction.reply({ embeds: [embed] })
}    
  },
};