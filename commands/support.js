const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('support')
		.setDescription('Used for server staff to get platform support'),
	async execute(interaction, embed, db) {

    // Slack
    const { WebClient } = require('@slack/web-api');
    // Read a token from the environment variables
    const Slacktoken = 'xoxb-3230248284195-3280467778368-jjMmdt31WnN2nrj7CaILXXe2'
    // Initialize
    const web = new WebClient(Slacktoken);
    const conversationId = 'C037PJVBAAE';
    const threatSlack = '1';
    // Basic Vars

    const { MessageActionRow, MessageButton } = require('discord.js');
    const username = interaction.member.user.username
    const userId = interaction.member.user.id
    let user = interaction.guild.members.cache.get(userId)
    const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
    const serverId = interaction.member.guild.id
    // Check For Permission
    const supportAuth = [
      "473903419497775114"
    ]
        if(supportAuth.some(support => interaction.member.user.id === support)) {
          const token = Math.floor(Math.random()*90000) + 10000;
        embed.setTitle("🙋 Arigo Platform Support")
        embed.setDescription("Hey there! I see you need assistance navigating Arigo Platform. Please email us at ``support@arigoapp.com`` for priortized support or call our enterprise-only phone line at ``+1 (424) 336-8685``.\n\nIf you choose to call us for support, your support token is ``" + token + "``. This token will expire in 10 minutes, and will be asked for when connecting to a representative.")
        interaction.reply({ embeds: [embed], ephemeral: true }).then(done => {
                    (async () => {

  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
  const result = await web.chat.postMessage({
  
	blocks: [
		{
			type: "section",
			text: {
				type: "mrkdwn",
				text: `*${interaction.user.username}* (${interaction.user.id}), has created a support token in ${interaction.guild.name} (${interaction.guildId}). Please do not accept this token if they provide it after 10 minutes of initiation.`
			}
		},
		{
			type: "section",
			fields: [
				{
					type: "mrkdwn",
					text: "*Token:*\n`" + token + "`"
				},
				{
					type: "mrkdwn",
					text: "*When:*\n" + new Date()
				}
			]
		}
	],
    channel: threatSlack,
  });

  console.log(`Successfully send message ${result.ts} in conversation ${threatSlack}`);
})();
        
        })
    // Send to Slack

    
    
     } else {
      // Doesn't Have Permission
    embed.setTitle("😞 Insufficient Permissions")
    embed.setDescription("You don't have permissions to run this command. Please contact the server owner if you believe this is a mistake.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
   embed.setColor("RED")
   interaction.reply({ embeds: [embed], ephemeral: true })

          }

  }
}