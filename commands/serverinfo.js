const { CONSOLE_LEVELS } = require("@sentry/utils");
const { json } = require("body-parser");
const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Get information on the server"),

  async execute(interaction, embed, db, events, Sentry) {
    try {
      // Define the Var
      const username = interaction.member.user.username;
      const userId = interaction.member.user.id;
      const server = interaction.guild;
      const serverId = server.id;

      embed.setTitle(`Server Information for ${server.name}`);
      embed
        .addFields(
          { name: "Server ID 📜", value: `${server.id}`, inline: true },

          {
            name: "Member Count  👥",
            value: `${server.memberCount.toLocaleString()}`,
            inline: true,
          },

          {
            name: "Role Count 👤",
            value: `${server.roles.cache.size}`,
            inline: true,
          },

          {
            name: "Server Owner 👑",
            value: `<@${server.ownerId}>`,
            inline: true,
          },

          {
            name: "Emoji Count 😃",
            value: `${server.emojis.cache.size}`,
            inline: true,
          },

          {
            name: "Server Creation Date 📆",
            value: `<t:${parseInt(server.createdTimestamp / 1000, 10)}> `,
            inline: true,
          }
        )
        .setThumbnail(
          `https://cdn.discordapp.com/icons/${server.id}/${server.icon}.png`
        );
      interaction.reply({ embeds: [embed] });
      events.info("Serverinfo", { user: `${userId}`, serverId: `${serverId}` });
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in serverinfo command", e);
    }
  },
};
