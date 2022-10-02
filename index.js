const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { guildId } = require('./config.json');
const { MessageEmbed } = require('discord.js');
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');
const { MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');
const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');

app.get('/', (req, res) => {
  res.send('Server Not Found - Key Missing')
 
})


app.listen(port, () => {
  console.log(`Arigo listening on port ${port}`)
})

// Get all the bots here, then forEach through them with the code below (creating a new client, initing commands, etc)

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
        .setCustomId('subscribe-button')
        .setLabel('Subscribe')
        .setStyle('PRIMARY')
        .setEmoji('📰')
			)
      .addComponents(
				new MessageButton()
        .setCustomId('unsubscribe-button')
        .setLabel('Unsubscribe')
        .setStyle('DANGER')
			);
      
  const toDm = await client.users.fetch('695167288801886269')
  const newsletterembed = new MessageEmbed()
  newsletterembed.setTitle("Exclusive Newsletter Post - 50% off your subscription")
  newsletterembed.setDescription(`Hey ${toDm.username},\n\nWe hope you're having a great evening and we're here to deliver some good news. After manual review of your account and your active subscriptions, we're happy to let you know that you're eligible for 50% off next month for one bot. You can use this promotion on one of your existing bots or on a new bot.\n\nPlease email accounts@arigoapp.com to claim, promotion ends <t:1661022000:R>.\n\nHave a great rest of your Tuesday,\n Your friends at Arigo`)
  newsletterembed.setColor("#ed1d24")
  newsletterembed.setImage('https://cdn.discordapp.com/attachments/1007352628365238432/1009204973525016586/unknown.png')
  // await toDm.send({ embeds: [newsletterembed] })

  const supportEmbed = new MessageEmbed()
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
  //   const embedkosma = new MessageEmbed()
  //     embedkosma.setTitle("🎉 Annoying Emoji Filtered")
  //    embedkosma.setDescription(`Internal automated systems have filtered an annoying emoji. Due to this being an automated action, a Case ID will not be assigned and this case will not be logged.`)
  //    embedkosma.setColor("GREEN")
  //   msg.channel.send({ embeds: [embedkosma] })
  // }
  // }

})

// Deleted Message
client.on('messageDelete', async message => {
  const cityReff = db.collection('bots').doc(`${guildId}`).collection('settings').doc('messageLogChannel');
  const doc2 = await cityReff.get();
  let logChannel = await client.channels.fetch(doc2.data().id)
  if(message.author.bot == true) {
    // From bot, disregard
  } else {
    if(message.attachments.size > 0) {
      const deletedmsg = new MessageEmbed()
  deletedmsg.setTitle("New Message Deleted")
  deletedmsg.setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n${message.content}\n\n**Attachment:**\n${message.attachments.first().attachment}`)
  deletedmsg.setFooter({
text: "Designed by Arigo",
iconURL: "https://cdn.arigoapp.com/logo"
}),
deletedmsg.setColor("#ed1d24")
deletedmsg.setTimestamp()
logChannel.send({ embeds: [deletedmsg] })
} else {
// No Attachment
      const deletedmsg = new MessageEmbed()
  deletedmsg.setTitle("New Message Deleted")
  deletedmsg.setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n${message.content}`)
  deletedmsg.setFooter({
text: "Designed by Arigo",
iconURL: "https://cdn.arigoapp.com/logo"
}),
deletedmsg.setColor("#ed1d24")
deletedmsg.setTimestamp()
logChannel.send({ embeds: [deletedmsg] }) 
  }
    }
});

// Edited Message

client.on('messageUpdate', async function(oldMessage, newMessage) {  
  
 if(newMessage.author.bot == true) {
   // From bot, disregard

   } else {
  if(newMessage.content == oldMessage.content) {
    // Message is the same
  } else{
    
     
  const cityReff = db.collection('bots').doc(`${guildId}`).collection('settings').doc('messageLogChannel');
  const doc2 = await cityReff.get();
  let logChannel = await client.channels.fetch(doc2.data().id)
  const editedmsg = new MessageEmbed()
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


// Database
const {Firestore} = require('@google-cloud/firestore');
        const firestore = new Firestore();
        const db = new Firestore({
          projectId: 'arigo-platform',
          keyFilename: 'key.json',
        });

// Slack info
const { WebClient } = require('@slack/web-api');
// Read a token from the environment variables
const Slacktoken = 'xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2'
// Initialize
const web = new WebClient(Slacktoken);
const conversationId = 'C037PJVBAAE';
const threatSlack = 'C03TPE2MAFP';


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
client.on('guildMemberAdd', member => {
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
       const welcomeembed = new MessageEmbed()

     welcomeembed.setTitle("Welcome to Arigo Community! :wave:") 
     welcomeembed.setDescription(`Hey, <@${member.user.id}>! Welcome to Arigo Community, we'll let you get settled in. Until then, feel free to let us know if you need any guidance. Check out our [website](https://arigoapp.com) and [blog](https://medium.com/arigo) to learn more about Arigo Platform and our mission. We hope to see you soon! ${emojis[random]}`)
    welcomeembed.setFooter({
  text: "Designed by Arigo",
  iconURL: "https://cdn.arigoapp.com/logo"
  }),
    welcomeembed.setColor("#ed1d24")
    welcomeembed.setTimestamp()
         client.channels.cache.get("944434855452749844").send({ content: `<@${member.user.id}>,`, embeds: [welcomeembed] })
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
      const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
        .setLabel('Create account')
        .setStyle('LINK')
        .setURL('https://app.arigoapp.com/create-account')
			)
      // Create embed
      const noAccessEmbed = new MessageEmbed()
      noAccessEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      noAccessEmbed.setColor('RED')
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
      const alreadyExistsEmbed = new MessageEmbed()
      alreadyExistsEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      alreadyExistsEmbed.setColor('RED')
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
      const successEmbed = new MessageEmbed()
      successEmbed.setFooter({
      text: "Designed by Arigo",
      iconURL: interaction.client.user.displayAvatarURL()
      }),
      successEmbed.setColor('GREEN')
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
    const deleteSuccessEmbed = new MessageEmbed()
    deleteSuccessEmbed.setFooter({
    text: "Designed by Arigo",
    iconURL: interaction.client.user.displayAvatarURL()
    }),
    deleteSuccessEmbed.setColor('GREEN')
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
    const notSubscribedEmbed = new MessageEmbed()
    notSubscribedEmbed.setFooter({
    text: "Designed by Arigo",
    iconURL: interaction.client.user.displayAvatarURL()
    }),
    notSubscribedEmbed.setColor('RED')
    notSubscribedEmbed.setTimestamp() 
    notSubscribedEmbed.setTitle("<:x_:957002602921492570> Uh oh")
    notSubscribedEmbed.setDescription("You're not subscribed to our newsletter so we were unable to unsubscribe you.")
    return interaction.reply({ embeds: [notSubscribedEmbed], ephemeral: true })
  }
}
})

client.on('interactionCreate', async interaction => {
  console.log(process.memoryUsage().heapUsed / 1024 / 1024)


// BOT SUSPENSIONS TO SLACK
    // Flags to Slack & Check for banss
  //    var docReftoCheckk = db.collection("bot-suspension").doc(interaction.user.id)
  //    docReftoCheckk.get().then( async (doc2) => {
  //    if(doc2.exists){
  //    const unauthembed = new MessageEmbed()
  //    unauthembed.setTitle("⚠️ Unable To Execute Command")
  //    unauthembed.setDescription(`Hello, <@${interaction.member.user.id}>. Your account is currently suspended from Arigo Community, Arigo Platform, and the Arigo Platform Bot Network. We rarely issue these suspensions unless a major policy is violated; in which case we believe the user poses a threat to our network. We encourage you to reach out to us via` + "``moderation@arigoapp.com`` as we're always willing to resolve things with you.\n\n**Moderator Note**\n" + doc2.data().tag)
  //   unauthembed.setFooter({
  // text: "Designed by Arigo",
  // iconURL: client.user.displayAvatarURL()
  // }),
  //   unauthembed.setColor("RED")
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


    const embed = new MessageEmbed()
  
    embed.setFooter({
  text: "Designed by Arigo",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
    embed.setColor(interaction.guild.me.displayColor)
    embed.setTimestamp()
	try {
		await command.execute(interaction, embed, db);
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
      const row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
        .setLabel('Visit your Workspace')
        .setStyle('LINK')
        .setURL('https://app.arigoapp.com/workspace/123')
			)
      
      // Create Embed
      const toSendToOwnerEmbed = new MessageEmbed()
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

client.login(token);
