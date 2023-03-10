const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("update")
    .setDescription("Update your server information"),

  async execute(interaction, embed, db) {
    interaction.deferReply();
    // 🤖 - Basic utilities
    const { MessageActionRow, ButtonBuilder } = require("discord.js");
    const userId = interaction.member.user.id;
    let user = interaction.guild.members.cache.get(userId);

    const { EmbedBuilder } = require("discord.js");
    const serverId = interaction.member.guild.id;
    const noblox = require("noblox.js");

    // 📁 - Check if they're verified
    const cityRef = db.collection("verification").doc(`${userId}`);
    const doc = await cityRef.get();
    if (doc.exists) {
      // Get Roblox Group
      const cityRfef = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("verification")
        .doc(`groupId`);
      const doc2 = await cityRfef.get();
      const groupId = doc2.data().id;
      // ✅ - User is verified with Arigo Platform
      let rblxUsername = await noblox.getUsernameFromId(doc.data().rblxId);

      if (interaction.member.nickname === rblxUsername) {
        // Do nothing
      } else {
        // Change Nickname
        embed.addFields({
          name: "✏️ Nickname Update",
          value: `Before → ${interaction.member.nickname}\nAfter → ${rblxUsername}`,
          inline: true,
        });
      }
      // Get rank in group
      const rankId = await noblox.getRankInGroup(groupId, doc.data().rblxId);
      // See if they're applicable to a bind
      const cityRfeff = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("verification")
        .doc(`${rankId}`);
      const doc3 = await cityRfeff.get();

      if (doc3.exists) {
        if (
          interaction.member.roles.cache.has(doc3.data().discRoleId) === true
        ) {
          embed.addFields({
            name: "✍️ Role Update",
            value: `Up to date`,
            inline: true,
          });
        } else {
          embed.addFields({
            name: "✍️ Role Update",
            value: `Added <@&${doc3.data().discRoleId}>`,
            inline: true,
          });
        }
      } else {
        embed.addFields({
          name: "✍️ Role Update",
          value: `Up to date`,
          inline: true,
        });
      }

      embed.setTitle("🏁 Account Updated");
      interaction.editReply({ embeds: [embed] });
      // Catch The Nickname Error
      user.setNickname(`${rblxUsername}`).catch((err) => {
        setTimeout(function () {
          interaction.followUp({
            content:
              "I was unable to update your server profile due to server permissions!",
            ephemeral: true,
          });
        }, 5000); //time in milliseconds
      });
      user.roles.add(doc3.data().discRoleId).catch((err) => {
        // Unable to add roles
      });
    } else {
      // 🚫 - User is NOT verified with Arigo Platform
      embed.setTitle("😞 Command Failure");
      embed.setDescription(
        "You need to be verified with Arigo Platform in order to update your account, please utilize ``/verify`` to do so."
      );
      embed.setColor("Red");
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
