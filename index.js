(async() => {
const fs = require('fs');
const { Routes, REST, SlashCommandBuilder, ButtonStyle, ActionRowBuilder, GatewayIntentBits, Client, EmbedBuilder, Collection, Partials, Events } = require('discord.js');

// MAKE SURE TO TURN ON NODE DEPLOY COMMANDS- JS
const guildId = process.env["guildId"]
const clientId = process.env["clientId"]
const environment = 'production'

  // MAKE SURE TO TURN ON NODE DEPLOY COMMANDS- JS
// const token = 'OTUyMzEwNzYxODY5NDEwNDU1.GxTOp_.Wlbpsux_Kzl7yZ7_0K1e6J7hK7ysch7gzyz9dI'
// const guildId = '864016187107966996'
// const clientId = '952310761869410455'
// const environment = 'development'
//----
const express = require('express')
const app = express()
const port = 4000
const axios = require('axios');
const { MessageActionRow, ButtonBuilder, Modal, TextInputComponent } = require('discord.js');
const { execSync } = require('child_process');


        // Sentry Info
        const Sentry = require("@sentry/node");
        // or use es6 import statements
        // import * as Sentry from '@sentry/node';
        
        const Tracing = require("@sentry/tracing");
        // or use es6 import statements
        // import * as Tracing from '@sentry/tracing';
        
        Sentry.init({
          dsn: "https://6a44c1853d94409a908ebbf48c5bde32@o4504084672610304.ingest.sentry.io/4504085017133056",
          environment: environment,
          tracesSampleRate: 1.0,
          // Set tracesSampleRate to 1.0 to capture 100%
          // of transactions for performance monitoring.
          // We recommend adjusting this value in production
        });
        Sentry.setContext("Bot Information", {
          guildId: guildId,
          clientId: clientId,
        });
        Sentry.setTag("guildId", guildId);
        Sentry.setTag("clientId", clientId);

        const transaction = Sentry.startTransaction({
          op: "bot-network",
          name: "Arigo Bot Network",
        });
  // Database
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
const db = new Firestore({
  projectId: 'arigo-platform',
  keyFilename: 'key.json',
});

  


// Slack info
const { WebClient } = require('@slack/web-api');
const { json } = require('body-parser');
// Read a token from the environment variables
const Slacktoken = 'xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2'
// Initialize
const web = new WebClient(Slacktoken);
const conversationId = 'C037PJVBAAE';
const threatSlack = 'C03TPE2MAFP';

// Datadog Events
const { createLogger, format, transports } = require('winston');
const e = require('express');
const { forEach } = require('mathjs');

const httpTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: '/api/v2/logs?dd-api-key=1442915acc3362533ed7ffa6cb42fca1&ddsource=nodejs&service=BotNetwork',
  ssl: true
};

const events = createLogger({
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpTransportOptions),
  ],
});

module.exports = events;

app.get('/', (req, res) => {
  res.send('Server Not Found - Key Missing')
 
})


app.listen(port, () => {
  console.log(`Arigo listening on port ${port}`)
})

// Get all the bots here, then forEach through them with the code below (creating a new client, initing commands, etc)

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
], partials: [Partials.Channel, Partials.Message] });
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}
client.once('ready', async () => {
  // appearanceCheck()
  // Node Deploy Commands (deploy-commands).js
  const output = execSync('node deploy-commands.js', { encoding: 'utf-8' });
  console.log(`Output: ${output}`);
  
  const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
        .setCustomId('subscribe-button')
        .setLabel('Subscribe')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('📰')
			)
      .addComponents(
				new ButtonBuilder()
        .setCustomId('unsubscribe-button')
        .setLabel('Unsubscribe')
        .setStyle(ButtonStyle.Danger)
			);
  const newsletterRow = new ActionRowBuilder()
  .addComponents(
    new ButtonBuilder()
    .setLabel("Complete Form")
    .setStyle(ButtonStyle.Link)
    .setURL('https://forms.gle/4xNicVNPMvvF3K3K9'
    )
  )
  const toSendrow = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setLabel('View Blog Update')
              .setURL('https://support.arigoapp.com/blog/nov-update')
              .setStyle(ButtonStyle.Link),
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

  const supportEmbed = new EmbedBuilder()
  supportEmbed.setTitle("Join the newsletter")
  supportEmbed.setDescription(`Subscribe to Arigo's free newsletter where we'll send you important *personalized* updates and useful tips straight to your Discord inbox.\n\nWe'll never send you something irreverent or spam your direct messages. Reach out to us at community@arigoapp.com with any questions or concerns.`)
  supportEmbed.setColor("#ed1d24")
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
	console.log('Ready!');

    // Get status & update
    const cityReff = db.collection('bots').doc(`${guildId}`).collection('settings').doc(`appearance`);
    const dbStatus = await cityReff.get();
    if(parseInt(dbStatus.data().visibility) === 1) {
      client.user.setStatus('online');
    } else if(parseInt(dbStatus.data().visibility)=== 2) {
      client.user.setStatus('dnd')
    } else if(parseInt(dbStatus.data().visibility) === 3) {
      client.user.setStatus('idle');
    } else if(parseInt(dbStatus.data().visibility) === 4) {
      client.user.setStatus('invisible');
    }
  const activities = {
    "Team Arigo": "WATCHING",
    "in Arigo Community": "PLAYING",
    "on Arigo": "PLAYING",
    "arigoapp.com": "WATCHING", 
    "the team": "WATCHING", 
  }
    setInterval(() => {
    // generate random number between 1 and list length.
    const keys = Object.keys(activities)
    const prop = keys[Math.floor(Math.random() * keys.length)]
    client.user.setPresence({ activities: [{ name: prop, type: activities[prop] }] });

  }, 10000);



// setInterval(() => {
//   client.channels.cache.get("997941489994825790").send({ content: `<@809126129646567444> bob 💋` })

//   }, 500);
  
  // client.on('messageCreate', async msg => {
  // if(msg.author.id == '695167288801886269'){
  //     if(msg.content.includes(':e0_laugh:' || ':lol:')){
  //       msg.delete()
  //   const embedkosma = new EmbedBuilder()
  //     embedkosma.setTitle("🎉 Annoying Emoji Filtered")
  //    embedkosma.setDescription(`Internal automated systems have filtered an annoying emoji. Due to this being an automated action, a Case ID will not be assigned and this case will not be logged.`)
  //    embedkosma.setColor("Green")
  //   msg.channel.send({ embeds: [embedkosma] })
  // }
  // }

})


// Deleted Message
client.on(Events.MessageDelete, async message => {
  const cityReff = db.collection('bots').doc(`${guildId}`).collection('settings').doc('messageLogChannel');
  const doc2 = await cityReff.get();
  let logChannel = await client.channels.fetch(doc2.data().id)
  var attachments
  try {
if(message.author.bot == false) {
    // From bot, disregard
  
    if(message.attachments.size > 0) {
      message.attachments.forEach(one => {
        const step1 =  attachments + " " + one.attachment
        attachments =  step1.replace(undefined, '')
      }).catch(err => {
        console.log("Message Deleted Error", err)
      })
    
  const deletedmsg = new EmbedBuilder()
  deletedmsg.setTitle("New Message Deleted")
  deletedmsg.setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n**Content:** ${message.content}\n\n**Attachment:**\n${attachments}`)
  deletedmsg.setFooter({
text: "Designed by Arigo",
iconURL: "https://cdn.arigoapp.com/logo"
}),
deletedmsg.setColor("#ed1d24")
deletedmsg.setTimestamp()
logChannel.send({ embeds: [deletedmsg] })
} else {
// No Attachment
      const deletedmsg = new EmbedBuilder()
  deletedmsg.setTitle("New Message Deleted")
  deletedmsg.setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n**Content:** ${message.content}`)
  deletedmsg.setFooter({
text: "Designed by Arigo",
iconURL: "https://cdn.arigoapp.com/logo"
}),
deletedmsg.setColor("#ed1d24")
deletedmsg.setTimestamp()
logChannel.send({ embeds: [deletedmsg] }) 
  }
}
} catch (err) {
  console.log("Message Deleted error", err)
}
});

// Edited Message

client.on(Events.MessageUpdate, async function(oldMessage, newMessage) {  
  
 if(newMessage.author.bot == false) {
   // From bot, disregard
  if(newMessage.content == oldMessage.content) {
    // Message is the same
  } else{
    
     
  const cityReff = db.collection('bots').doc(`${guildId}`).collection('settings').doc('messageLogChannel');
  const doc2 = await cityReff.get();
  let logChannel = await client.channels.fetch(doc2.data().id)
  const editedmsg = new EmbedBuilder()
  editedmsg.setTitle("New Message Edited")
  editedmsg.setDescription(`**User:** <@${newMessage.author.id}> (${newMessage.author.id})\n**Channel:** <#${newMessage.channelId}> (${newMessage.channelId})`)

  editedmsg.addFields(
  { name: 'Old Message', value: `${oldMessage.content}`, inline: true },
  { name: 'New Message', value: `${newMessage.content}`, inline: true },
	)
  editedmsg.setFooter({
text: "Designed by Arigo",
iconURL: "https://cdn.arigoapp.com/logo"
}),
editedmsg.setColor("#ed1d24")
editedmsg.setTimestamp()
logChannel.send({ embeds: [editedmsg] }) 
  }
  }
})



// Blacklisted Words

const blacklisted =[
  "open source",
  "oss",
  "ddos",
  "luke",
  "sayz",
  "hyra",
  "sam",
  "andre",
  "unlicense",
  "alt"
]
  client.on('messageCreate', async msg => {
    if(blacklisted.some(blacklist => msg.content.toLowerCase().includes(blacklist))) {

       if(msg.member.roles.cache.has("864016187226718251") === false) {
        
            (async () => {

  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
  
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*${msg.author.username}* (${msg.author.id}), has posted a message in Arigo Community that could potentially start drama. `
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*Message:*\n`" + msg.content + "`"
				},
				{
					type: "mrkdwn",
					text: "*When:*\n" + new Date()
				},
				{
					type: "mrkdwn",
					text: "*Message URL:*\n" + `https://discord.com/channels/${msg.guildId}/${msg.channelId}/${msg.id}`
				},
				{
					type: "mrkdwn",
					text: "*Channel ID:*\n" + msg.channelId
				}
			]
		}
	],
    channel: threatSlack,
  });

  console.log(`Successfully send message ${result.ts} in conversation ${threatSlack}`);
})();
    }
    }
})

  
  
// Welcome Message
client.on('guildMemberAdd', async member => {
  console.log("member", member)
  const emojis = [
    '👏',
    '🙌',
    '🤩',
    '😎',
    '😊',
    '😀',
    '😄',
    '😁'
  ]
  const random = Math.floor(Math.random() * emojis.length);
      // Get values from database
      const getTitle = db.collection('bots').doc(`${guildId}`).collection('settings').doc(`welcomeTitle`);
      const doc1 = await getTitle.get();

      const getDescription = db.collection('bots').doc(`${guildId}`).collection('settings').doc(`welcomeText`);
      const doc2 = await getDescription.get();

      const getChannel = db.collection('bots').doc(`${guildId}`).collection('settings').doc(`welcomeChannel`);
      const doc3 = await getChannel.get();

      const capturedTitle = doc1.data().text
      const capturedDescription = doc2.data().text
      const capturedChannel = doc3.data().id

      // Ensure that we filter out the things - Title
      const titleOne = capturedTitle.replaceAll("{username}", `${member.user.username}`);
      const titleTwo = titleOne.replaceAll("{serverName}", `${member.guild.name}`);
      const finalTitle = titleTwo

      // Ensure that we filter out the things - Description
      const descriptionOne = capturedDescription.replaceAll("{members}", `${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}`);
      const descriptionTwo = descriptionOne.replaceAll("{userPing}", `<@${member.user.id}>`);
      const descriptionThree = descriptionTwo.replaceAll("{serverName}", `${member.guild.name}`);
      const descriptionFour = descriptionThree.replaceAll("{username}", `${member.user.username}`);
      const descriptionFive = descriptionFour.replaceAll("/n", `\n`);
      const finalDescription = descriptionFive

      console.log({ 
        1: finalTitle,
        2: finalDescription,
        3: capturedChannel
    
      })
  // \n
  // random emoji
       const welcomeembed = new EmbedBuilder()
     welcomeembed.setTitle(`${finalTitle}`) 
     welcomeembed.setDescription(`${finalDescription}`)
    welcomeembed.setFooter({
  text: "Designed by Arigo",
  iconURL: "https://cdn.arigoapp.com/logo"
  }),
    welcomeembed.setColor("#ed1d24")
    welcomeembed.setTimestamp()
    client.channels.cache.get(`${capturedChannel}`).send({ content: `<@${member.user.id}>,`, embeds: [welcomeembed] })
});

// Interaction Stuff

client.on('interactionCreate', interaction => {
	if (!interaction.isModalSubmit()) return;
	console.log(interaction);
});
client.on('interactionCreate', interaction => {
  if (!interaction.isModalSubmit()) return;
	// Get the data entered by the user
	const support = interaction.fields.getTextInputValue('supportInput');
	console.log({ support });
	if (interaction.customId === 'myModal') {
		 interaction.reply({ content: 'Your submission was recieved successfully!' });
	}
});
client.on('interactionCreate', async interaction => {

	if (!interaction.isButton()) return;
  if(interaction.customId === 'subscribe-button') {
      // See if they have an Arigo account
    const cityReff = db.collection('accounts').doc(`${interaction.user.id}`);
    const accessCheck = await cityReff.get();
    if(!accessCheck.exists) {
      // Log error to Slack
      await web.chat.postMessage({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${interaction.user.username}* (${interaction.user.id}) attempted to subscribe but doesn't have an active account.`
            }
          },
        ],
          channel: threatSlack,
        });

      // Create button
      const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
        .setLabel('Create account')
        .setStyle(ButtonStyle.Link)
        .setURL('https://app.arigoapp.com/create-account')
			)
      // Create embed
      const noAccessEmbed = new EmbedBuilder()
      noAccessEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      noAccessEmbed.setColor('Red')
      noAccessEmbed.setTimestamp() 
      noAccessEmbed.setTitle("<:x_:957002602921492570> Almost there...")
      noAccessEmbed.setDescription("You're almost there! In order to setup newsletter notifications, you'll need to setup an account with Arigo.\n\nDon't worry, creating an account takes seconds.")
      return interaction.reply({ embeds: [noAccessEmbed], components: [row], ephemeral: true })
    }
    // Already subscribed
    const cityRef = db.collection('newsletter').doc(`${interaction.user.id}`);
    const alreadyExist = await cityRef.get();
    if(alreadyExist.exists) {
      // Log to Slack
      // Log to Slack
    await web.chat.postMessage({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${interaction.user.username}* (${interaction.user.id}) attempted to subscribe but is already subscribed.`
          }
        },
      ],
        channel: threatSlack,
      });
      // Create embed
      const alreadyExistsEmbed = new EmbedBuilder()
      alreadyExistsEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      alreadyExistsEmbed.setColor('Red')
      alreadyExistsEmbed.setTimestamp() 
      alreadyExistsEmbed.setTitle("<:x_:957002602921492570> Woah")
      alreadyExistsEmbed.setDescription("You're already subscribed to our waitlist, nothing else to worry about!")
      return interaction.reply({ embeds: [alreadyExistsEmbed], ephemeral: true })
    }
      // Log to Slack
      await web.chat.postMessage({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${interaction.user.username}* (${interaction.user.id}) has subscribed.`
            }
          },
        ],
          channel: threatSlack,
        });
      // Add to database
      const data = {
        "registered": new Date()
      }
      const res = await db.collection("newsletter").doc(`${interaction.user.id}`).set(data)
      // Send notification
      const successEmbed = new EmbedBuilder()
      successEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      successEmbed.setColor('Green')
      successEmbed.setTimestamp() 
      successEmbed.setTitle("<:check:957002603252830208> You're subscribed")
      successEmbed.setDescription(`You'll get notifications straight to your Discord inbox - just make sure your privacy settings allow direct messages from server members.\n\nYou can unsubscribe at anytime using the ` + "`Unsubscribe` button above.")
      return interaction.reply({ embeds: [successEmbed], ephemeral: true })
   

  }
});

// Unsubscribe button
client.on('interactionCreate', async interaction => {
if(interaction.customId === 'unsubscribe-button') {
   
  // Check if subscribed
  const cityRef = db.collection('newsletter').doc(`${interaction.user.id}`);
  const alreadyExist = await cityRef.get();
  if(alreadyExist.exists) {
    // On newsletter
    // Log to Slack
    await web.chat.postMessage({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${interaction.user.username}* (${interaction.user.id}) unsubscribed.`
          }
        },
      ],
        channel: threatSlack,
      });
    // Remove from database
    cityRef.delete()
    // Send embed
    const deleteSuccessEmbed = new EmbedBuilder()
    deleteSuccessEmbed.setFooter({
    text: "Designed by Arigo",
    iconURL: interaction.client.user.displayAvatarURL()
    }),
    deleteSuccessEmbed.setColor('Green')
    deleteSuccessEmbed.setTimestamp() 
    deleteSuccessEmbed.setTitle("<:check:957002603252830208> You're unsubscribed")
    deleteSuccessEmbed.setDescription("You won't get anymore newsletter notifications from us in the future, feel free to resubscribe at anytime.")
    return interaction.reply({ embeds: [deleteSuccessEmbed], ephemeral: true })
  } else {
    // Log to Slack
    await web.chat.postMessage({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${interaction.user.username}* (${interaction.user.id}) attempted to unsubscribe but isn't subscribed.`
          }
        },
      ],
        channel: threatSlack,
      });
    // Send embed
    const notSubscribedEmbed = new EmbedBuilder()
    notSubscribedEmbed.setFooter({
    text: "Designed by Arigo",
    iconURL: interaction.client.user.displayAvatarURL()
    }),
    notSubscribedEmbed.setColor('Red')
    notSubscribedEmbed.setTimestamp() 
    notSubscribedEmbed.setTitle("<:x_:957002602921492570> Uh oh")
    notSubscribedEmbed.setDescription("You're not subscribed to our newsletter so we were unable to unsubscribe you.")
    return interaction.reply({ embeds: [notSubscribedEmbed], ephemeral: true })
  }
}
})

client.on('interactionCreate', async interaction => {


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
            
  var docReftoCheck = db.collection("flags").doc(interaction.user.id)
        docReftoCheck.get().then((doc) => {
          if(doc.exists) {
            
          
  

(async () => {

  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
  
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*${interaction.user.username}* (${interaction.user.id}), a flagged account, has accessed the Arigo Platform Bot Network.`
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*Command:*\n`" + interaction.commandName + "`"
				},
				{
					type: "mrkdwn",
					text: "*When:*\n" + new Date()
				},
				{
					type: "mrkdwn",
					text: "*Server Name:*\n" + interaction.member.guild.name
				},
				{
					type: "mrkdwn",
					text: "*Server ID:*\n" + interaction.member.guild.id
				}
			]
		}
	],
    channel: conversationId,
  });

  console.log(`Successfully send message ${result.ts} in conversation ${conversationId}`);
})();
            }
        })
  // End of flags to Slack
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;
//           client.on('interactionCreate', interaction => {
// 	if (!interaction.isButton()) return;
// 	console.log(interaction);
// });


    const embed = new EmbedBuilder()
  
    embed.setFooter({
  text: "Designed by Arigo",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
    embed.setColor(interaction.guild.members.me.displayColor)
    embed.setTimestamp()
	try {
		await command.execute(interaction, embed, db, events, Sentry);
	} catch (error) {
		console.error('Error', error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
// }}) - Bot Suspension
})

// Get New Bot Creation DM
app.get('/bot/push/new-bot/dm-owner/:serverId', (req, res) => {
  // Get the Server
  const getServer = client.guilds.fetch(req.params.serverId).then(done => {
    // Get the Owner
    const owner = client.users.fetch(done.ownerId).then(owner => {
      // Create Buttons
      const row2 = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
        .setLabel('Visit your Workspace')
        .setStyle(ButtonStyle.Link)
        .setURL('https://app.arigoapp.com/workspace/123')
			)
      
      // Create Embed
      const toSendToOwnerEmbed = new EmbedBuilder()
      toSendToOwnerEmbed.setTitle("Hey itilva8630, it's lovely to meet you! :wave:")
      toSendToOwnerEmbed.setDescription("This notification is to let you know that you've successfully setup your bot in `Arigo Community`, we'd like to welcome you to the Arigo family. We're here to provide you the tools your community needs to operate efficiently and better than ever.\n\nArigo provides industry-leading onboarding tools to get you started using our incredibly diverse platform. Feel free to reach out to your Account Executive, **Ishaan**, via email at ``ishaan@arigoapp.com`` if you need anything.")
      toSendToOwnerEmbed.setColor("#5066c2")
      toSendToOwnerEmbed.setImage('https://cdn.discordapp.com/attachments/819650597803393074/1020809031788539994/Hello_There.png')
      owner.send({ embeds: [toSendToOwnerEmbed], components: [row2] })

      // Send back
      res.send('DM Successfully Sent')

    })

  })
 
})

  const getToken = db.collection('bots').doc(`${guildId}`)
  const tokenValue = await getToken.get();
  client.login(tokenValue.data().token);
// client.login(token)
})()
