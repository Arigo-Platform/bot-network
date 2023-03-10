const { SlashCommandBuilder } = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("calculator")
    .setDescription("Math homework? No more!")
    .addStringOption((option) =>
      option
        .setName("equation")
        .setDescription("The equation you want the bot to solve")
        .setRequired(true)
    ),

  async execute(interaction, embed, db, events, Sentry) {
    const math = require("mathjs");
    const equation = interaction.options.getString("equation");
    const userId = interaction.member.user.id;
    const serverId = interaction.member.guild.id;
    try {
      // See if it's addition
      if (equation.includes("x")) {
        const myArray = equation.split("");
        var newArray = myArray.filter(function (f) {
          return f !== "x";
        });
        try {
          math.evaluate(newArray[0] + "*" + newArray[1]);
        } catch (e) {
          embed.setTitle("⚠️ Command Failure");
          embed.setDescription(
            "I'm unable to provide an answer to that question, please try again!"
          );
          return interaction.reply({ embeds: [embed] });
        }
        embed.setTitle("🎒 Calculation");
        embed.addFields(
          {
            name: "Question",
            value: `${`\`\`\`css\n${equation}\`\`\``}`,
            inline: true,
          },

          {
            name: "Answer",
            value: `${`\`\`\`css\n${math.evaluate(
              newArray[0] + "*" + newArray[1]
            )}\`\`\``}`,
            inline: true,
          }
        );
        interaction.reply({ embeds: [embed] });
      } else {
        // See if the math is possible
        var resp;
        try {
          resp = math.evaluate(equation);
        } catch (e) {
          embed.setTitle("⚠️ Command Failure");
          embed.setDescription(
            "I'm unable to calculate that question, please try again!"
          );
          events.info("Calculator", {
            user: `${userId}`,
            equation: `${equation}`,
            success: `false`,
            serverId: `${serverId}`,
          });
          return interaction.reply({ embeds: [embed] });
        }
        // Success

        embed.setTitle("🎒 Calculation");
        embed.addFields(
          {
            name: "Question",
            value: `${`\`\`\`css\n${equation}\`\`\``}`,
            inline: true,
          },

          {
            name: "Answer",
            value: `${`\`\`\`css\n${resp}\`\`\``}`,
            inline: true,
          }
        );
        interaction.reply({ embeds: [embed] });
        events.info("Calculator", {
          user: `${userId}`,
          equation: `${equation}`,
          success: `true`,
          serverId: `${serverId}`,
        });
      }
    } catch (e) {
      Sentry.captureException(e);
      console.error("Error in calculator command", e);
    }
  },
};
