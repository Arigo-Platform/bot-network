const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { string } = require('mathjs');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Get information on a specific user')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you\'d like to view information on')
                .setRequired(true)),
  
	async execute(interaction, embed, db) {

    // Define the Var
    const user = interaction.user
    var roles = interaction.member._roles.map(olddata => `<@&${olddata}>`)

    embed.setTitle(`User Information for ${user.username}#${user.discriminator}`)
    embed.addFields(
      { name: 'User ID 📜', value: `${user.id}`, inline: true  },

      { name: 'Server Nickname 👤', value: `${interaction.member.nickname}`, inline: true  },

      { name: 'Server Roles  👥', value: `${roles}`, inline: false  },

	)
    .setThumbnail(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
    interaction.reply({ embeds: [embed ]})
    
  }
}
