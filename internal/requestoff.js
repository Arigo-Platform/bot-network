const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('requestoff')
		.setDescription('This will submit a request for your LOA')
  .addStringOption(option =>
		option.setName('type')
			.setDescription('The specific type of leave')
			.setRequired(true)
			.addChoice('Personal', '🌴')
			.addChoice('Sick', '😷')
			.addChoice('Bereavement', '⚰️'))
    .addStringOption(option =>
		option.setName('start-date')
			.setDescription('The day your leave will start (mm/dd/yyyy)')
			.setRequired(true))
     .addStringOption(option =>
		option.setName('end-date')
			.setDescription('The day your leave will end (mm/dd/yyyy)')
			.setRequired(true))
    .addStringOption(option =>
		option.setName('total-days')
			.setDescription('The total duration in days for your leave')
			.setRequired(true)),
  
	async execute(interaction, embed, db) {
// Basic needs 🤖
        const { MessageActionRow, MessageButton } = require('discord.js');
        const username = interaction.member.user.username
        const userId = interaction.member.user.id
        let user = interaction.guild.members.cache.get(userId)
        let logChannel = interaction.guild.channels.cache.get('952322005682778142')
        const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
        const moment = require('moment');

    // test
      
// Get ID

const string = interaction.options.getString('type');
const start = interaction.options.getString('start-date');
const end = interaction.options.getString('end-date');
const total = interaction.options.getString('total-days');
// Check if the leave is for personal reasons
if(string === '🌴') {
  // See the amount of personal time remaining
      var docRef = db.collection("internal-loa").doc(userId);
      docRef.get().then((doc) => {
      if (doc.exists) {
        if(doc.data().personalremaining - total >= '0') {
        // success
            const loaID = Math.floor(Math.random()*90000) + 10000;
          embed.setTitle("Success!")
          embed.setDescription("Your LOA request has been forwarded to the Human Resources Team. You'll get a DM from me when the LOA is approved/denied.\n\n Please ensure your DMs are open to all messages from this server to ensure you receive the DM.\n\n For reference, your LOA ID is ``" + loaID + "``.")
          embed.setColor("GREEN")
       interaction.reply({ embeds: [embed] });  
          embed.setTitle("New LOA Request")
          embed.setDescription(`<@${userId}> (${userId}) has submitted a new personal LOA request.`)
                embed.setColor(interaction.guild.me.displayColor)

          embed.addFields(
		{ name: 'Start Date', value: start, inline: true },
		{ name: 'End Date', value: end, inline: true },
		{ name: 'Total Days', value: total, inline: true},
		{ name: 'LOA ID', value: `${loaID}`, inline: true },
	)
        logChannel.send({ content: `<@&952321850443169802>,`, embeds: [embed] })
          // Add Case in DB
      async function quickstart() {

        const data = {
  userId: userId,
  start: start,
  end: end,
  total: total
};
        const res = await db.collection('internal-loa').doc(`${loaID}`).set(data);


        const data2 = {
        bereavementused: doc.data().bereavementused,
        personalremaining: set(doc.data().personalremaining) - parseInt(total),
        sickused: doc.data().sickused,
        
      }
                const res2 = await db.collection('internal-loa').doc(`${userId}`).set(data2);
          } quickstart();
          

          

        } else {
          embed.setTitle("Uh oh!")
          embed.setDescription("You don't have enough personal leave to sustain the entire duration of your requested LOA time.")
        embed.addField("Requested Amount", total)
        embed.addField("Personal Leave Remaining", `${doc.data().personalremaining}`)
        embed.setColor("RED")
        interaction.reply({ embeds: [embed] });
        }
    } else {
    // Not in db
        embed.setTitle("Uh oh!")
        embed.setDescription("You were previously not in the LOA database, please rerun the command. If continuously get this error, please notify <@473903419497775114> immediately.")
        embed.setColor("RED")
       interaction.reply({ embeds: [embed] });
 async function quickstart() {

        const data = {
  'bereavementused': '0',
  'personalused': '0',
  'personalremaining': '63',
  'sickused': '0'
};
        const res = await db.collection('internal-loa').doc(`${userId}`).set(data);
        
          } quickstart();    }
        
    }).catch((error)   => {
    console.log("Error getting document:", error);
  });
}

    // SICK






    if(string === '😷') {
  // See the amount of personal time remaining
      var docRef = db.collection("internal-loa").doc(userId);
      docRef.get().then((doc) => {
      if (doc.exists) {

        // success
            const loaID = Math.floor(Math.random()*90000) + 10000;
          embed.setTitle("Success!")
          embed.setDescription("Your LOA request has been forwarded to the Human Resources Team. You'll get a DM from me when the LOA is approved/denied.\n\n Please ensure your DMs are open to all messages from this server to ensure you receive the DM.\n\n For reference, your LOA ID is ``" + loaID + "``.")
          embed.setColor("GREEN")
       interaction.reply({ embeds: [embed] });  
          embed.setTitle("New LOA Request")
          embed.setDescription(`<@${userId}> (${userId}) has submitted a new sick LOA request.`)
                embed.setColor(interaction.guild.me.displayColor)

          embed.addFields(
		{ name: 'Start Date', value: start, inline: true },
		{ name: 'End Date', value: end, inline: true },
		{ name: 'Total Days', value: total, inline: true},
		{ name: 'LOA ID', value: `${loaID}`, inline: true },
	)
        logChannel.send({ content: `<@&952321850443169802>,`, embeds: [embed] })
          // Add Case in DB
      async function quickstart() {

        const data = {
  userId: userId,
  start: start,
  end: end,
  total: total
};
        const res = await db.collection('internal-loa').doc(`${loaID}`).set(data);

        const sickamountprior = doc.data().sickused
        console.log(sickamountprior)
        console.log(total)
      const data2 = {
        bereavementused: doc.data().bereavementused,
        personalremaining: doc.data().personalremaining,
        sickused: parseInt(sickamountprior) + parseInt(total),
        
      }
                const res2 = await db.collection('internal-loa').doc(`${userId}`).set(data2);

          } quickstart();
          

          

        
    } else {
    // Not in db
        embed.setTitle("Uh oh!")
        embed.setDescription("You were previously not in the LOA database, please rerun the command. If continuously get this error, please notify <@473903419497775114> immediately.")
        embed.setColor("RED")
       interaction.reply({ embeds: [embed] });
 async function quickstart() {

        const data = {
  'bereavementused': '0',
  'personalused': '0',
  'personalremaining': '63',
  'sickused': '0'
};
        const res = await db.collection('internal-loa').doc(`${userId}`).set(data);

console.log(doc.data())
   const data3 = {
        bereavementused: parseInt(doc.data().bereavementused) + parseInt(total),
        personalremaining: doc.data().personalremaining,
        sickused: doc.data().sickused,
        
      }
                const res3 = await db.collection('internal-loa').doc(`${userId}`).set(data3);
          } quickstart();   
      }
        
    }).catch((error)   => {
    console.log("Error getting document:", error);
  });
}
     // Bereavement






    if(string === '⚰️') {
  // See the amount of bereavement 
      var docRef = db.collection("internal-loa").doc(userId);
      docRef.get().then((doc) => {
      if (doc.exists) {

        // success
            const loaID = Math.floor(Math.random()*90000) + 10000;
          embed.setTitle("Success!")
          embed.setDescription("Your LOA request has been forwarded to the Human Resources Team. You'll get a DM from me when the LOA is approved/denied.\n\n Please ensure your DMs are open to all messages from this server to ensure you receive the DM.\n\n For reference, your LOA ID is ``" + loaID + "``. We're sorry for your loss.")
          embed.setColor("GREEN")
       interaction.reply({ embeds: [embed] });  
          embed.setTitle("New LOA Request")
          embed.setDescription(`<@${userId}> (${userId}) has submitted a new bereavement LOA request.`)
                embed.setColor(interaction.guild.me.displayColor)

          embed.addFields(
		{ name: 'Start Date', value: start, inline: true },
		{ name: 'End Date', value: end, inline: true },
		{ name: 'Total Days', value: total, inline: true},
		{ name: 'LOA ID', value: `${loaID}`, inline: true },
	)
        logChannel.send({ content: `<@&952321850443169802>,`, embeds: [embed] })
          // Add Case in DB
      async function quickstart() {

        const data = {
  userId: userId,
  start: start,
  end: end,
  total: total
};
        const res = await db.collection('internal-loa').doc(`${loaID}`).set(data);

        
      const data2 = {
        bereavementused: parseInt (doc.data().bereavementused) + parseInt(total),
        personalremaining: doc.data().personalremaining,
        sickused: doc.data().sickused,
        
      }
                const res2 = await db.collection('internal-loa').doc(`${userId}`).set(data2);

          } quickstart();
          

          

        
    } else {
    // Not in db
        embed.setTitle("Uh oh!")
        embed.setDescription("You were previously not in the LOA database, please rerun the command. If continuously get this error, please notify <@473903419497775114> immediately.")
        embed.setColor("RED")
       interaction.reply({ embeds: [embed] });
 async function quickstart() {

        const data = {
  'bereavementused': '0',
  'personalused': '0',
  'personalremaining': '63',
  'sickused': '0'
};
        const res = await db.collection('internal-loa').doc(`${userId}`).set(data);
        
          } quickstart();    }
        
    }).catch((error)   => {
    console.log("Error getting document:", error);
  });
}


    
  },
};