const { SlashCommandBuilder } = require('discord.js');
const { ButtonStyle, ActionRowBuilder, Client, Collection, Intents } = require('discord.js');module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Send something as the bot.')
      .addStringOption(option =>
		option.setName('question')
			.setDescription('The message you want to send on behalf of the bot')
			.setRequired(true)),
  
  	async execute(interaction, embed, db, events, Sentry) {
try {
        const userId = interaction.member.user.id
        const serverId = interaction.member.guild.id
        const text = interaction.options.getString('question')
      // Slack info
      const { WebClient } = require('@slack/web-api');
      // Read a token from the environment variables
      const Slacktoken = 'xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2'
      // Initialize
      const web = new WebClient(Slacktoken);
      const conversationId = 'C037PJVBAAE';
      const threatSlack = 'C038XJWBM3N';


    // Start The Command Function
    function doMagic8BallVoodoo() {
    // Get Response Options
    var rand = [
      "It is certain!",
      "It is decidedly so!",
      "Without a doubt!",
      "Definitely!",
      "I'm unsure!",
      "I think!",
      "Most Likely!",
      "Outlook good!",
      "Yes!",
      "Signs point to yes!",
      "Sadly no!"
    ];
        return rand[Math.floor(Math.random()*rand.length)];
    };
    const answer = doMagic8BallVoodoo()
    //  Send Reply
    embed.setTitle("8 Ball Says...")
    embed.addFields(
      { name: 'Question', value: `${text}`, inline: true },
      { name: 'Answer', value: `${answer}`, inline: true },

      )
      interaction.reply({ embeds: [embed] })   
      events.info('8ball', { user: `${userId}`, question: `${text}`, answer: `${answer}`, serverId: `${serverId}` });
 
      // Blacklisted Slack Logging
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
      "alt",
      "arigo"
    ]
    if(blacklisted.some(blacklist => text.toLowerCase().includes(blacklist))) {
    (async () => {

  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
  
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*${interaction.user.username}* (${interaction.user.id}), has utilized the ` + "`/say`" + ` command in ${interaction.guild.name} (${interaction.guildId}) with potential malicious intent.`
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*Question:*\n`" + text + "`"
				},
				{
					type: "mrkdwn",
					text: "*When:*\n" + new Date()
				},
				{
					type: "mrkdwn",
					text: "*Message URL:*\n" + `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${interaction.id}`
				},
				{
					type: "mrkdwn",
					text: "*Channel ID:*\n" + interaction.channelId
				}
			]
		}
	],
    channel: threatSlack,
  });

  console.log(`Successfully send message ${result.ts} in conversation ${threatSlack}`);
})();
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error('Error in ban command', e)
  }
}
}