const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("createbind")
    .setDescription("Create a Roblox-Discord bind")
    .addNumberOption((option) =>
      option
        .setName("roblox_role_id")
        .setDescription("Enter the Roblox Role ID")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("discord_role")
        .setDescription("The subsequent Discord Role")
        .setRequired(true)
    ),

  async execute(interaction, embed, db) {
    // 🤖 - Basic utilities
    const { MessageActionRow, ButtonBuilder } = require("discord.js");
    const userId = interaction.member.user.id;
    const { EmbedBuilder } = require("discord.js");
    const caseId = Math.floor(Math.random() * 90000) + 10000;
    const serverId = interaction.member.guild.id;
    const noblox = require("noblox.js");
    const roleId = interaction.options.getNumber("roblox_role_id");
    const discordRole = interaction.options.getRole("discord_role");

    // 📁 - Check for permission
    const cityRef = db
      .collection("bots")
      .doc(`${serverId}`)
      .collection("verification")
      .doc("access");
    const doc = await cityRef.get();

    // 🔐 - See if they have the access role
    if (interaction.member.roles.cache.has(doc.data().id) === true) {
      // ✅ - User has access to utilize command
      // Get Roblox Group
      const cityRfef = db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("verification")
        .doc(`groupId`);
      const doc2 = await cityRfef.get();
      const groupId = doc2.data().id;
      // 🤔 - See if Role ID is valid
      try {
        const customerRole = await noblox.getRole(groupId, roleId);
      } catch {
        embed.setTitle("⚠️ Invalid Role ID");
        embed.setDescription(
          "The provided Roblox Role ID, ``" + roleId + "``, is invalid."
        );
        embed.setColor("Red");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      // 💻 - All vars are valid, add bind to database
      const data = {
        groupId: groupId,
        rblxRoleId: roleId,
        discRoleId: discordRole.id,
        creator: userId,
      };
      const res = await db
        .collection("bots")
        .doc(`${serverId}`)
        .collection("verification")
        .doc(`${roleId}`)
        .set(data);
      // ✅ Send Success Command
      embed.setTitle("🎉 Success!");
      embed.setDescription(
        "You've binded the Role ID ``" +
          roleId +
          "`` (``" +
          groupId +
          "``) to the <@&" +
          discordRole.id +
          "> role.\n\nThis bind will be put into **immediate** effect and will replace any duplicate old bind."
      );
      embed.setColor("Green");
      interaction.reply({ embeds: [embed] });
    } else {
      // 🚫 - They don't have the required role to run the command
      embed.setTitle("😞 Insufficient Permissions");
      embed.setDescription(
        "You don't have permissions to run this command. This command requires the <@&" +
          doc.data().id +
          "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator."
      );
      embed.setColor("Red");
      interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
