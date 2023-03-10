const { CONSOLE_LEVELS } = require("@sentry/utils");
const {
  Client,
  Collection,
  Intents,
  ApplicationCommandOptionWithChoicesAndAutocompleteMixin,
} = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Mass-delete messages in a channel.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of messages you want to delete")
        .setRequired(true)
    ),

  async execute(interaction, embed, db, events, Sentry) {
    try {
      // Defer Reply
      const { MessageActionRow, ButtonBuilder } = require("discord.js");
      const username = interaction.member.user.username;
      const userId = interaction.member.user.id;
      const serverId = interaction.member.guild.id;
      const moment = require("moment");
      const amount = interaction.options.getInteger("amount");
      const channel = interaction.channel;
      const { EmbedBuilder } = require("discord.js");

      // Get General Moderator ID
      const cityRef = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("settings")
        .doc("modId");
      const doc = await cityRef.get();

      // Set Log Channel
      const cityReff = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("settings")
        .doc("logChannel");
      const doc2 = await cityReff.get();
      if (doc2.exists) {
        let logChannel = interaction.guild.channels.cache.get(doc2.data().id);
        // See if they have the General Moderator role
        if (interaction.member.roles.cache.has(doc.data().id) === true) {
          if (amount > 100) {
            embed.setTitle("😞 Purge Limit Reached");
            embed.setDescription(
              "You're only able to puge 100 messages at a time, due to the Discord API."
            );
            embed.setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
          // See if the amount if valid
          if (amount >= 1) {
            channel.bulkDelete(amount, true);
            events.info("Purge", {
              user: `${userId}`,
              amount: `${amount}`,
              channel: `${channel.id}`,
              serverId: `${serverId}`,
            });

            // Send Success Message
            embed.setTitle("🎉 Success");
            embed.setDescription(
              `I've successfully purged ${amount} message(s)`
            );
            embed.setColor("Green");
            interaction.reply({ embeds: [embed], ephemeral: true });

            // Send logs to log channel
            embed.setTitle("📜 Messages Purged");
            embed.setDescription(
              `${username} (${userId}) has purged messages in a channel.`
            );
            embed.addFields(
              { name: "Channel", value: `<#${channel.id}>`, inline: true },
              { name: "Amount", value: `${amount}`, inline: true }
            );
            embed.setColor(interaction.guild.members.me.displayColor);
            logChannel.send({ embeds: [embed] });
          } else {
            embed.setTitle("😞 Invalid Amount");
            embed.setDescription(
              "You cannot purge 0 messages, please try with a value greater than 0."
            );
            embed.setColor("Red");
            return interaction.reply({ embeds: [embed], ephemeral: true });
          }
        } else {
          // They don't have the required role to run the command
          embed.setTitle("😞 Insufficient Permissions");
          embed.setDescription(
            "You don't have permissions to run this command. This command requires the <@&" +
              doc.data().id +
              "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator."
          );
          embed.setColor("Red");
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } else {
        // Log Channel not set
        embed.setTitle("⚠️ Logging Channel Not Set ");
        embed.setDescription(
          "A logging channel is not set via the dashboard and the server unban has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com)."
        );
        embed.setColor("Red");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in purge command", e);
    }
  },
};
