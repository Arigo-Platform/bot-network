const { SlashCommandBuilder } = require("discord.js");
const { ActionRowBuilder, Client, Collection, Intents } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("verify")
    .setDescription("Verify with your Roblox account")
    .addStringOption((option) =>
      option
        .setName("username")
        .setDescription("Your Roblox username")
        .setRequired(true)
    ),

  async execute(interaction, embed, db) {
    interaction.deferReply();
    function myFunction() {
      // Select Device Buttons
      const device = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("completed")
            .setLabel("Code Added")
            .setStyle("PRIMARY")
            .setEmoji("✅")
        )
        .addComponents(
          new ButtonBuilder()
            .setURL(`https://roblox.com/users/${robloxId}/profile`)
            .setLabel("Roblox Profile")
            .setStyle("LINK")
        );
      // Create button filters
      const buttonOptions = ["completed"];
      const filter = (i) =>
        buttonOptions.includes(i.customId) && i.user.id === discordId;

      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        time: 120000,
      });
      // Get Emojis
      const emoji1 = randomEmoji();
      const emoji2 = randomEmoji();
      const emoji3 = randomEmoji();
      const emoji4 = randomEmoji();
      const emoji5 = randomEmoji();
      const emoji6 = randomEmoji();
      const emojis = emoji1 + emoji2 + emoji3 + emoji4 + emoji5 + emoji6;
      // Send message with code
      embed.setTitle("📑 Verify your account");
      embed.setDescription(
        `Please paste the following code in your roblox About Me and click the "Code Added" button when done.\n\n**Code:** ` +
          "``" +
          emojis +
          "``"
      );
      interaction
        .editReply({ embeds: [embed], components: [device] })
        .then((done) => {
          // Mobile ease of access
          interaction.followUp({
            content: "📱 If on mobile, use the code ``" + emojis + "``.",
            ephemeral: true,
          });
        });
      // Check For Button Pressed
      collector.on("collect", async (i) => {
        if (i.customId === "completed") {
          // Get Blurb
          let blurb = await noblox.getBlurb({ userId: robloxId });
          await wait(1000);
          // Get Username
          let robloxUsername = await noblox.getUsernameFromId(robloxId);

          // Check if they added the code
          if (blurb.includes(emojis)) {
            // Code added
            embed.setTitle(
              `👋 Welcome to ${interaction.member.guild.name}, ${robloxUsername}`
            );
            embed.setColor("Green");
            embed.setDescription(
              `${robloxUsername}, you've been verified with Arigo Platform so you've been given the <@&${
                verroleid.data().id
              }> role!`
            );
            interaction.editReply({ embeds: [embed], components: [] });
            // Add to database
            const data = {
              rblxId: robloxId,
              type: "roblox",
              verifiedOn: serverId,
              platform: "Arigo",
            };
            const res = await db
              .collection("verification")
              .doc(`${discordId}`)
              .set(data);

            // Send to Slack
            const result = await web.chat.postMessage({
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*${interaction.user.username}* (${interaction.user.id}) has verified in ${interaction.guild.name} (${interaction.guildId}) as ${robloxUsername} (${robloxId}).`,
                  },
                },
              ],
              channel: threatSlack,
            });

            console.log(
              `Successfully send message ${result.ts} in conversation ${threatSlack}`
            );
          } else {
            embed.setTitle("⚠️ Command Failure");
            embed.setDescription(
              "We were unable to locate the code in your Roblox About Me section. Please try again if you believe this is an error."
            );
            embed.setColor("Red");
            interaction.editReply({ embeds: [embed], components: [] });
          }
          // Stop the collector
          collector.stop();
        }
      });
    }
    // Basic needs 🤖

    const { MessageActionRow, ButtonBuilder } = require("discord.js");
    const axios = require("axios");
    const noblox = require("noblox.js");
    const wait = require("node:timers/promises").setTimeout;
    const discordUsername = interaction.member.user.username;
    const discordId = interaction.member.user.id;
    let user = interaction.guild.members.cache.get(discordId);
    const randomEmoji = require("random-happy-emoji");
    const serverId = interaction.member.guild.id;
    const robloxinputUsername = interaction.options.getString("username");
    // Slack Stuff
    const { WebClient } = require("@slack/web-api");
    // Read a token from the environment variables
    const Slacktoken =
      "xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2";
    // Initialize
    const web = new WebClient(Slacktoken);
    const conversationId = "C037PJVBAAE";
    const threatSlack = "C03DVRER6JG";

    // Get Their Roblox ID
    try {
      let robloxId = await noblox.getIdFromUsername(robloxinputUsername);
    } catch {
      // Invalid Roblox Username
      embed.setTitle("⚠️ Invalid Roblox Username");
      embed.setDescription(
        "The provided username, ``" +
          robloxinputUsername +
          "``, isn't a valid Roblox username."
      );
      embed.setColor("Red");
      return interaction.editReply({ embeds: [embed], ephemeral: true });
    }
    // Get Verified Role ID
    var cityReff = db
      .collection("bots")
      .doc(`${serverId}`)
      .collection("verification")
      .doc("verified");
    const verroleid = await cityReff.get();
    // Define Roblox ID
    let robloxId = await noblox.getIdFromUsername(robloxinputUsername);

    myFunction();

    // See if they're verified in Arigo
    axios
      .get(
        `https://api-test-for-client-id.ishaanfrom.repl.co/bot/verification/discord/${discordId}/${serverId}`
      )
      .then(async function (response) {
        // Successful API Response:
        // See if they're not verified
        if (response.data.status === "ok") {
          // See if they're attempting to verify with the account provided
          let providedRobloxId = await noblox.getIdFromUsername(
            robloxinputUsername
          );
          const apiRobloxId = response.data.robloxId;
          if (providedRobloxId === response.data.robloxId) {
            // Attempting to verify with provided account (success)
            let robloxUsername = await noblox.getUsernameFromId(apiRobloxId);
            embed.setTitle(
              `👋 Welcome to ${interaction.member.guild.name}, ${robloxUsername}`
            );
            embed.setDescription(
              `${robloxUsername}, you're already verified within the Arigo Platform Verification Registry so you've been given the <@&${
                verroleid.data().id
              }> role!`
            );
            interaction.editReply({ embeds: [embed] });
            // Add Verified Role
            user.roles.add(verroleid.data().id);
            return;
          } else if (providedRobloxId != apiRobloxId) {
            // Attempting to verify with secondary account (proceed)
            let robloxUsername = await noblox.getUsernameFromId(
              response.data.robloxId
            );
            // Button Creation
            const options = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("verify")
                  .setLabel("Verify")
                  .setStyle("PRIMARY")
                  .setEmoji("✅")
              )
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("secondary")
                  .setLabel("Verify With Secondary Account")
                  .setStyle("SECONDARY")
                  .setEmoji("📝")
              );
            embed.setTitle("📖 Different Account Located");
            embed.setDescription(
              "You've have previously verified using the account ``" +
                robloxUsername +
                "``, do you wish to verify with this account or verify with a new account?"
            );
            interaction.editReply({ embeds: [embed], components: [options] });

            // Create button filters
            const buttonOptions = ["verify", "secondary"];
            const filter = (i) =>
              buttonOptions.includes(i.customId) && i.user.id === discordId;

            const collector =
              interaction.channel.createMessageComponentCollector({
                filter,
                time: 120000,
              });

            // Primary account verification
            try {
              collector.end();
            } catch {
              // No collector
            }

            collector.on("collect", async (i) => {
              if (i.customId === "secondary") {
                // Select Device Buttons
                const device = new ActionRowBuilder()
                  .addComponents(
                    new ButtonBuilder()
                      .setCustomId("completed")
                      .setLabel("Code Added")
                      .setStyle("PRIMARY")
                      .setEmoji("✅")
                  )
                  .addComponents(
                    new ButtonBuilder()
                      .setURL(`https://roblox.com/users/${robloxId}/profile`)
                      .setLabel("Roblox Profile")
                      .setStyle("LINK")
                  );
                // Create button filters
                const buttonOptions = ["completed"];
                const filter = (i) =>
                  buttonOptions.includes(i.customId) && i.user.id === discordId;

                const collector =
                  interaction.channel.createMessageComponentCollector({
                    filter,
                    time: 120000,
                  });
                // Get Emojis
                const emojiList = [
                  "😃",
                  "😀",
                  "😄",
                  "😁",
                  "😆",
                  "😅",
                  "🤣",
                  "😂",
                  "😎",
                  "🙈",
                  "🥳",
                  "🥸",
                  "🥺",
                  "🥱",
                  "🎃",
                  "🐶",
                  "🐱",
                  "🐭",
                  "🐹",
                  "🦊",
                  "🦆",
                  "🐻",
                  "🐸",
                  "🐼",
                  "🐤",
                  "🐣",
                  "🐠",
                  "🦞",
                  "🐬",
                  "🍏",
                  "🍎",
                  "🍐",
                  "🍊",
                  "🍋",
                  "🍉",
                  "🍇",
                  "🍓",
                  "🍕",
                  "🌭",
                  "🍟",
                  "🍖",
                  "⚽️",
                  "🏀",
                  "🏈",
                  "⚾️",
                  "🥎",
                  "🛹",
                  "🚗",
                ];

                const emoji1 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emoji2 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emoji3 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emoji4 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emoji5 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emoji6 =
                  emojiList[Math.floor(Math.random() * emojiList.length)];
                const emojis =
                  emoji1 + emoji2 + emoji3 + emoji4 + emoji5 + emoji6;

                // Send message with code
                embed.setTitle("📑 Verify your account");
                embed.setDescription(
                  `Please paste the following code in your roblox About Me and click the "Code Added" button when done.\n\n**Code:** ` +
                    "``" +
                    emojis +
                    "``"
                );
                interaction
                  .editReply({ embeds: [embed], components: [device] })
                  .then((done) => {
                    // Mobile ease of access
                    interaction.followUp({
                      content:
                        "📱 If on mobile, use the code ``" + emojis + "``.",
                      ephemeral: true,
                    });
                  });
                // Check For Button Pressed
                collector.on("collect", async (i) => {
                  if (i.customId === "completed") {
                    // Get Blurb
                    let blurb = await noblox.getBlurb({ userId: robloxId });
                    await wait(1000);
                    // Get Username
                    let robloxUsername = await noblox.getUsernameFromId(
                      robloxId
                    );

                    // Check if they added the code
                    if (blurb.includes(emojis)) {
                      // Code added
                      embed.setTitle(
                        `👋 Welcome to ${interaction.member.guild.name}, ${robloxUsername}`
                      );
                      embed.setColor("Green");
                      embed.setDescription(
                        `${robloxUsername}, you've been verified with Arigo Platform so you've been given the <@&${
                          verroleid.data().id
                        }> role!`
                      );
                      interaction.editReply({
                        embeds: [embed],
                        components: [],
                      });
                      // Add to database
                      const data = {
                        rblxId: robloxId,
                        type: "roblox",
                        verifiedOn: serverId,
                        platform: "Arigo",
                      };
                      const res = await db
                        .collection("verification")
                        .doc(`${discordId}`)
                        .set(data);

                      // Send to Slack

                      // Post a message to the channel, and await the result.
                      // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
                      const result = await web.chat.postMessage({
                        blocks: [
                          {
                            type: "section",
                            text: {
                              type: "mrkdwn",
                              text: `*${interaction.user.username}* (${interaction.user.id}) has verified in ${interaction.guild.name} (${interaction.guildId}) as ${robloxUsername} (${robloxId}).`,
                            },
                          },
                        ],
                        channel: threatSlack,
                      });

                      console.log(
                        `Successfully send message ${result.ts} in conversation ${threatSlack}`
                      );
                    } else {
                      embed.setTitle("⚠️ Command Failure");
                      embed.setDescription(
                        "We were unable to locate the code in your Roblox About Me section. Please try again if you believe this is an error."
                      );
                      embed.setColor("Red");
                      interaction.editReply({
                        embeds: [embed],
                        components: [],
                      });
                    }
                    // Stop the collector
                    collector.stop();
                  }
                });
              }
              if (i.customId === "verify") {
                embed.setTitle(
                  `👋 Welcome to ${interaction.member.guild.name}, ${robloxUsername}`
                );
                embed.setDescription(
                  `${robloxUsername}, you're already verified within the Arigo Platform Verification Registry so you've been given the <@&${
                    verroleid.data().id
                  }> role!`
                );
                interaction.editReply({ embeds: [embed], components: [] });
                // Add Verified Role
                return user.roles.add(verroleid.data().id);
              }
            });
          }
        }
        if (response.data.status === "error") {
          // Verify Them Manually (firstly check w/ bloxlink)
          myFunction();
        }
        embed.setTitle("⏰ Expired Event");
        embed.setDescription(
          `This verification attempt has expired due to inactivity. Please rerun the command.`
        );
        embed.setColor("Red");
      });
  },
};
