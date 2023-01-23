const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { response } = require('express');
const { random } = require('mathjs');
const { createLogger, format, transports } = require('winston');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('qna')
		.setDescription('Ask questions and get incredible answers. Powered by OpenAI.')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question you have')
        .setRequired(true)),
  
	async execute(interaction, embed, db, events, Sentry) {
    try {
    interaction.deferReply()
    const userId = interaction.member.user.id
    const serverId = interaction.member.guild.id
    const question = interaction.options.getString('question')
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
      apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);
   
    const responseCapture = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      temperature: 0,
      max_tokens: 50,
    });
    const response = await responseCapture
    console.log("Question", {
      question: question,
      answer: response.data.choices[0].text,
      user: userId
    })
    if(response.status === 200) {
      // Log
      events.info('QNA', { user: `${userId}`, question: `${question}`, answer: `${response.data.choices[0].text}`, serverId: `${serverId}` });
      // Reply
      const finalResponse = response.data.choices[0].text.split('.');
      const length = finalResponse.length
      embed.setTitle("Here's what I found...")
      embed.addFields(
        { name: 'Question 🤔', value: `${question}`, inline: true },
        { name: 'Answer 🤩', value: `${finalResponse[length -2]}.`, inline: true },
    )
    // embed.setFooter({
    //   text: "Designed by Arigo | Powered by OpenAI | Answers not confirmed, verified, nor endorsed by Arigo Technologies, LLC",
    //   iconURL: "https://cdn.arigoapp.com/logo"
    //   }),
      embed.setColor("Green")
      interaction.editReply({ embeds: [embed] })
    } else {
      embed.setTitle("⚠️ Command Error")
      embed.setDescription("I was either unable to find an answer to your question or there was an internal server erorr. Please report this to Arigo Customer Support if the problem persists.")
      embed.setColor("Red")
      return interaction.editReply({ embeds: [embed], ephemeral: true })
    }
    
    
  } catch (e) {
    Sentry.captureException(e);
    console.error('Error in qua command', e)

  }
  }}  