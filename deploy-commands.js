(async () => {
const fs = require('fs');
const { REST, SlashCommandBuilder, Routes } = require('discord.js');
const clientId = process.env["clientId"]
const guildId = process.env["guildId"]
const token = process.env["token"]
// const clientId = '952310761869410455'
// const guildId = '864016187107966996'
// const token = 'OTUyMzEwNzYxODY5NDEwNDU1.Gka9mg.QvSBDBEYm-PpEDjvXJnoJ36nWyoxCEshCWTRn8'
let moderation = "ERROR - Stuck at Var";
let suggestion = "ERROR - Stuck at Var";
let utility = "ERROR - Stuck at Var";
const {Firestore} = require('@google-cloud/firestore');
        const firestore = new Firestore();
        const db = new Firestore({
          projectId: 'arigo-platform',
          keyFilename: 'key.json',
        });
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var enabled = [
	'help'
]
// Moderation Module
const data = db.collection('bots').doc(`${guildId}`).collection('modules').doc('moderation');
	const doc = await data.get();
	if(doc.data().status === 'enabled') {
	  enabled.push('ban', 'case', 'kick', 'slowmode', 'timeout', 'warn')
	} else if(doc.data().status === 'disabled') {
		const toRemove = [
			'ban',
			'case',
			'kick',
			'slowmode',
			'timeout',
			'warn'
		  ]
	   enabled.forEach(enabled => {
		commandFiles.filter(file => file.startsWith(toRemove))
	  })          
	}

	// Suggestion Module
	const dataSuggestion = db.collection('bots').doc(`${guildId}`).collection('modules').doc('suggestion');
	const suggestionDoc = await dataSuggestion.get();
	if(suggestionDoc.data().status === 'enabled') {
	  enabled.push('suggest', 'modifysuggestion')
	} else if(suggestionDoc.data().status === 'disabled') {
		const toRemove = [
		'suggest',
		'modifysuggestion'
		  ]
	   enabled.forEach(enabled => {
		commandFiles.filter(file => file.startsWith(toRemove))
	  })          
	}

	// Utility Module
	const dataUtility = db.collection('bots').doc(`${guildId}`).collection('modules').doc('utility');
	const utilityDoc = await dataUtility.get();
	if(utilityDoc.data().status === 'enabled') {
	  enabled.push('calculator', 'emojify', 'ping', 'say', 'userinfo', '8ball')
	} else if(utilityDoc.data().status === 'disabled') {
		const toRemove = [
		'calculator',
		'emojify',
		'ping',
		'say',
		'userinfo',
		'8ball'
		  ]
	   enabled.forEach(enabled => {
		commandFiles.filter(file => file.startsWith(toRemove))
	  })          
	}

enabled.forEach(enabled => {
	commandFiles.filter(file => file.startsWith(enabled))
})
	
console.log('Enabled commands', enabled)

for (const file of enabled) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully registered application commands.');
	} catch (error) {
		console.error(error);
	}
})();