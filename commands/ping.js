const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const { random } = require("mathjs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Display the ping & uptime of the bot"),

  async execute(interaction, embed, db, events, Sentry) {
    try {
      const userId = interaction.member.user.id;
      const serverId = interaction.member.guild.id;
      var ping = Date.now() - interaction.createdTimestamp + " ms";
      embed.setTitle("Ping 🙋");
      embed.setDescription("The bot's ping is ``" + ping + "``.");
      interaction.reply({ embeds: [embed] });
      events.info("Ping", {
        user: `${userId}`,
        ping: `${ping}`,
        serverId: `${serverId}`,
      });
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in ping command", e);
    }
  },
};
