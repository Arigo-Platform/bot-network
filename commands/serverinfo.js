const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Get information on the server'),
  
	async execute(interaction, embed, db) {

    // Define the Var
    const server = interaction.guild
    const d = new Date( server.createdTimestamp );
    const serverCreated = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
    embed.setTitle(`Sever Information for ${server.name}`)
    embed.addFields(
      { name: 'Server ID 📜', value: `${server.id}`, inline: true  },

  		{ name: 'Member Count  👥', value: `${server.memberCount}`, inline: true  },

      { name: 'Role Count 👤', value: `${server.roles.cache.size}}`, inline: true  },

      { name: 'Server Owner 👑', value: `<@${server.ownerId}>`, inline: true },

      { name: 'Emoji Count 😃', value: `${server.emojis.cache.size}`, inline: true },
      
      { name: 'Server Creation Date 📆', value: `${serverCreated}`, inline: true }
	)
    interaction.reply({ embeds: [embed ]})
  }
}
