const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('denyloa')
		.setDescription('Using this command will deny an LOA request')
    .addStringOption(option =>
		option.setName('loa-id')
			.setDescription('The ID of the LOA you want to approve')
			.setRequired(true))
      .addStringOption(option =>
		option.setName('reason')
			.setDescription('The reason for denying the LOA')
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
    const loaID = interaction.options.getString('loa-id');
        const reason = interaction.options.getString('reason');

    const { MessageEmbed } = require('discord.js');

// code
   if(interaction.member._roles.includes("952321850443169802")){
     // DB
      var docRef = db.collection("internal-loa").doc(loaID);
      docRef.get().then((doc) => {
        if(doc.exists) {
                  let usertosend = interaction.guild.members.cache.get(doc.data().userId )

          embed.setTitle("Your LOA has been denied! 😔")
          embed.setDescription("Your LOA request starting on ``" + doc.data().start + "`` and ending on ``" + doc.data().end + "`` with the ID ``" + loaID + "`` has been denied by " + `<@${userId}>.`)
          .addField("Reason", reason)
          embed.setColor("RED")

        usertosend.send({ embeds: [embed] })
    const embed2 = new MessageEmbed()
           embed2.setAuthor({
  name: interaction.member.user.username,
  iconURL: interaction.member.user.avatarURL()
  }),
    embed2.setFooter({
  text: "Powered by Arigo Platform",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
    embed2.setTimestamp()
        embed2.setTitle("Success!")
        embed2.setDescription(`You've denied the LOA for <@${doc.data().userId}>! They've received a DM to notify them.`)
          embed2.addField("Reason", reason)
        embed2.setColor("GREEN")
        interaction.reply({ embeds: [embed2] })

    const embed3 = new MessageEmbed()
           embed3.setAuthor({
  name: interaction.member.user.username,
  iconURL: interaction.member.user.avatarURL()
  }),
    embed3.setFooter({
  text: "Powered by Arigo Platform",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
    embed3.setTimestamp()
       embed3.setTitle("New LOA Denied")
      embed3.setDescription("The LOA request for <@" +   doc.data().userId + "> , starting on ``" + doc.data().start + "`` and ending on ``" + doc.data().end + "`` with the ID ``" + loaID + "`` has been denied by " + `<@${userId}>.`)
          embed3.addField("Reason", reason)
          embed3.setColor("RED")

        logChannel.send({ embeds: [embed3] })
        } else {
          embed.setTitle("Uh oh!")
          embed.setDescription("I was unable to find an LOA case matching the provided ID. If you beleive this is a mistake, please notify <@473903419497775114> immediately.")
          embed.setColor("RED")
          interaction.reply({ embeds: [embed] })
        }
      })
     
      } else {
        embed.setTitle("Uh oh!")
        embed.setDescription("Only members in Arigo Human Resources have the authorization to modify LOA requests.")
        embed.setColor("RED")
        interaction.reply({ embeds: [embed] })
      }

    
  },
};