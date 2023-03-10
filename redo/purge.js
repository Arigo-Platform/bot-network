const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Delete messages within a channel.")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of messages to purge")
        .setRequired(true)
    ),

  async execute(interaction, embed, db) {
    interaction.reply({ content: "Hello" });
  },
};
