const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Delete messages within a channel.')
    .addNumberOption(option =>
		option.setName('amount')
			.setDescription('The number of messages to purge')
			.setRequired(true)),
  
	async execute(interaction, embed, db) {
        // Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
      // Defining basic varvs
        const offender = interaction.options.getUser('user');
        let offenderInfo = interaction.guild.members.cache.get(offender.id)
        const reason = interaction.options.getString('reason')
        const { MessageEmbed } = require('discord.js');
        const serverId = interaction.member.guild.id
        const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('kickModId');
        const doc = await cityRef.get();

        // Check for permissions
        if(interaction.member.roles.cache.has(doc.data().id) === true) {
    

			const amount = parseInt(args[0]) + 1;
			if (isNaN(amount)) {
				msg.channel.bulkDelete(1);
				return msg.channel.send(invalidnumber)
					.then(msg => {
						msg.delete({ timeout: 5000 });
					})
					.catch(console.error);
			}
			else if (amount <= 1 || amount >= 52) {
				msg.channel.bulkDelete(1);
				const limit = new Discord.MessageEmbed()
					.setColor('FF0000')
					.setTitle('Limit Exceeded!')
          			.setFooter(`Powered by ${(guildSettings.branding ? "Stryx.cloud" : client.user.username)}`)
					.setDescription(`${msg.author}, the maxium purge limit is 50 messages.`);
				return msg.channel.send(limit)
					.then(msg => {
						msg.delete({ timeout: 5000 });
					})
					.catch(console.error);
			}
			msg.channel.bulkDelete(amount, true).catch(err => {
				console.error(err);
				msg.channel.bulkDelete(1);
				const error = new Discord.MessageEmbed()
					.setColor('FF0000')
					.setTitle('Error!')
					.setDescription(`There was an error trying to purge messages in this channel ${msg.author}!.\n\n**Debugging:**\n||${err.msg}||`);
				msg.channel.send(error);
			});

          } else {  
           // They don't have the required role to run the command
            embed.setTitle("😞 Insufficient Permissions")
            embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
           embed.setColor("RED")
           interaction.reply({ embeds: [embed], ephemeral: true })

   
  }

  },
};