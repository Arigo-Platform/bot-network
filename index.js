(async () => {
  const fs = require("fs");
  const {
    Routes,
    REST,
    SlashCommandBuilder,
    ButtonStyle,
    ChannelType,
    PermissionFlagsBits,
    ActionRowBuilder,
    GatewayIntentBits,
    Client,
    EmbedBuilder,
    Collection,
    Partials,
    Events,
    StringSelectMenuBuilder,
    Presence,
    WebhookClient,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActivityType,
    CommandInteractionOptionResolver,
  } = require("discord.js");

  // MAKE SURE TO TURN ON NODE DEPLOY COMMANDS- JS
  // const guildId = process.env["guildId"]
  // const clientId = process.env["clientId"]
  let environment
  if(process.env['env'] === "production") {
    environment = "production";
  } else {
    environment = "development"
  }

  // MAKE SURE TO TURN ON NODE DEPLOY COMMANDS- JS
  // const token = 'OTUyMzEwNzYxODY5NDEwNDU1.GxTOp_.Wlbpsux_Kzl7yZ7_0K1e6J7hK7ysch7gzyz9dI'
  // const guildId = "864016187107966996";
  // const clientId = "952310761869410455";
  // const environment = "development";

  //----
  const express = require("express");
  const app = express();
  const axios = require("axios");
  const {
    MessageActionRow,
    ButtonBuilder,
    Modal,
    TextInputComponent,
  } = require("discord.js");
  const { execSync } = require("child_process");
  const deployCommands = require("./deploy-commands");
  const discordTranscripts = require("discord-html-transcripts");
  const { Configuration, OpenAIApi } = require("openai");

  // Sentry Info
  const Sentry = require("@sentry/node");
  // or use es6 import statements
  // import * as Sentry from '@sentry/node';

  const SentryCore = require("@sentry/core");

  const Tracing = require("@sentry/tracing");
  // or use es6 import statements
  // import * as Tracing from '@sentry/tracing';

  Sentry.init({
    dsn: "https://6a44c1853d94409a908ebbf48c5bde32@o4504084672610304.ingest.sentry.io/4504085017133056",
    environment: environment,
    tracesSampleRate: 1.0,
  });

  // Sentry.setContext("Bot Information", {
  //   guildId: guildId,
  //   clientId: clientId,
  // });
  // Sentry.setTag("guildId", guildId);
  // Sentry.setTag("clientId", clientId);

  // const transaction = Sentry.startTransaction({
  //   op: "bot-network",
  //   name: "Arigo Bot Network",
  // });
  // Database
  const { Firestore } = require("@google-cloud/firestore");
  const firestore = new Firestore();
  const db = new Firestore({
    projectId: "arigo-platform",
    keyFilename: "key.json",
  });
  const { Storage } = require("@google-cloud/storage");
  const storage = new Storage({
    projectId: "arigo-platform",
    keyFilename: "key.json",
  });
  // const getPort = db.collection('bots').doc(`${guildId}`)
  // const portValue = await getPort.get();
  // const port = portValue.data().port
  const port = "4000";

  // Slack info
  const { WebClient } = require("@slack/web-api");
  const { json } = require("body-parser");
  // Read a token from the environment variables
  const Slacktoken =
    "xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2";
  // Initialize
  const web = new WebClient(Slacktoken);
  const conversationId = "C037PJVBAAE";
  const threatSlack = "C03TPE2MAFP";

  // Datadog Events
  const { createLogger, format, transports } = require("winston");
  const e = require("express");
  const { forEach } = require("mathjs");

  const httpTransportOptions = {
    host: "http-intake.logs.datadoghq.com",
    path: "/api/v2/logs?dd-api-key=1442915acc3362533ed7ffa6cb42fca1&ddsource=nodejs&service=BotNetwork",
    ssl: true,
  };

  const events = createLogger({
    exitOnError: false,
    format: format.json(),
    transports: [new transports.Http(httpTransportOptions)],
  });

  module.exports = events;
 

  app.get("/", (req, res) => {
    res.send("Server Not Found - Key Missing");
  });

  app.listen(4000, () => {
    console.log(`Arigo listening on port 4000`);
  });

  // Get all the bots here, then forEach through them with the code below (creating a new client, initing commands, etc)
  let bots;

  if (environment === "production") {
    bots = await db.collection("bots").get();    
  } else {
    bots = [
      await db.collection("bots").doc("864016187107966996").get(),
    ]; // node fuckery lol
  }

  const botMap = new Map();

  bots.forEach(async (b) => {
    const bot = b.data();
    const client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
      ],
      partials: [Partials.Channel, Partials.Message],
    });
    client.commands = new Collection();
    const commandFiles = fs
      .readdirSync("./commands")
      .filter((file) => file.endsWith(".js"));

    // client.Sentry = new Sentry.NodeClient({
    //   dsn: "https://6a44c1853d94409a908ebbf48c5bde32@o4504084672610304.ingest.sentry.io/4504085017133056",
    //   environment: environment,
    //   tracesSampleRate: 1.0,
    // })

    // client.Sentry.setContext("Bot Information", {
    //   guildId: guildId,
    //   clientId: clientId,
    // });
    // client.Sentry.setTag("guildId", b.id);
    // client.Sentry.setTag("clientId", client.user.id);

    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      client.commands.set(command.data.name, command);
    }
    client.once("ready", async () => {
      // Node Deploy Commands (deploy-commands).js
      await deployCommands(client.user.id, b.id, bot.token);

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("subscribe-button")
            .setLabel("Subscribe")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("📰")
        )
        .addComponents(
          new ButtonBuilder()
            .setCustomId("unsubscribe-button")
            .setLabel("Unsubscribe")
            .setStyle(ButtonStyle.Danger)
        );
      const newsletterRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Complete Form")
          .setStyle(ButtonStyle.Link)
          .setURL("https://forms.gle/4xNicVNPMvvF3K3K9")
      );
      const toSendrow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("View Blog Update")
          .setURL("https://support.arigoapp.com/blog/nov-update")
          .setStyle(ButtonStyle.Link)
      );
      // DM people stufff
      // const events = await db.collection('newsletter')
      // events.get().then((querySnapshot) => {
      //     const tempDoc = querySnapshot.docs.map((doc) => {
      //       return { id: doc.id, ...doc.data() }
      //     })
      //     console.log(tempDoc)
      //     tempDoc.forEach(async user => {
      //     const toDm = await client.users.fetch(`${user.id}`)

      //     const newsletterembed = new EmbedBuilder()
      //     newsletterembed.setTitle("Arigo's November Update")
      //     newsletterembed.setDescription(`Good evening ${toDm.username}, we hope you had an incredible Thanksgiving break 🦃!\n\nCrazy how time just flies, it's already the end of the month. We put together a monthly recap that contains vitial information about the future of Arigo and answers some frequently asked questions. Since you're on our newsletter, you're getting notified slightly earlier than the general public. Use the button below to view.\n\nSee you soon,\nTeam Arigo`)
      //     newsletterembed.setColor("#a6d9f7")

      //     try {
      //       // await toDm.send({ embeds: [newsletterembed], components: [toSendrow] })
      //     } catch {
      //      return console.log(`UH OH: Was unable to DM ${user.id}`)
      //     }
      //     console.log(`Processed ${user.id}`)
      //     })
      //   })

      // const toDm = await client.users.fetch('695167288801886269')
      // const newsletterembed = new EmbedBuilder()
      // newsletterembed.setTitle("Exclusive Newsletter Post - 50% off your subscription")
      // newsletterembed.setDescription(`Hey ${toDm.username},\n\nWe hope you're having a great evening and we're here to deliver some good news. After manual review of your account and your active subscriptions, we're happy to let you know that you're eligible for 50% off next month for one bot. You can use this promotion on one of your existing bots or on a new bot.\n\nPlease email accounts@arigoapp.com to claim, promotion ends <t:1661022000:R>.\n\nHave a great rest of your Tuesday,\n Your friends at Arigo`)
      // newsletterembed.setColor("#ed1d24")
      // newsletterembed.setImage('https://cdn.discordapp.com/attachments/1007352628365238432/1009204973525016586/unknown.png')
      // // await toDm.send({ embeds: [newsletterembed] })

      const supportEmbed = new EmbedBuilder();
      supportEmbed.setTitle("Join the newsletter");
      supportEmbed.setDescription(
        `Subscribe to Arigo's free newsletter where we'll send you important *personalized* updates and useful tips straight to your Discord inbox.\n\nWe'll never send you something irreverent or spam your direct messages. Reach out to us at community@arigoapp.com with any questions or concerns.`
      );
      supportEmbed.setColor("#ed1d24");
      // client.channels.cache.get("1008899256016453692").send({ embeds: [supportEmbed], components: [row] })
      //
      // GET request for remote image in node.js
      // axios({
      //     method: 'GET',
      //     url: 'https://api-testing-for-workspaces.ishaanfrom.repl.co/check',
      //     headers: {
      //       'test': 'test 2'
      //     },
      //   })
      //     .then((e) => {
      //       console.log(e);
      //     })
      //     .catch((err) => {
      //       console.log(err.message);
      //     });
      console.log(`Ready for guild ${b.id}!`);
      

      if (b.id === "864016187107966996") {
        // Get HEX Color
        const guildForColorRoleMenu =
          client.guilds.cache.get("864016187107966996");
        // Create embed
        const newTicketMenuEmbed = new EmbedBuilder();
        newTicketMenuEmbed.setTitle(`🧑‍💻 Caffable 24/7 Support`);
        newTicketMenuEmbed.setDescription(
          `Please choose your inquiry from the panels below to contact our 24/7 Support Team. We will get back to you as soon as possible.\n\n> :flag_us: <@473903419497775114>\n> :flag_us: <@473903419497775114>\n> :flag_us: <@473903419497775114>\n\n✅ Team Caffable can not provide support to you via Discord DMs!\n✅Make sure to rate the conversation when it has been finished.`
        );
        newTicketMenuEmbed.setColor(
          guildForColorRoleMenu.members.me.displayColor
        );
        const ticketOptions = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Product Inquiry")
            .setStyle("1")
            .setCustomId(`2`)
            .setEmoji("❓"),
          new ButtonBuilder()
            .setLabel("Partnership Request")
            .setStyle("2")
            .setCustomId(`1`)
            .setEmoji("📩"),
          new ButtonBuilder()
            .setLabel("Billing Inquiry (Stripe, PayPal)")
            .setStyle("2")
            .setCustomId(`3`)
            .setEmoji("💸"),
          new ButtonBuilder()
            .setLabel("General Inquiry")
            .setStyle("2")
            .setCustomId(`4`)
            .setEmoji("📞"),
          new ButtonBuilder()
            .setLabel("Sponsor Purchase")
            .setStyle("2")
            .setCustomId(`5`)
            .setEmoji("🎉")
        );
        // client.channels.cache.get(`955908272345448519`).send({ embeds: [newTicketMenuEmbed], components: [ticketOptions] })
      }

      // Get status & update
      const appearanceRef = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("settings")
        .doc(`appearance`);
      const appearance = await appearanceRef.get();
      if (parseInt(appearance.data().visibility) === 1) {
        client.user.setStatus("online");
      } else if (parseInt(appearance.data().visibility) === 2) {
        client.user.setStatus("dnd");
      } else if (parseInt(appearance.data().visibility) === 3) {
        client.user.setStatus("idle");
      } else if (parseInt(appearance.data().visibility) === 4) {
        client.user.setStatus("invisible");
      }
      if(appearance.data().statuses !== undefined) {
      const activities = appearance.data().statuses ?? [];

      const setActivity = () => {
        const random = Math.floor(Math.random() * activities.length) + 1;
        const activity = activities[random - 1];

        client.user.setActivity({
          name: activity.status,
          type: activity.type,
        });
      }

      setActivity();

      console.log(
        `Set activity for ${b.id} to ${client.user.presence.activities[0].name} ${client.user.presence.activities[0].type}!`
      );

      setInterval(setActivity, 10000);
      }
    })
  
    // Deleted Message
    client.on(Events.MessageDelete, async (message) => {
      try {
        if (message.content.length === 0 && message.attachments.size === 0) {
          return;
        }
      } catch {
        //
      }
      const cityReff = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("settings")
        .doc("messageLogChannel");
      const doc2 = await cityReff.get();
      let logChannel = await client.channels.fetch(doc2.data().id);
      var attachments;
      try {
        if (message.author === null) {
          // Bot
          return;
        }
        if (message.attachments.size > 0) {
          message.attachments
            .forEach((one) => {
              const step1 = attachments + " " + one.attachment;
              attachments = step1.replace(undefined, "");
            })
            .catch((err) => {
              console.log("Message Deleted Error", err);
            });

          const deletedmsg = new EmbedBuilder();
          deletedmsg.setTitle("Message Deleted");
          deletedmsg.setDescription(
            `**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n**Content:** ${message.content}\n\n**Attachment:**\n${attachments}`
          );
          //   deletedmsg.setFooter({
          // text: "Designed by Arigo",
          // iconURL: "https://cdn.arigoapp.com/logo"
          // }),
          deletedmsg.setColor("#ed1d24");
          // deletedmsg.setTimestamp()
          logChannel.send({ embeds: [deletedmsg] });
        } else {
          // No Attachment
          const deletedmsg = new EmbedBuilder();
          deletedmsg.setTitle("Message Deleted");
          deletedmsg.setDescription(
            `**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n**Content:** ${message.content}`
          );
          //   deletedmsg.setFooter({
          // text: "Designed by Arigo",
          // iconURL: "https://cdn.arigoapp.com/logo"
          // }),
          deletedmsg.setColor("#ed1d24");
          // deletedmsg.setTimestamp()
          logChannel.send({ embeds: [deletedmsg] });
        }
      } catch (err) {
        console.log("Message Deleted error", err);
      }
    });

    // Edited Message

    client.on(Events.MessageUpdate, async function (oldMessage, newMessage) {
      if (newMessage.author.bot == false) {
        // From bot, disregard
        if (newMessage.content == oldMessage.content) {
          // Message is the same
        } else {
          const cityReff = db
            .collection("bots")
            .doc(`${b.id}`)
            .collection("settings")
            .doc("messageLogChannel");
          const doc2 = await cityReff.get();
          let logChannel = await client.channels.fetch(doc2.data().id);
          const editedmsg = new EmbedBuilder();
          editedmsg.setTitle("Message Edited");
          editedmsg.setDescription(
            `**User:** <@${newMessage.author.id}> (${newMessage.author.id})\n**Channel:** <#${newMessage.channelId}> (${newMessage.channelId})`
          );

          editedmsg.addFields(
            {
              name: "Old Message",
              value: `${oldMessage.content}`,
              inline: true,
            },
            {
              name: "New Message",
              value: `${newMessage.content}`,
              inline: true,
            }
          );
          //   editedmsg.setFooter({
          // text: "Designed by Arigo",
          // iconURL: "https://cdn.arigoapp.com/logo"
          // }),
          editedmsg.setColor("#ed1d24");
          // editedmsg.setTimestamp()
          logChannel.send({ embeds: [editedmsg] });
        }
      }
    });

    // Blacklisted Words

    const blacklisted = [
      "open source",
      "oss",
      "ddos",
      "luke",
      "sayz",
      "hyra",
      "sam",
      "andre",
      "unlicense",
      "alt",
    ];

    // Welcome Message
    client.on("guildMemberAdd", async (member) => {
      const emojis = ["👏", "🙌", "🤩", "😎", "😊", "😀", "😄", "😁"];
      const random = Math.floor(Math.random() * emojis.length);
      // Get values from database
      const getTitle = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("settings")
        .doc(`welcomeTitle`);
      const doc1 = await getTitle.get();

      const getDescription = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("settings")
        .doc(`welcomeText`);
      const doc2 = await getDescription.get();

      const getChannel = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("settings")
        .doc(`welcomeChannel`);
      const doc3 = await getChannel.get();

      const capturedTitle = doc1.data().text;
      const capturedDescription = doc2.data().text;
      const capturedChannel = doc3.data().id;

      // Ensure that we filter out the things - Title
      const titleOne = capturedTitle.replaceAll(
        "{username}",
        `${member.user.username}`
      );
      const titleTwo = titleOne.replaceAll(
        "{serverName}",
        `${member.guild.name}`
      );
      const finalTitle = titleTwo;

      // Ensure that we filter out the things - Description
      const descriptionOne = capturedDescription.replaceAll(
        "{members}",
        `${client.guilds.cache.reduce(
          (acc, guild) => acc + guild.memberCount,
          0
        )}`
      );
      const descriptionTwo = descriptionOne.replaceAll(
        "{userPing}",
        `<@${member.user.id}>`
      );
      const descriptionThree = descriptionTwo.replaceAll(
        "{serverName}",
        `${member.guild.name}`
      );
      const descriptionFour = descriptionThree.replaceAll(
        "{username}",
        `${member.user.username}`
      );
      const descriptionFive = descriptionFour.replaceAll("/n", `\n`);
      const finalDescription = descriptionFive;
      const guildForColorWelcome = client.guilds.cache.get(b.id);

      console.log({
        1: finalTitle,
        2: finalDescription,
        3: capturedChannel,
      });
      // \n
      // random emoji
      const welcomeembed = new EmbedBuilder();
      welcomeembed.setTitle(`${finalTitle}`);
      welcomeembed.setDescription(`${finalDescription}`);
      //   welcomeembed.setFooter({
      // text: "Designed by Arigo",
      // iconURL: "https://cdn.arigoapp.com/logo"
      // }),
      welcomeembed.setColor(guildForColorWelcome.members.me.displayColor);
      // welcomeembed.setTimestamp()
      client.channels.cache
        .get(`${capturedChannel}`)
        .send({ content: `<@${member.user.id}>,`, embeds: [welcomeembed] });
    });

    // Interaction Stuff

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isButton()) return;
      if (interaction.customId === "subscribe-button") {
        // See if they have an Arigo account
        const cityReff = db
          .collection("accounts")
          .doc(`${interaction.user.id}`);
        const accessCheck = await cityReff.get();
        if (!accessCheck.exists) {
          // Log error to Slack
          await web.chat.postMessage({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${interaction.user.username}* (${interaction.user.id}) attempted to subscribe but doesn't have an active account.`,
                },
              },
            ],
            channel: threatSlack,
          });

          // Create button
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Create account")
              .setStyle(ButtonStyle.Link)
              .setURL("https://app.arigoapp.com/create-account")
          );
          // Create embed
          const noAccessEmbed = new EmbedBuilder();
          // noAccessEmbed.setFooter({
          // text: "Designed by Arigo",
          // iconURL: interaction.client.user.displayAvatarURL()
          // }),
          noAccessEmbed.setColor("Red");
          // noAccessEmbed.setTimestamp()
          noAccessEmbed.setTitle("<:x_:957002602921492570> Almost there...");
          noAccessEmbed.setDescription(
            "You're almost there! In order to setup newsletter notifications, you'll need to setup an account with Arigo.\n\nDon't worry, creating an account takes seconds."
          );
          return interaction.reply({
            embeds: [noAccessEmbed],
            components: [row],
            ephemeral: true,
          });
        }
        // Already subscribed
        const cityRef = db
          .collection("newsletter")
          .doc(`${interaction.user.id}`);
        const alreadyExist = await cityRef.get();
        if (alreadyExist.exists) {
          // Log to Slack
          // Log to Slack
          await web.chat.postMessage({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${interaction.user.username}* (${interaction.user.id}) attempted to subscribe but is already subscribed.`,
                },
              },
            ],
            channel: threatSlack,
          });
          // Create embed
          const alreadyExistsEmbed = new EmbedBuilder();
          // alreadyExistsEmbed.setFooter({
          // text: "Designed by Arigo",
          // iconURL: interaction.client.user.displayAvatarURL()
          // }),
          alreadyExistsEmbed.setColor("Red");
          // alreadyExistsEmbed.setTimestamp()
          alreadyExistsEmbed.setTitle("<:x_:957002602921492570> Woah");
          alreadyExistsEmbed.setDescription(
            "You're already subscribed to our waitlist, nothing else to worry about!"
          );
          return interaction.reply({
            embeds: [alreadyExistsEmbed],
            ephemeral: true,
          });
        }
        // Log to Slack
        await web.chat.postMessage({
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${interaction.user.username}* (${interaction.user.id}) has subscribed.`,
              },
            },
          ],
          channel: threatSlack,
        });
        // Add to database
        const data = {
          registered: new Date(),
        };
        const res = await db
          .collection("newsletter")
          .doc(`${interaction.user.id}`)
          .set(data);
        // Send notification
        const successEmbed = new EmbedBuilder();
        // successEmbed.setFooter({
        // text: "Designed by Arigo",
        // iconURL: interaction.client.user.displayAvatarURL()
        // }),
        successEmbed.setColor("Green");
        // successEmbed.setTimestamp()
        successEmbed.setTitle("<:check:957002603252830208> You're subscribed");
        successEmbed.setDescription(
          `You'll get notifications straight to your Discord inbox - just make sure your privacy settings allow direct messages from server members.\n\nYou can unsubscribe at anytime using the ` +
            "`Unsubscribe` button above."
        );
        return interaction.reply({ embeds: [successEmbed], ephemeral: true });
      }
    });

    // Unsubscribe button
    client.on("interactionCreate", async (interaction) => {
      if (interaction.customId === "unsubscribe-button") {
        // Check if subscribed
        const cityRef = db
          .collection("newsletter")
          .doc(`${interaction.user.id}`);
        const alreadyExist = await cityRef.get();
        if (alreadyExist.exists) {
          // On newsletter
          // Log to Slack
          await web.chat.postMessage({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${interaction.user.username}* (${interaction.user.id}) unsubscribed.`,
                },
              },
            ],
            channel: threatSlack,
          });
          // Remove from database
          cityRef.delete();
          // Send embed
          const deleteSuccessEmbed = new EmbedBuilder();
          // deleteSuccessEmbed.setFooter({
          // text: "Designed by Arigo",
          // iconURL: interaction.client.user.displayAvatarURL()
          // }),
          deleteSuccessEmbed.setColor("Green");
          // deleteSuccessEmbed.setTimestamp()
          deleteSuccessEmbed.setTitle(
            "<:check:957002603252830208> You're unsubscribed"
          );
          deleteSuccessEmbed.setDescription(
            "You won't get anymore newsletter notifications from us in the future, feel free to resubscribe at anytime."
          );
          return interaction.reply({
            embeds: [deleteSuccessEmbed],
            ephemeral: true,
          });
        } else {
          // Log to Slack
          await web.chat.postMessage({
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${interaction.user.username}* (${interaction.user.id}) attempted to unsubscribe but isn't subscribed.`,
                },
              },
            ],
            channel: threatSlack,
          });
          // Send embed
          const notSubscribedEmbed = new EmbedBuilder();
          // notSubscribedEmbed.setFooter({
          // text: "Designed by Arigo",
          // iconURL: interaction.client.user.displayAvatarURL()
          // }),
          notSubscribedEmbed.setColor("Red");
          // notSubscribedEmbed.setTimestamp()
          notSubscribedEmbed.setTitle("<:x_:957002602921492570> Uh oh");
          notSubscribedEmbed.setDescription(
            "You're not subscribed to our newsletter so we were unable to unsubscribe you."
          );
          return interaction.reply({
            embeds: [notSubscribedEmbed],
            ephemeral: true,
          });
        }
      }
    });

    client.on("interactionCreate", async (interaction) => {
      // BOT SUSPENSIONS TO SLACK
      // Flags to Slack & Check for banss
      //    var docReftoCheckk = db.collection("bot-suspension").doc(interaction.user.id)
      //    docReftoCheckk.get().then( async (doc2) => {
      //    if(doc2.exists){
      //    const unauthembed = new EmbedBuilder()
      //    unauthembed.setTitle("⚠️ Unable To Execute Command")
      //    unauthembed.setDescription(`Hello, <@${interaction.member.user.id}>. Your account is currently suspended from Arigo Community, Arigo Platform, and the Arigo Platform Bot Network. We rarely issue these suspensions unless a major policy is violated; in which case we believe the user poses a threat to our network. We encourage you to reach out to us via` + "``moderation@arigoapp.com`` as we're always willing to resolve things with you.\n\n**Moderator Note**\n" + doc2.data().tag)
      //   unauthembed.setFooter({
      // text: "Designed by Arigo",
      // iconURL: client.user.displayAvatarURL()
      // }),
      //   unauthembed.setColor("Red")
      //   unauthembed.setTimestamp()
      //  return interaction.reply({ embeds: [unauthembed], ephemeral: true })
      //         } else {

      var docReftoCheck = db.collection("flags").doc(interaction.user.id);
      docReftoCheck.get().then((doc) => {
        if (doc.exists) {
          (async () => {
            // Post a message to the channel, and await the result.
            // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
            const result = await web.chat.postMessage({
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: `*${interaction.user.username}* (${interaction.user.id}), a flagged account, has accessed the Arigo Platform Bot Network.`,
                  },
                },
                {
                  type: "section",
                  fields: [
                    {
                      type: "mrkdwn",
                      text: "*Command:*\n`" + interaction.commandName + "`",
                    },
                    {
                      type: "mrkdwn",
                      text: "*When:*\n" + new Date(),
                    },
                    {
                      type: "mrkdwn",
                      text: "*Server Name:*\n" + interaction.member.guild.name,
                    },
                    {
                      type: "mrkdwn",
                      text: "*Server ID:*\n" + interaction.member.guild.id,
                    },
                  ],
                },
              ],
              channel: conversationId,
            });

            console.log(
              `Successfully send message ${result.ts} in conversation ${conversationId}`
            );
          })();
        }
      });
      // End of flags to Slack
      if (!interaction.isCommand()) return;
      const command = client.commands.get(interaction.commandName);

      if (!command) return;
      //           client.on('interactionCreate', interaction => {
      // 	if (!interaction.isButton()) return;
      // 	console.log(interaction);
      // });

      const embed = new EmbedBuilder();

      //   embed.setFooter({
      // text: "Designed by Arigo",
      // iconURL: interaction.client.user.displayAvatarURL()
      // }),
      embed.setColor(interaction.guild.members.me.displayColor);
      // embed.setTimestamp()
      try {
        await command.execute(interaction, embed, db, events, Sentry, client);
      } catch (error) {
        console.error("Error", error);
        return interaction.reply({
          content: "There was an error while executing this command!",
          ephemeral: true,
        });
      }

      // }}) - Bot Suspension
    });


    // Ticket/Support Module
    // Deploy New Ticket Menu
    app.get("/bot/:botId/push/support-menu/:id", async (req, res) => {
      const client = botMap.get(req.params.botId);
      // Get in database
      const getTicketMenus = db
        .collection("bots")
        .doc(`${req.params.botId}`)
        .collection("ticket-menus")
        .doc(req.params.id);
      const ticketMenu = await getTicketMenus.get();

      // Get HEX Color
      const guildForColorRoleMenu = client.guilds.cache.get(req.params.botId);
      // Create embed
      const newTicketMenuEmbed = new EmbedBuilder();
      newTicketMenuEmbed.setTitle(`${ticketMenu.data().embed_title}`);
      newTicketMenuEmbed.setDescription(
        `${ticketMenu.data().embed_description}`
      );
      // newReactionRoleEmbed.setFooter({
      // text: "Designed by Arigo",
      // iconURL: "https://cdn.arigoapp.com/logo"
      // }),
      newTicketMenuEmbed.setColor(
        guildForColorRoleMenu.members.me.displayColor
      );
      const ticketOptions = new ActionRowBuilder();
      db.collection("bots")
        .doc(`${req.params.botId}`)
        .collection("ticket-menus")
        .doc(req.params.id)
        .collection("options")
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            ticketOptions.addComponents(
              new ButtonBuilder()
                .setLabel(doc.data().optionName)
                .setStyle(doc.data().type)
                .setCustomId(`ticket_menu_${req.params.id}_${doc.id}`)
                .setEmoji(doc.data().optionIcon)
            );
          });
          client.channels.cache.get(`${ticketMenu.data().channelId}`).send({
            embeds: [newTicketMenuEmbed],
            components: [ticketOptions],
          });
        });
      res.send("Success");
      return console.log("Successfully Created Ticket Menu", req.params.id);
    });

    // Ticket Interaction Listeners
    client.on(Events.InteractionCreate, async (interaction) => {
      // Check For Modal
      if (interaction.isModalSubmit()) {
        // Handle Successful Modal Submit
        // Get Current Ticket Number from Database & Add Permissions To An Array
        const captureId = interaction.customId.split("_");
        const getCurrent = db
          .collection("bots")
          .doc(`${b.id}`)
          .collection("ticket-menus")
          .doc("current_number");
        const current = await getCurrent.get();
        const getTicket = db
          .collection("bots")
          .doc(`${b.id}`)
          .collection("ticket-menus")
          .doc(captureId[2])
          .collection("options")
          .doc(captureId[3]);
        const ticket = await getTicket.get();

        // Get Current Ticket Number from Database & Add Permissions To An Array
        var staffRolesFinal = [];
        const staffRolesFromDb = ticket.data().staffRoles
        staffRolesFromDb.map(async (role) => {
          staffRolesFinal.push({
            id: role,
            allow: [PermissionFlagsBits.ViewChannel],
          });
        });
        staffRolesFinal.push({
          id: interaction.member.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        });
        staffRolesFinal.push({
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        });
        // Create a new channel with permission overwrites
        interaction.guild.channels
          .create({
            name: `${ticket.data().prefix}-${current.data().current}`,
            reason: `A "${ticket.data().optionName}" ticket was created by ${
              interaction.member.user.username
            } (${interaction.member.user.id}) through an Arigo Ticket Menu`,
            topic: `A "${ticket.data().optionName}" ticket was created by ${
              interaction.member.user.username
            } (${interaction.member.user.id}) through an Arigo Ticket Menu`,
            type: ChannelType.GuildText,
            permissionOverwrites: staffRolesFinal,
          })
          .then(async (channel) => {
            // Set Proper Parent Category
            channel.setParent(ticket.data().category, {
              lockPermissions: false,
            });

            // Send Message in Channel
            const initialReplyEmbedColor = client.guilds.cache.get(b.id);
            var replyEmbedDescription = ticket.data().replyEmbedDescription;
            replyEmbedDescription = replyEmbedDescription.replaceAll(
              "{username}",
              `${interaction.member.user.username}`
            );
            replyEmbedDescription = replyEmbedDescription.replaceAll(
              "/n",
              `\n`
            );
            const initialReplyEmbed = new EmbedBuilder();
            initialReplyEmbed.setTitle(ticket.data().replyEmbedTitle);
            initialReplyEmbed.setDescription(replyEmbedDescription);
            initialReplyEmbed.setColor(
              initialReplyEmbedColor.members.me.displayColor
            );
            // Ping Roles
            var pingRoles = ticket
              .data()
              .pingRoles
              .map((roleId) => ` <@&${roleId}>`);
            // Close Ticket Button
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `close_ticket_${current.data().current}_${
                    ticket.data().logChannel
                  }`
                )
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
            );
            client.channels.cache
              .get(`${channel.id}`)
              .send({
                content: `<@${interaction.member.user.id}>,${pingRoles}`,
                embeds: [initialReplyEmbed],
                components: [row],
              })
              .then((message) => {
                message.pin().then((done) => {
                  channel.bulkDelete(1).then((done2) => {
                    const modalSuccessEmbedColor = client.guilds.cache.get(
                      b.id
                    );
                    const modalResponseEmbed = new EmbedBuilder();
                    modalResponseEmbed.setTitle(
                      `${interaction.user.username} said:`
                    );
                    modalResponseEmbed.setDescription(
                      "```" +
                        interaction.fields.getTextInputValue(
                          "reason-ticket-modal"
                        ) +
                        "```"
                    );
                    // reactionRoleNotFound.setFooter({
                    // text: "Designed by Arigo",
                    // iconURL: "https://cdn.arigoapp.com/logo"
                    // }),
                    modalResponseEmbed.setColor(
                      modalSuccessEmbedColor.members.me.displayColor
                    );
                    client.channels.cache
                      .get(`${channel.id}`)
                      .send({ embeds: [modalResponseEmbed] });
                  });
                });
              });

            // Send Success Embed
            const reactionRoleNotFound = new EmbedBuilder();
            reactionRoleNotFound.setTitle(`🤩 Ticket Created`);
            reactionRoleNotFound.setDescription(
              `You're able to access your ticket in <#${channel.id}>.`
            );
            // reactionRoleNotFound.setFooter({
            // text: "Designed by Arigo",
            // iconURL: "https://cdn.arigoapp.com/logo"
            // }),
            reactionRoleNotFound.setColor("Green");
            interaction.reply({
              embeds: [reactionRoleNotFound],
              ephemeral: true,
            });

            // Increase Current
            const updateCurrent = {
              current: parseInt(current.data().current) + parseInt(1),
            };
            await db
              .collection("bots")
              .doc(`${b.id}`)
              .collection("ticket-menus")
              .doc("current_number")
              .set(updateCurrent);
          });
        return;
      }
      if (!interaction.isButton()) return;
      const captureId = interaction.customId.split("_");
      if (JSON.stringify(captureId).includes("ticket") === false) {
        return;
      }
      // -- HANDLE CLOSES --
      if (JSON.stringify(captureId).includes("close") === true) {
        // -- Reply To Confirm Close Ticket Button --
        if (JSON.stringify(captureId).includes("approve") === true) {
          interaction.deferReply();
          console.log("Suggested Reply Command Ran")
          // Run OpenAI Stuff
          // OpenAI Stuff
        const getOpenAIStuff = db
        .collection("bots")
        .doc(`${interaction.guild.id}`)
      const openAIKey = await getOpenAIStuff.get();
      const channel = interaction.channel;
      const firstMessage = await channel.messages.fetch({
        limit: 1,
        after: 0,
      });

      if(openAIKey.data().openAIAPIKey === undefined || openAIKey.data().openAIAPIKey.length === '') {
        console.log("OpenAI API Key Invalid For", interaction.guild.id)
        //
      } else {
      const configuration = new Configuration({
      apiKey: openAIKey.data().openAIAPIKey,
      });
      const openai = new OpenAIApi(configuration);

          let msgsArray = [];
          var ticketOpener;
          const msgs = await channel.messages.fetch({
            cache: true,
            force: true,
          });
          const lastMessage = await channel.messages.fetch({ limit: 1 });
          
          ticketOpener = firstMessage
            .first()
            .content.split(",")[0]
            .replaceAll("<", "")
            .replaceAll("@", "")
            .replaceAll(">", "");
          await msgs.map((msg) => {
            var msgContent = msg.content;
            if (msg.author.bot) {
              // if(msg.embeds[0] = []) return;
              try {
                if (msg.embeds[0].data.title.endsWith("said:")) {
                  msgsArray.push({
                    role: "user",
                    content: msg.embeds[0].data.description.replaceAll("`", ""),
                  });
                }
              } catch {
                //
              }
            }
            if (msg.content === "" || msg.author.bot === true) return;
            if (msg.id === lastMessage.first().id) {
              msgContent = `${msgContent}`;
            }
            if (msg.author.id === ticketOpener) {
              msgsArray.push({
                role: "user",
                content: msgContent,
              });
            } else {
              msgsArray.push({
                role: "system",
                content: msgContent,
              });
            }
          });
          // msgsArray.push({ role: 'system', content: 'You are an AI tasked with reviewing a closed customer support tickets messages between the system and user. Your ONLY responsible for identifying questions the user asked and the answers provided by the system, this means you are NOT responsible for providing a response to the user. You should them map these questions & answers and your response should use the format of Q: (Insert User Question) and A: (Insert Systerm Answer) and ensure they responses are wrapped in quotation marks.' })
          msgsArray = msgsArray.map((item) => item).reverse();
          console.log("what", msgsArray)
          msgsArray.push({
            role: "user",
            content:
            'Identify questions and answers. If you cant find any, say "None Found"'
            // 'You are an AI tasked with reviewig the messages above to identify pairs of questions & answers that can be used in a Customer Support knowledge base. If you feel as the content in the messages is relevant to multiple people, format the messages above in an FAQ format of "Q: (Insert User Question) and A: (Insert Systerm Answer)" and ensure the responses are wrapped in quotation marks, do not include anything else in your response; return in JSON Object structure without a parent object tite. If you are unable to locate any useful FAQs within the messages, reply "None Found" as a string. Do NOT provide incorrect data that are not included within the messages directly above.',
          });
          const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: msgsArray,
            max_tokens: 200,
            // temperature: 0
          });
          console.log("OpenAI Response", completion.data.choices[0].message.content)
          if(completion.data.choices[0].message.content.toLowerCase().includes("none found")) {
            success = false
            console.log("Caught None Found")
          }
          console.log("Messages Array", msgsArray)
          
            var success
            console.log("1")
          console.log(completion.data.choices[0].message.content);
          var FAQs = {};
          try {
          FAQs = JSON.parse(
            completion.data.choices[0].message.content.replaceAll("`", "")
          )
          } catch {
            console.log("Error Parsing FAQs")
            success = false
          }
          console.log("2")
          if(success !== false) {
            console.log("3")
            console.log("FAQS", FAQs)
          try {
            console.log("4", success)
          FAQs.map(async (item) => {
            console.log("5", item)
            if(item.Q === undefined || null) return success = false
            const AITicketData = {
              question: item.Q,
              answer: item.A,
              createdBy: "system",
              transcript: `https://transcripts.arigoapp.com/${interaction.guild.id}/${captureId[3]}.html`,
            }
            console.log("6")
            if(success !== false) {
              console.log("7")
              console.log("Adding FAQ")
            await db
              .collection("bots")
              .doc(`${interaction.guild.id}`)
              .collection("support-ai-faqs")
              .doc(`${Math.floor(Math.random() * 9000000000) + 1000000000}`)
              .set(AITicketData).then(data => {
                console.log("Data", data)
              })
            }
          })
          console.log("8")
        } catch {
            //
        }
      }
    }
    console.log("9")
          // embed.setDescription("```" + finalResponse[finalResponse.length -2] + ".```")
          // Make Transcript
          const attachment = await discordTranscripts.createTranscript(
            interaction.channel,
            {
              limit: -1, // Max amount of messages to fetch. `-1` recursively fetches.
              returnType: "attachment", // Valid options: 'buffer' | 'string' | 'attachment' Default: 'attachment' OR use the enum ExportReturnType
              filename: `transcript-${captureId[3]}.html`, // Only valid with returnType is 'attachment'. Name of attachment.
              saveImages: false, // Download all images and include the image data in the HTML (allows viewing the image even after it has been deleted) (! WILL INCREASE FILE SIZE !)
              footerText: "Arigo exported {number} message{s}", // Change text at footer, don't forget to put {number} to show how much messages got exported, and {s} for plural
              poweredBy: false, // Whether to include the "Powered by discord-html-transcripts" footer
            }
          );
          console.log('10')

          // // The ID of your GCS bucket
          const bucketName = `transcripts.arigoapp.com`;
          // // The contents that you want to upload
          const contents = attachment.attachment;
          // // The new ID for your GCS file
          const destFileName = `${interaction.guild.id}/${captureId[3]}.html`;
          async function uploadFromMemory() {
            await storage.bucket(bucketName).file(destFileName).save(contents);
            storage.bucket(bucketName).makePublic();
          }
          uploadFromMemory().catch(console.error);
          console.log('11')
          const handleSuccessRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("View Transcript")
              .setURL(
                `https://transcripts.arigoapp.com/${interaction.guild.id}/${captureId[3]}.html`
              )
              .setStyle(ButtonStyle.Link)
          );
          const confirmEmbed = new EmbedBuilder();
          confirmEmbed.setTitle("✅ Ticket Closed");
          confirmEmbed.setDescription(
            `This ticket has been closed by <@${interaction.member.user.id}> (${interaction.member.user.id}).`
          );
          confirmEmbed.setColor("Green");
          interaction.editReply({
            embeds: [confirmEmbed],
            components: [handleSuccessRow],
          }).catch(err => {
            console.log("Potential err here", err)
          })
          console.log("12")
          // Log In Log Channel
          let ticketAuthorId;
          let ticketCreatedTimestamp;
          firstMessage.map((message) => {
            const userId = message.content.split(",");
            ticketAuthorId = userId[0]
              .replace("<", "")
              .replace(">", "")
              .replace("@", "");
            ticketCreatedTimestamp = message.createdTimestamp;
          });
          const initialReplyEmbedColor = client.guilds.cache.get(b.id);
          const logChannelEmbed = new EmbedBuilder();
          logChannelEmbed.setTitle("✉️ | Ticket Log");
          logChannelEmbed.addFields(
            {
              name: "Created By 👤",
              value: `<@${ticketAuthorId}> (${ticketAuthorId})`,
              inline: true,
            },

            {
              name: "Closed By  🔐",
              value: `<@${interaction.member.user.id}> (${interaction.member.user.id})`,
              inline: true,
            },

            {
              name: "Created On 🗓️",
              value: `<t:${ticketCreatedTimestamp}>`,
              inline: true,
            }
          );
          logChannelEmbed.setColor(
            initialReplyEmbedColor.members.me.displayColor
          );
          client.channels.cache
            .get(captureId[4])
            .send({ embeds: [logChannelEmbed], components: [handleSuccessRow] })
            console.log("13")
          return interaction.channel.delete(`This ticket has been closed by ${interaction.member.user.id}.`)
          console.log("14")
        }
        // -- Reply To Cancel Close Ticket Button --
        else if (JSON.stringify(captureId).includes("cancel") === true) {
          const cancelEmbed = new EmbedBuilder();
          cancelEmbed.setTitle("😅 Closure Canceled");
          cancelEmbed.setDescription(
            "Phew. I didn't close the ticket, we're all good!"
          );
          cancelEmbed.setColor("Yellow");
          return interaction.reply({ embeds: [cancelEmbed], ephemeral: true });
        } else {
          if (interaction.customId.includes("modal")) return;
          // -- Reply To Close Ticket Button --
          const handleCloseRow = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `close_ticket_approve_${captureId[2]}_${captureId[3]}`
                )
                .setLabel("Close Ticket")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
            )
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`cancel_close_ticket_${captureId[2]}`)
                .setLabel("Cancel")
                .setEmoji("⛔")
                .setStyle(ButtonStyle.Danger)
            );
          // Get Confirmation
          const confirmationEmbed = new EmbedBuilder();
          confirmationEmbed.setTitle(
            `⚠️ Are you sure you want to close this ticket?`
          );
          // confirmationEmbed.setFooter({
          // text: "Designed by Arigo",
          // iconURL: "https://cdn.arigoapp.com/logo"
          // }),
          confirmationEmbed.setColor("Green");
          return interaction.reply({
            embeds: [confirmationEmbed],
            components: [handleCloseRow],
            ephemeral: true,
          });
        }
      }
      // --  Reply To Ticket Menu Button --
      // Get in database
      const getTicket = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("ticket-menus")
        .doc(captureId[2])
        .collection("options")
        .doc(captureId[3]);
      const ticket = await getTicket.get();

      if (!ticket.exists) {
        // Ticket Menu Not Found
        const ticketMenuNotFound = new EmbedBuilder();
        ticketMenuNotFound.setTitle(`😞 Unable to Identify`);
        ticketMenuNotFound.setDescription(
          `We were unable to identify that ticket menu. If you need more assistance, please contact [Arigo Support](https://support.arigoapp.com).`
        );
        // ticketMenuNotFound.setFooter({
        // text: "Designed by Arigo",
        // iconURL: "https://cdn.arigoapp.com/logo"
        // }),
        ticketMenuNotFound.setColor("Red");
        return interaction.reply({
          embeds: [ticketMenuNotFound],
          ephemeral: true,
        });
      }
      // Check For Modal & Send
      if (ticket.data().modal === true) {
        try {
          if (
            interaction.fields.getTextInputValue("reason-ticket-modal") ===
            !undefined
          );
        } catch {}
        const modal = new ModalBuilder()
          .setCustomId(interaction.customId.replace("menu", "modal"))
          .setTitle("Almost done...");
        const ticketModal = new TextInputBuilder()
          .setCustomId("reason-ticket-modal")
          .setLabel(ticket.data().modalQuestion)
          .setStyle(TextInputStyle.Paragraph);
        const firstActionRow = new ActionRowBuilder().addComponents(
          ticketModal
        );
        modal.addComponents(firstActionRow);
        return await interaction.showModal(modal);
      } else if (ticket.data().modal === false) {
        // Get Current Ticket Number from Database & Add Permissions To An Array
        const getCurrent = db
          .collection("bots")
          .doc(`${b.id}`)
          .collection("ticket-menus")
          .doc("current_number");
        const current = await getCurrent.get();
        var staffRolesFinal = [];
        const staffRolesFromDb = ticket.data().staffRoles
        staffRolesFromDb.map(async (role) => {
          staffRolesFinal.push({
            id: role,
            allow: [PermissionFlagsBits.ViewChannel],
          });
        });
        staffRolesFinal.push({
          id: interaction.member.user.id,
          allow: [PermissionFlagsBits.ViewChannel],
        });
        staffRolesFinal.push({
          id: interaction.guild.id,
          deny: [PermissionFlagsBits.ViewChannel],
        });
        // Create a new channel with permission overwrites
        interaction.guild.channels
          .create({
            name: `${ticket.data().prefix}-${current.data().current}`,
            reason: `A "${ticket.data().optionName}" ticket was created by ${
              interaction.member.user.username
            } (${interaction.member.user.id}) through an Arigo Ticket Menu`,
            topic: `A "${ticket.data().optionName}" ticket was created by ${
              interaction.member.user.username
            } (${interaction.member.user.id}) through an Arigo Ticket Menu`,
            type: ChannelType.GuildText,
            permissionOverwrites: staffRolesFinal,
          })
          .then((channel) => {
            // Set Proper Parent Category
            channel.setParent(ticket.data().category, {
              lockPermissions: false,
            });

            // Send Message in Channel
            const initialReplyEmbedColor = client.guilds.cache.get(b.id);
            var replyEmbedDescription = ticket.data().replyEmbedDescription;
            replyEmbedDescription = replyEmbedDescription.replaceAll(
              "{username}",
              `${interaction.member.user.username}`
            );
            replyEmbedDescription = replyEmbedDescription.replaceAll(
              "/n",
              `\n`
            );
            const initialReplyEmbed = new EmbedBuilder();
            initialReplyEmbed.setTitle(ticket.data().replyEmbedTitle);
            initialReplyEmbed.setDescription(replyEmbedDescription);
            initialReplyEmbed.setColor(
              initialReplyEmbedColor.members.me.displayColor
            );
            // Ping Roles
            var pingRoles = ticket
              .data()
              .pingRoles
              .map((roleId) => ` <@&${roleId}>`);
            // Close Ticket Button
            const row = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(
                  `close_ticket_${current.data().current}_${
                    ticket.data().logChannel
                  }`
                )
                .setLabel("Close Ticket")
                .setStyle(ButtonStyle.Danger)
            );
            client.channels.cache
              .get(`${channel.id}`)
              .send({
                content: `<@${interaction.member.user.id}>,${pingRoles}`,
                embeds: [initialReplyEmbed],
                components: [row],
              })
              .then((message) => {
                message.pin().then((done) => {
                  channel.bulkDelete(1);
                });
              });

            // Send Success Embed
            const reactionRoleNotFound = new EmbedBuilder();
            reactionRoleNotFound.setTitle(`🤩 Ticket Created`);
            reactionRoleNotFound.setDescription(
              `You're able to access your ticket in <#${channel.id}>.`
            );
            // reactionRoleNotFound.setFooter({
            // text: "Designed by Arigo",
            // iconURL: "https://cdn.arigoapp.com/logo"
            // }),
            reactionRoleNotFound.setColor("Green");
            interaction.reply({
              embeds: [reactionRoleNotFound],
              ephemeral: true,
            });
          });
        // Increase Current
        const updateCurrent = {
          current: parseInt(current.data().current) + parseInt(1),
        };
        await db
          .collection("bots")
          .doc(`${b.id}`)
          .collection("ticket-menus")
          .doc("current_number")
          .set(updateCurrent);
      }
    });

    // Reaction Roles // Role Menus

    // Send Reaction Roles Initital Embed
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isButton()) return;
      const captureId = interaction.customId.split("_");
      const id = captureId[2];
      if (JSON.stringify(captureId).includes("reaction") === false) {
        return;
      }
      // Get in database
      const getNotification = db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("notifications")
        .doc(id);
      const notification = await getNotification.get();
      const snapshot = await db
        .collection("bots")
        .doc(`${b.id}`)
        .collection("notifications")
        .doc(id)
        .collection("discord")
        .get();
      const member = await interaction.guild.members.fetch(interaction.user.id);
      if (!notification.exists) {
        // Reaction Role Not Found
        const reactionRoleNotFound = new EmbedBuilder();
        reactionRoleNotFound.setTitle(`😞 Unable to Identify`);
        reactionRoleNotFound.setDescription(
          `We were unable to identify that notification set. If you need more assistance, please contact [Arigo Support](https://support.arigoapp.com).`
        );
        // reactionRoleNotFound.setFooter({
        // text: "Designed by Arigo",
        // iconURL: "https://cdn.arigoapp.com/logo"
        // }),
        reactionRoleNotFound.setColor("Red");
        return interaction.reply({
          embeds: [reactionRoleNotFound],
          ephemeral: true,
        });
      }

      var array = [];
      var cID = "";
      await snapshot.docs.map(async (doc) => {
        if (member.roles.cache.has(`${doc.id}`)) {
          cID = cID + doc.id + ",";
          array.push({
            label: `${doc.data().title}`,
            description: `${doc.data().description}`,
            value: `${doc.id}`,
            default: true,
          });
        } else {
          array.push({
            label: `${doc.data().title}`,
            description: `${doc.data().description}`,
            value: `${doc.id}`,
            default: false,
          });
        }
      });
      if (cID[cID.length - 1] === ",") {
        cID = cID.slice(0, cID.length - 1);
        cID = cID.slice(0, 30);
      }
      if (cID.length === 0) {
        cID = ",";
      }
      const row = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          // .setCustomId(`select_${id}`)
          .setCustomId("role-menus")
          .setPlaceholder("Nothing selected")
          .setMinValues(0)
          .setMaxValues(array.length)
          .addOptions(array)
      );
      const modifyRolesEmbedColor = client.guilds.cache.get(b.id);
      const reactionRoleEmbed = new EmbedBuilder();
      reactionRoleEmbed.setTitle(`🔔 Modify Roles`);
      reactionRoleEmbed.setDescription(
        `Use the menu below to modify your roles for this menu.`
      );
      // reactionRoleEmbed.setFooter({
      //   text: "Designed by Arigo",
      //   iconURL: "https://cdn.arigoapp.com/logo"
      //   }),
      reactionRoleEmbed.setColor(modifyRolesEmbedColor.members.me.displayColor);

      interaction.reply({
        embeds: [reactionRoleEmbed],
        components: [row],
        ephemeral: true,
      });
    });

    // client.on(Events.MessageCreate, async interaction => {
    //   var nono = [
    //     '617485103991488534',
    //   ]
    //   nono.forEach(word => {
    //     if(interaction.author.id.includes(word)) {
    //       interaction.delete()
    //       client.channels.cache.get(`996893224570454058`).send({ content: `i think not, gabby`})
    //     }
    //   })

    // })

    // Respond to Reaction Role Modifications
    client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isStringSelectMenu()) return;
      const selected = interaction.values.join(",");
      const id = interaction.customId;
      const userId = interaction.user.id;
      const guildId = interaction.member.guild.id;
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const values = interaction.values[0];
      const roles = interaction.member.roles.cache;
      // Get User Roles
      var userRoles = [];
      roles.map((role) => {
        userRoles.push(role.id);
      });

      // console.log("All", interaction.component.options)
      // console.log("Selected", interaction.values)
      var selectedRoles = [];
      selectedRoles = selected.split(",");

      // Set Pre-Selected Roles
      var preSelected = [];
      // preSelected = id.split(',');
      // preSelected.pop()
      interaction.component.options.map((role) => {
        preSelected.push(role.value);
      });

      var RemoveAll = function (callback) {
        preSelected.forEach((role) => {
          member.roles.remove(`${role}`).catch((err) => {
            console.log("Was unable to remove all roles:", preSelected);
          });
        }, 1000);
        callback();
      };

      var AddAll = function () {
        selectedRoles.forEach((role) => {
          member.roles.add(`${role}`).catch((err) => {
            console.log("Was unable to add a role", role);
          });
          console.log("Added", role);
          // update at the start
          //  selectedRoles = []
          //  selectedRoles.push(role)
        }, 1000);
      };
      if (selectedRoles.length === 1) {
        if (selectedRoles[0].length > 5) {
          selectedRoles.push("");
        }
      }
      // if(selectedRoles.length === 1) {
      //   // Remove All Roles
      //   RemoveAll()
      //   // Reply Successfully
      //     const RemovereactionRoleEmbed = new EmbedBuilder()
      //     RemovereactionRoleEmbed.setTitle(`✅ All Roles Successfully Removed`)
      //     RemovereactionRoleEmbed.setDescription(`I've successfully removed all the requested roles from you.`)
      //     RemovereactionRoleEmbed.setFooter({
      //       text: "Designed by Arigo",
      //       iconURL: "https://cdn.arigoapp.com/logo"
      //       }),
      //       RemovereactionRoleEmbed.setColor("#ed1d24")
      //     interaction.reply({ embeds: [RemovereactionRoleEmbed], ephemeral: true })
      // } else {

      RemoveAll(AddAll);

      // AddAll()
      // Reply Successfully
      const AddreactionRoleEmbed = new EmbedBuilder();
      AddreactionRoleEmbed.setTitle(`✅ Roles Successfully Updated`);
      AddreactionRoleEmbed.setDescription(
        `Your roles will be updated momentarily.`
      );
      // AddreactionRoleEmbed.setFooter({
      //   text: "Designed by Arigo",
      //   iconURL: "https://cdn.arigoapp.com/logo"
      //   }),
      AddreactionRoleEmbed.setColor("#ed1d24");
      interaction.update({
        embeds: [AddreactionRoleEmbed],
        components: [],
        ephemeral: true,
      });

      // }

      return;
      console.log("At the start", preSelected);
      console.log("Now Selected", selectedRoles);
      Array.prototype.diff = function (a) {
        return this.filter(function (i) {
          return a.indexOf(i) < 0;
        });
      };

      const dif1 = preSelected.diff(selected);
      const dif2 = selectedRoles.diff(preSelected);
      if (dif1.length === 0) {
        console.log("Successful Second Review", dif2);
        if (userRoles.includes(dif2[0])) {
          console.log("Remove Role Second", dif2[0]);
          // Remove Role
          member.roles.remove(dif2[0]).then((success) => {
            const RemovereactionRoleEmbed = new EmbedBuilder();
            RemovereactionRoleEmbed.setTitle(`✅ Role Successfully Removed`);
            RemovereactionRoleEmbed.setDescription(
              `I've successfully removed the <@&` + dif2[0] + "> role from you."
            );
            // RemovereactionRoleEmbed.setFooter({
            //   text: "Designed by Arigo",
            //   iconURL: "https://cdn.arigoapp.com/logo"
            //   }),
            RemovereactionRoleEmbed.setColor("#ed1d24");
            interaction.reply({
              embeds: [RemovereactionRoleEmbed],
              ephemeral: true,
            });
            selectedRoles = selectedRoles.filter((e) => e !== dif2[0]);
          });
        } else {
          // Add Role
          console.log("Role Added Second #1", dif2);
          console.log("Role Added Second", dif2[0]);
          member.roles.add(dif2[0]).then((success) => {
            const AddreactionRoleEmbed = new EmbedBuilder();
            AddreactionRoleEmbed.setTitle(`✅ Role Successfully Added`);
            AddreactionRoleEmbed.setDescription(
              `I've successfully given you the <@&` + dif2[0] + "> role."
            );
            // AddreactionRoleEmbed.setFooter({
            //   text: "Designed by Arigo",
            //   iconURL: "https://cdn.arigoapp.com/logo"
            //   }),
            AddreactionRoleEmbed.setColor("#ed1d24");
            interaction.reply({
              embeds: [AddreactionRoleEmbed],
              ephemeral: true,
            });
          });
        }
      } else {
        console.log("Successful First Review", dif1[0]);

        if (userRoles.includes(dif1[0])) {
          console.log("Remove Role First", dif1[0]);
          // Remove Role
          member.roles.remove(`${dif1[0]}`).then((success) => {
            const RemovereactionRoleEmbed = new EmbedBuilder();
            RemovereactionRoleEmbed.setTitle(`✅ Role Successfully Removed`);
            RemovereactionRoleEmbed.setDescription(
              `I've successfully removed the <@&` + dif1[0] + "> role from you."
            );
            RemovereactionRoleEmbed.setFooter({
              text: "Designed by Arigo",
              iconURL: "https://cdn.arigoapp.com/logo",
            }),
              RemovereactionRoleEmbed.setColor("#ed1d24");
            interaction.reply({
              embeds: [RemovereactionRoleEmbed],
              ephemeral: true,
            });
            selectedRoles = selectedRoles.filter((e) => e !== dif1[0]);
            console.log("updated", selectedRoles);
          });
        } else {
          // Add Role
          console.log("Role Added First", dif1[0]);
          member.roles.add(dif2[0]).then((success) => {
            const AddreactionRoleEmbed = new EmbedBuilder();
            AddreactionRoleEmbed.setTitle(`✅ Role Successfully Added`);
            AddreactionRoleEmbed.setDescription(
              `I've successfully given you the <@&` + dif1[0] + "> role."
            );
            AddreactionRoleEmbed.setFooter({
              text: "Designed by Arigo",
              iconURL: "https://cdn.arigoapp.com/logo",
            }),
              AddreactionRoleEmbed.setColor("#ed1d24");
            interaction.reply({
              embeds: [AddreactionRoleEmbed],
              ephemeral: true,
            });
          });
        }
      }

      return;
      // var userRoles = []

      // // Set User's Current Roles
      // roles.map(role => {
      //   userRoles.push(role.id)
      // })
      // // Set Total Roles In Reaction Role Set
      // var totalRoles = []
      // totalRoles = id.split(',');
      // totalRoles.pop()

      // // Set Currently Selected Roles
      // var selectedRoles = []
      // selectedRoles = selected.split(',');

      // let difference = totalRoles
      //                .filter(x => !selectedRoles.includes(x))
      //                .concat(selectedRoles.filter(x => !totalRoles.includes(x)));
      //                console.log("difference", difference)

      // // selectedRoles.forEach(role => {
      // //   if(totalRoles.includes(role.id)) {
      // //     console.log ("yes", role.id)
      // //   } else {
      // //     console.log("no", role.id)
      // //   }
      // // })
      // console.log("Total Roles In Reaction Role Set", totalRoles)
      // console.log("Selected Roles", selectedRoles)
      // console.log("New User Roles", userRoles)
      // console.log("Oddly iD", id)
      // return

      //////////

      if (member.roles.cache.has(`${roleId}`)) {
        member.roles.remove(roleId).then((success) => {
          console.log("Removed", roleId);
          const RemovereactionRoleEmbed = new EmbedBuilder();
          RemovereactionRoleEmbed.setTitle(`✅ Role Successfully Removed`);
          RemovereactionRoleEmbed.setDescription(
            `I've successfully removed the <@&` + roleId + "> role from you."
          );
          RemovereactionRoleEmbed.setFooter({
            text: "Designed by Arigo",
            iconURL: "https://cdn.arigoapp.com/logo",
          }),
            RemovereactionRoleEmbed.setColor("#ed1d24");
          interaction.reply({
            embeds: [RemovereactionRoleEmbed],
            ephemeral: true,
          });
        });
      } else {
        console.log("Added", roleId);
        member.roles.add(roleId).then((success) => {
          const AddreactionRoleEmbed = new EmbedBuilder();
          AddreactionRoleEmbed.setTitle(`✅ Role Successfully Added`);
          AddreactionRoleEmbed.setDescription(
            `I've successfully given you the <@&` + roleId + "> role."
          );
          AddreactionRoleEmbed.setFooter({
            text: "Designed by Arigo",
            iconURL: "https://cdn.arigoapp.com/logo",
          }),
            AddreactionRoleEmbed.setColor("#ed1d24");
          interaction.reply({
            embeds: [AddreactionRoleEmbed],
            ephemeral: true,
          });
        });
      }
      // Add Role
    });

    // Deploy New Reaction Roles
    client.login(bot.token).catch(err => {
      console.log("Was unable to login to a guild", b.id)
    })

    botMap.set(b.id, client);
  });

  app.get("/bot/:botId/push/role-menu/:id", async (req, res) => {
    const client = botMap.get(req.params.botId);
    // http://localhost:4000/bot/push/role-menu/${menuId}
    // Get in database
    const getNotifications = db
      .collection("bots")
      .doc(`${req.params.botId}`)
      .collection("notifications")
      .doc(req.params.id);
    const notifications = await getNotifications.get();

    // Get HEX Color
    const guildForColorRoleMenu = client.guilds.cache.get(req.params.botId);
    // Create embed
    const newReactionRoleEmbed = new EmbedBuilder();
    newReactionRoleEmbed.setTitle(`${notifications.data().embed_title}`);
    newReactionRoleEmbed.setDescription(
      `${notifications.data().embed_description}`
    );
    // newReactionRoleEmbed.setFooter({
    // text: "Designed by Arigo",
    // iconURL: "https://cdn.arigoapp.com/logo"
    // }),
    newReactionRoleEmbed.setColor(
      guildForColorRoleMenu.members.me.displayColor
    );

    // Button
    const newReactionRoleRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Modify Roles")
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`reaction_role_${req.params.id}`)
        .setEmoji("🔔")
    );

    client.channels.cache
      .get(`${notifications.data().channelId}`)
      .send({
        embeds: [newReactionRoleEmbed],
        components: [newReactionRoleRow],
      })
      .then((msg) => {});
    res.send("Success");
    return console.log("Successfully Created Role Menu", req.params.id);
  });
  // Send Cancelation Notice
  app.get("/bot/:botId/billing/subscription-ended", async (req, res) => {
    const client = botMap.get(req.params.botId);

    const getServer = client.guilds.fetch(req.params.botId).then((done) => {
      client.users
        .fetch(done.ownerId)
        .then((owner) => {
          const webhookInfo = {
            id: "1078785448505253898",
            token:
              "SdiXtmE6B2NQJu79RBbeF_AulnEQYRsZjGft5gw3RtBas-sTIA4dKjDxmi4GzuweMrwo",
          };
          const webhook = new WebhookClient(webhookInfo);
          // Create Buttons
          // const billingRequiredRow = new ActionRowBuilder()
          // .addComponents(
          // 	new ButtonBuilder()
          //   .setLabel('Billing Portal')
          //   .setStyle(ButtonStyle.Link)
          //   .setURL('https://google.com')
          //   .setEmoji('🏦')
          // )

          // Create Embed
          const paymentRequiredEmbed = new EmbedBuilder();
          paymentRequiredEmbed.setTitle("We're sad to see you go 😔");
          paymentRequiredEmbed.setDescription(
            `Hey, ${owner.username}! :wave:\n\nThis is just a notification from Arigo to let you know that your subscription has successfully been canceled. Due to this, your workspace & bot data has been deleted. Within the next few minutes, I'll go offline.\n\nWe're truly sad to see you go and hope your community enjoyed using Arigo.\n\nIf you need anything, don't hesitate to reach out to us via the [live chat](https://support.arigoapp.com) or email at ` +
              "``support@arigoapp.com``."
          );
          paymentRequiredEmbed.setColor("Red");
          owner
            .send({ embeds: [paymentRequiredEmbed] })
            .then((done) => {
              webhook.send(
                "Guild ``" +
                  b.id +
                  "`` has sucessfully notified the server owner " +
                  `(${owner.id}) about a the canceled subscription.`
              );
            })
            .catch((err) => {
              webhook.send(
                "Guild ``" +
                  b.id +
                  "`` has **failed to notify** the server owner " +
                  `(${owner.id}) about the canceled subscription.`
              );
            });

          // Send back
          res.status(200).json("Success");
        })
        .catch((err) => {
          console.log("Error!!!", err);
        });
    });
  });
  // Send Billing Action Needed DM
  app.get("/bot/:botId/billing/payment-required", async (req, res) => {
    const client = botMap.get(req.params.botId);

    const getServer = client.guilds.fetch(req.params.botId).then((done) => {
      client.users
        .fetch(done.ownerId)
        .then((owner) => {
          const webhookInfo = {
            id: "1078785448505253898",
            token:
              "SdiXtmE6B2NQJu79RBbeF_AulnEQYRsZjGft5gw3RtBas-sTIA4dKjDxmi4GzuweMrwo",
          };
          const webhook = new WebhookClient(webhookInfo);
          // Create Buttons
          const billingRequiredRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Billing Portal")
              .setStyle(ButtonStyle.Link)
              .setURL("https://billing.stripe.com/p/login/7sI14EbeD34x0ms6oo")
              .setEmoji("🏦")
          );

          // Create Embed
          const paymentRequiredEmbed = new EmbedBuilder();
          paymentRequiredEmbed.setTitle("Arigo Payment Required ⚠️");
          paymentRequiredEmbed.setDescription(
            `Hello, ${owner.username}! :wave:\n\nThis is a **critical notification from Arigo** to notify you that your workspace & bot are scheduled for deletion within the next 24 hours because **there was an error processing your payment**. Please visit our billing portal to ensure that this months invoice is paid to avoid your workspace & bot being permanently deleted.\n\nArigo is unable to restore deleted workspaces or bots and those entities will need to be recreated.\n\nPlease direct any questions to us via the [live chat](https://support.arigoapp.com) or email at ` +
              "``accounts@arigoapp.com``."
          );
          paymentRequiredEmbed.setColor("Red");
          owner
            .send({
              embeds: [paymentRequiredEmbed],
              components: [billingRequiredRow],
            })
            .then((done) => {
              webhook.send(
                "Guild ``" +
                  b.id +
                  "`` has sucessfully notified the server owner " +
                  `(${owner.id}) about a payment needed.`
              );
            })
            .catch((err) => {
              webhook.send(
                "Guild ``" +
                  b.id +
                  "`` has **failed to notify** the server owner " +
                  `(${owner.id}) about a payment needed.`
              );
            });

          // Send back
          res.status(200).json("Success");
        })
        .catch((err) => {
          console.log("Error!!!", err);
        });
    });
  });
  // Get New Bot Creation DM
  app.get("/bot/:botId/push/new-bot/dm-owner", (req, res) => {
    const client = botMap.get(req.params.botId);
    // Get the Server
    const getServer = client.guilds.fetch(req.params.botId).then((done) => {
      // Get the Owner
      const owner = client.users.fetch(done.ownerId).then((owner) => {
        // Create Buttons
        const row2 = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Visit your Workspace")
            .setStyle(ButtonStyle.Primary)
            .setURL("https://app.arigoapp.com/workspace/123")
        );

        // Create Embed
        const toSendToOwnerEmbed = new EmbedBuilder();
        toSendToOwnerEmbed.setTitle(
          "Hey itilva8630, it's lovely to meet you! :wave:"
        );
        toSendToOwnerEmbed.setDescription(
          "This notification is to let you know that you've successfully setup your bot in `Arigo Community`, we'd like to welcome you to the Arigo family. We're here to provide you the tools your community needs to operate efficiently and better than ever.\n\nArigo provides industry-leading onboarding tools to get you started using our incredibly diverse platform. Feel free to reach out to your Account Executive, **Ishaan**, via email at ``ishaan@arigoapp.com`` if you need anything."
        );
        toSendToOwnerEmbed.setColor('Green');
        toSendToOwnerEmbed.setImage(
          "https://cdn.discordapp.com/attachments/819650597803393074/1020809031788539994/Hello_There.png"
        );
        owner.send({ embeds: [toSendToOwnerEmbed], components: [row2] });

        // Send back
        res.send("DM Successfully Sent");
      });
    });
  });

  // client.login(token)
})();
