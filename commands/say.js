   const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Send something as the bot.')
      .addStringOption(option =>
		option.setName('text')
			.setDescription('The message you want to send on behalf of the bot')
			.setRequired(true)),
  
  	async execute(interaction, embed, db) {
  const serverId = interaction.member.guild.id
  const cityRef = db.collection('bots').doc(`${serverId}`).collection('settings').doc('modId');
const doc = await cityRef.get();
 if(interaction.member.roles.cache.has(doc.data().id) === true) {
  let channel = interaction.guild.channels.cache.get(interaction.channelId)
    const text = interaction.options.getString('text')
    const username = interaction.member.user.username
    const userId = interaction.member.user.id
    console.log(`${username} (${userId}) said: ${text}`)
  channel.send({ content: text })
    interaction.reply({ content: "Success!" })
    interaction.deleteReply()

} else if(interaction.member.roles.cache.has(doc.data().id) === false){
    embed.setTitle("😞 Insufficient Permissions")
    embed.setDescription("You don't have permissions to run this command. This command requires the <@&" + doc.data().id + "> role to get permission.\n\nIf you believe this is incorrect or you have the correct role, please contact your Server Administrator.")
   embed.setColor("Red")
   return interaction.reply({ embeds: [embed], ephemeral: true})
}

}}