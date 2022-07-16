const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const { MessageEmbed } = require('discord.js');
const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

app.get('/', (req, res) => {
  res.send('Server Not Found')
 
})

app.listen(port, () => {
  console.log(`Arigo listening on port ${port}`)
})
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
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

  const activities = [
  "Team Arigo",
  "Arigo Community",
  "arigoapp.com",
  "the team",
  "Team Arigo"
];
    setInterval(() => {
    // generate random number between 1 and list length.
    const randomIndex = Math.floor(Math.random() * (activities.length - 1) + 1);
    const newActivity = activities[randomIndex];
client.user.setActivity(newActivity, {
  type: "WATCHING",
});
  }, 5000);
// Annoying Mahan
  // setInterval(() => {
  //   // generate random number between 1 and list length.
  //            client.channels.cache.get("944434855452749844").send({ content: `<@809126129646567444> fuck off 💋` })

  // }, 500);
  
// });  
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
 let logChannel = await client.channels.fetch("864677232650879026")
  if(message.author.bot == true) {
    // From bot, disregard
  } else {
    if(message.attachments.size > 0) {
      const deletedmsg = new MessageEmbed()
  deletedmsg.setTitle("New Message Deleted")
  deletedmsg.setDescription(`**User:** <@${message.author.id}> (${message.author.id})\n**Channel:** <#${message.channelId}> (${message.channelId})\n${message.content}\n\n**Attachment:**\n${message.attachments.first().attachment}`)
  deletedmsg.setFooter({
text: "Powered by Arigo Platform",
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
text: "Powered by Arigo Platform",
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
    
     
  let logChannel = await client.channels.fetch("864677232650879026")

      const editedmsg = new MessageEmbed()
  editedmsg.setTitle("New Message Edited")
  editedmsg.setDescription(`**User:** <@${newMessage.author.id}> (${newMessage.author.id})\n**Channel:** <#${newMessage.channelId}> (${newMessage.channelId})`)
editedmsg.addFields(
  { name: 'Old Message', value: `${oldMessage.content}`, inline: true },
  { name: 'New Message', value: `${newMessage.content}`, inline: true },
	)
  editedmsg.setFooter({
text: "Powered by Arigo Platform",
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
const Slacktoken = process.env['SLACK_TOKEN']
// Initialize
const web = new WebClient(Slacktoken);
const conversationId = 'C037PJVBAAE';
const threatSlack = 'C038XJWBM3N';

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
  text: "Powered by Arigo Platform",
  iconURL: "https://cdn.arigoapp.com/logo"
  }),
    welcomeembed.setColor("#ed1d24")
    welcomeembed.setTimestamp()
         client.channels.cache.get("944434855452749844").send({ content: `<@${member.user.id}>,`, embeds: [welcomeembed] })
});

// Interaction Stuff
client.on('interactionCreate', async interaction => {
// BOT SUSPENSIONS TO SLACK
    // Flags to Slack & Check for banss
  //    var docReftoCheckk = db.collection("bot-suspension").doc(interaction.user.id)
  //    docReftoCheckk.get().then( async (doc2) => {
  //    if(doc2.exists){
  //    const unauthembed = new MessageEmbed()
  //    unauthembed.setTitle("⚠️ Unable To Execute Command")
  //    unauthembed.setDescription(`Hello, <@${interaction.member.user.id}>. Your account is currently suspended from Arigo Community, Arigo Platform, and the Arigo Platform Bot Network. We rarely issue these suspensions unless a major policy is violated; in which case we believe the user poses a threat to our network. We encourage you to reach out to us via` + "``moderation@arigoapp.com`` as we're always willing to resolve things with you.\n\n**Moderator Note**\n" + doc2.data().tag)
  //   unauthembed.setFooter({
  // text: "Powered by Arigo Platform",
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
  embed.setAuthor({
  name: interaction.member.user.username,
  iconURL: interaction.member.user.avatarURL()
  }),
    embed.setFooter({
  text: "Powered by Arigo Platform",
  iconURL: interaction.client.user.displayAvatarURL()
  }),
    embed.setColor(interaction.guild.me.displayColor)
    embed.setTimestamp()
	try {
		await command.execute(interaction, embed, db);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
// }}) - Bot Suspension
})
        

client.login(token);
