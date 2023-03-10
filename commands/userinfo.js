const { SlashCommandBuilder, time } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const { string } = require("mathjs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Get information on a specific user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you'd like to view information on")
        .setRequired(true)
    ),

  async execute(interaction, embed, db, events, Sentry) {
    try {
      // Define the Var
      const user = interaction.options.getMember("user");

      const userId = user.user.id;
      const serverId = user.guild.id;
      var nickname;
      var roles;
      if (user.nickname === null) {
        nickname = "N/A";
      } else {
        nickname = user.nickname;
      }
      if (user._roles.length === 0) {
        roles = "N/A";
      } else {
        roles = user._roles.map((olddata) => `<@&${olddata}>`);
      }
      // Server Join Date
      var myDateServer = new Date(user.joinedAt);
      const dateServer = new Date(myDateServer.toGMTString());
      const timeStringServer = time(dateServer);

      // Discord Join Date
      var myDateDiscord = new Date(user.user.createdAt);
      const dateDiscord = new Date(myDateDiscord.toGMTString());
      const timeStringDiscord = time(dateDiscord);

      embed.setTitle(
        `User Information for ${user.user.username}#${user.user.discriminator}`
      );

      embed
        .addFields(
          { name: "User ID 📜", value: `${user.id}`, inline: true },

          { name: "Server Nickname 👤", value: `${nickname}`, inline: true },

          { name: " ", value: ` `, inline: false },

          {
            name: "Server Join Date ⏰",
            value: `${timeStringServer}`,
            inline: true,
          },

          {
            name: "Discord Join Date 🕰️",
            value: `${timeStringDiscord}`,
            inline: true,
          },

          { name: "Server Roles  👥", value: `${roles}`, inline: false }
        )
        .setThumbnail(
          `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`
        );
      interaction.reply({ embeds: [embed] });
      events.info("Userinfo", {
        user: `${userId}`,
        infoUser: `${user.user.id}`,
        serverId: `${serverId}`,
      });
    } catch (e) {
      Sentry.captureException(e);
      console.log("Error in userinfo command", e);
    }
  },
};
