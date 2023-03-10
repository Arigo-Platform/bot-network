const { consoleSandbox } = require('@sentry/utils');
const { SlashCommandBuilder } = require('discord.js');
const { Client, Collection, Intents } = require('discord.js');
const { response } = require('express');
const { random } = require('mathjs');
const { createLogger, format, transports } = require('winston');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('suggestedreply')
		.setDescription('Get a simple template for replying to a support ticket'),
	async execute(interaction, embed, db, events, Sentry) {
    try {
    interaction.deferReply({ ephemeral: true })
    const { Configuration, OpenAIApi } = require("openai");
    const configuration = new Configuration({
        apiKey: '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'
    });
    const openai = new OpenAIApi(configuration);
    const channel = interaction.channel
    let msgsArray = []
    var ticketOpener
    const msgs = await channel.messages.fetch({  cache: true, force: true })
    const lastMessage = await channel.messages.fetch({ limit: 1 })
    const firstMessage = await channel.messages.fetch({ limit: 1, after: 0 })
    ticketOpener = firstMessage.first().content.split(',')[0].replaceAll("<", "").replaceAll("@", "").replaceAll(">", "")
    await msgs.map((msg) => { 

        var msgContent = msg.content
        if(msg.author.bot) {
            try {
            if(msg.embeds[0].data.title.endsWith('said:')) {
            msgsArray.push({ 
                role: 'user',
                content: msg.embeds[0].data.description.replaceAll('`', '')
                })
            }
        } catch {
                //
            }
        }
        if((msg.content === '') || (msg.author.bot === true)) return; 
        if(msg.id === lastMessage.first().id) {
            msgContent = `${msgContent}`
        }
        if(msg.author.id === ticketOpener) {
            msgsArray.push({ 
                role: 'user',
                content: msgContent
            })
        } else {
            msgsArray.push({ 
                role: 'system',
                content: msgContent
            })
        }

    })

    // msgsArray.push({ role: 'system', content: 'Known Question: Where can I find a list of all the products?\nKnown Answer: A list of all products can be found in <#864016187602763826>' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How much is the overhead system?\nKnown Answer: The overhead system costs 799 Robux' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How much does the overhead system cost in USD?\nKnown Answer: The overhead system costs $5.99 USD' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How do I appeal?\nKnown Answer: You can email moderation@arigoapp.com to file an appeal.' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How long do appeals take to process?\nKnown Answer: Arigo has a dedicated Trust & Safety team to manage appeals. Appeals are processed within 7-14 business days.' })
    // msgsArray.push({ role: 'system', content: 'Known Question: What products does Caffable currently have?\nKnown Answer: We currently sell an Advanced Drink Creation System for 1299 Robux or $9.99 USD and an Advanced Overhead System for 799 Robux or $5.99 USD' })
    // msgsArray.push({ role: 'system', content: 'Known Question: Arigo Cost\nKnown Answer: Arigo costs $6/mo' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How do I get a discount on Arigo?\nKnown Answer: Arigo offers a partnership program that offers 5% off monthly.' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How do I apply for an HR position?\nKnown Answer: Arigo does not recruit HRs, though we are actively hiring MRs.' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How do I apply for an MR position?\nKnown Answer: Visit our Roblox Application Center at https://roblox.com/yes to apply and be auto-ranked.' })
    // msgsArray.push({ role: 'system', content: 'Known Question: How do you get the Image ID for the Overhead GUI System?\nKnown Answer: The Image ID is the number found within your decal link.' })
    await db.collection("bots").doc(`${interaction.guild.id}`).collection('support-ai-faqs').get().then((querySnapshot) => {
        querySnapshot.forEach(async(doc) => {
           await msgsArray.push({ role: 'system', content: `Known Question: ${doc.data().question}?\nKnown Answer: ${doc.data().answer}` })
        });
    });
    msgsArray.push({ role: 'system', content: 'You are an AI programmed to help a human support agent with answering customer questions. Below are a few known questions with the correct known answers that users may ask, ONLY base your replies off of the data below or previous conversation history within the provided messages, if you are not sure, state "Im not sure" and nothing else. Do not answer questions that were already answered by system, simply provide a BRIEF SUGGESTED REPLY. Do not include unncessary information' })
    msgsArray = msgsArray.map(item => item).reverse();
    const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: msgsArray,
    max_tokens: 100,
    temperature: 0
    });
    // embed.setTitle("💬 Suggested Reply")
    embed.setDescription("```" + completion.data.choices[0].message.content + "```")
    embed.setFooter({
        text: "This functionality is in beta; please report any issues to support@arigoapp.com via email",
        iconURL: interaction.client.user.displayAvatarURL()
        }),
    // embed.setDescription("```" + finalResponse[finalResponse.length -2] + ".```")
    interaction.editReply({ embeds: [embed], ephemeral: true })

  } catch (e) {
    // Sentry.captureException(e);
    console.error('Error in suggestedreply command', e)

  }
  }}  