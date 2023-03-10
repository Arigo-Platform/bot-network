const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const { zeros } = require("mathjs");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Set a channel slowmode")
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("The amount of slowmode you wish to set in seconds")
        .setRequired(true)
    ),
  async execute(interaction, embed, db, events, Sentry) {
    try {
      // Basic Utilities
      const serverId = interaction.member.guild.id;
      const durationstring = interaction.options.getString("duration");
      const duration = parseInt(durationstring);
      const cityRef = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("settings")
        .doc("modId");
      const doc = await cityRef.get();
      let channel = interaction.guild.channels.cache.get(interaction.channelId);
      const username = interaction.member.user.username;
      const userId = interaction.member.user.id;

      // Check for permissions
      if (interaction.member.roles.cache.has(doc.data().id) === true) {
        console.log(duration);
        if (duration === "0" || durationstring === "off") {
          console.log("tf");
          channel.setRateLimitPerUser(
            "0",
            `The channel slowmode was removed by ${username} (${userId}).`
          );
          embed.setTitle("🎉 Slowmode Removed");
          embed.setDescription(
            `I've successfully disabled slowmode for this channel.`
          );
          embed.setColor("Green");
          return interaction.reply({ embeds: [embed] });
        }
        // Invalid Amount
        if (isNaN(duration)) {
          embed.setTitle("⚠️ Command Failure");
          embed.setDescription(
            "Please enter a valid time for slowmode, such as `/slowmode 3`"
          );
          embed.setColor("Red");
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
        // Slowmode too long
        if (duration > "21600") {
          embed.setTitle("⚠️ Command Failure");
          embed.setDescription(
            "I'm unable to set a slowmode for the provided duration. Please provide a value less than or equal to ``21600`` seconds."
          );
          embed.setColor("Red");
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Set The Slowmode
        channel.setRateLimitPerUser(
          duration,
          `This slowmode was issued by ${username} (${userId}).`
        );
        embed.setTitle("🎉 Slowmode Set");
        embed.setDescription(
          `I've set a slowmode in this channel for **${duration} second${
            duration > 1 ? "s" : ""
          }**.` + " Use `/slowmode off` to disable slowmode for this channel."
        );
        embed.setColor("Green");
        interaction.reply({ embeds: [embed] });
        events.info("Slowmode", {
          user: `${userId}`,
          channelId: `${interaction.channelId}`,
          duration: `${duration}`,
          serverId: `${serverId}`,
        });
      } else {
        // No Permission
        embed.setTitle("😞 Insufficient Permissions");
        embed.setDescription(
          "You don't have permissions to run this command. This command requires the <@&" +
            doc.data().id +
            "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator."
        );
        embed.setColor("Red");
        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in slowmode command", e);
    }
  },
};
