const { SlashCommandBuilder } = require("discord.js");
const {
  ButtonStyle,
  ActionRowBuilder,
  Client,
  Collection,
  Intents,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("case")
    .setDescription("View or modify case information")
    .addNumberOption((option) =>
      option
        .setName("caseid")
        .setDescription("Enter the Case ID")
        .setRequired(true)
    ),

  async execute(interaction, embed, db, events, Sentry) {
    // Basic needs 🤖
    const { MessageActionRow, ButtonBuilder } = require("discord.js");
    const username = interaction.member.user.username;
    const userId = interaction.member.user.id;
    let user = interaction.guild.members.cache.get(userId);
    const moment = require("moment");
    const wait = require("node:timers/promises").setTimeout;

    try {
      // Defining basic varvs
      const caseId = interaction.options.getNumber("caseid");
      const { EmbedBuilder } = require("discord.js");
      const serverId = interaction.member.guild.id;
      const cityRef = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("settings")
        .doc("modId");
      const doc = await cityRef.get();

      // Set Log Channel
      const cityRefff = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("settings")
        .doc("logChannel");
      const doc3 = await cityRefff.get();
      if (doc3.exists) {
        let logChannel = interaction.guild.channels.cache.get(doc3.data().id);

        // See if they have the mod role
        if (interaction.member.roles.cache.has(doc.data().id) === true) {
          // Check for Case in DB
          const cityReff = db
            .collection("bots")
            .doc(`${serverId}`)
            .collection("cases")
            .doc(`${caseId}`);
          const doc1 = await cityReff.get();
          if (doc1.exists) {
            // If Found

            // Button

            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("delete")
                .setLabel("Remove Case")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("❌")
            );

            // Embed
            const data = doc1.data();
            embed.setTitle("🔎 Case Information");
            embed.setDescription(
              `Displayed below is the Case Informaion for ` +
                "``" +
                caseId +
                "``."
            );
            embed.addFields(
              { name: "Reason 📜", value: `${data.reason}`, inline: true },

              {
                name: "Offender  👥",
                value: `<@${data.offender}> (${data.offender})`,
                inline: true,
              },

              {
                name: "Staff Member 👤",
                value: `<@${data.user}> (${data.user})`,
                inline: true,
              },

              { name: "Type 🔨", value: `${data.type}`, inline: true },

              { name: "Case ID ✍️", value: `${caseId}`, inline: true }
            );
            await interaction.deferReply({ ephemeral: true });
            events.info("Case", {
              caseId: `${caseId}`,
              type: `${data.type}`,
              user: `${data.user}`,
              offender: `${data.offender}`,
              reason: `${data.reason}`,
            });
            await wait(1000);
            interaction.editReply({
              embeds: [embed],
              ephemeral: true,
              components: [row],
            });
            const buttonOptions = ["delete", "approve", "deny"];

            const filter = (i) =>
              buttonOptions.includes(i.customId) && i.user.id === userId;

            const collector =
              interaction.channel.createMessageComponentCollector({
                filter,
                time: 15000,
              });

            // Delete Case
            collector.on("collect", async (i) => {
              if (i.customId === "delete") {
                // Verification Buttons
                const verify = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("deny")
                      .setLabel("Cancel")
                      .setStyle(ButtonStyle.Success)
                  )
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("approve")
                      .setLabel("Remove Case")
                      .setStyle(ButtonStyle.Danger)
                  );

                // Send Verification Embed

                embed.setTitle("⚠️ Caution");
                embed.setDescription(
                  "Are you sure you'd like to delete that case? This action is irreversible."
                );
                embed.setColor("Red");
                embed.setFields([]);
                await i.deferReply({ ephemeral: true });
                await wait(1000);
                i.editReply({
                  embeds: [embed],
                  ephemeral: true,
                  components: [verify],
                });
              }

              // Deny Button Clicked
              if (i.customId === "deny") {
                embed.setTitle("👍 Command Canceled");
                embed.setDescription(
                  "Phew. I didn't delete the case, we're all good!"
                );
                embed.setColor("Yellow");
                await i.deferReply({ ephemeral: true });
                await wait(1000);
                i.editReply({ embeds: [embed], ephemeral: true });
              }

              if (i.customId === "approve") {
                embed.setTitle("🎉 Case Deleted");
                embed.setDescription(
                  "Case ``" + caseId + "`` has been deleted."
                );
                embed.setColor("Green");
                await i.deferReply({ ephemeral: true });
                await wait(1000);
                i.editReply({ embeds: [embed], ephemeral: true });

                embed.setTitle("Case Deleted");
                embed.setDescription(
                  `<@${userId}> (${userId}) deleted Case #${caseId}. The case information is displayed below.`
                );
                embed.addFields(
                  { name: "Reason 📜", value: `${data.reason}`, inline: true },

                  {
                    name: "Offender  👥",
                    value: `<@${data.offender}> (${data.offender})`,
                    inline: true,
                  },

                  {
                    name: "Staff Member 👤",
                    value: `<@${data.user}> (${data.user})`,
                    inline: true,
                  },

                  { name: "Type 🔨", value: `${data.type}`, inline: true },

                  { name: "Case ID ✍️", value: `${caseId}`, inline: true }
                );
                logChannel.send({ embeds: [embed] });
                // Log in Datadog
                events.info("CaseDeleted", {
                  caseId: `${caseId}`,
                  type: `${data.type}`,
                  user: `${data.user}`,
                  offender: `${data.offender}`,
                  reason: `${data.reason}`,
                });
                cityReff.delete();
              }
            });

            collector.on("end", (collected) =>
              console.log(`Collected ${collected.size} items`)
            );

            // Case Not Found
          } else {
            embed.setTitle("😞 Case Not Found");
            embed.setDescription(
              "I was unable find a case with the ID of ``" + caseId + "``."
            );
            embed.setColor("Red");
            interaction.reply({ embeds: [embed], ephemeral: true });
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
          interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } else {
        embed.setTitle("⚠️ Logging Channel Not Set ");
        embed.setDescription(
          "A logging channel is not set via the dashboard and the server ban has not been issued. You can set the channel on the workspace dashbord.\n\nPlease redo the command once there is a Log Channel ID set on the dashboard. For assistance, please contact the [Arigo Platform Support Team](https://support.arigoapp.com)."
        );
        embed.setColor("Red");
        interaction.reply({ embeds: [embed], ephemeral: true });
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in case command", e);
    }
  },
};
