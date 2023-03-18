async function deploy(clientId, guildId, token) {
  // const clientId = process.env["clientId"]
  // const guildId = process.env["guildId"]
  // const clientId = '952310761869410455'
  // const guildId = '864016187107966996'
  // const token = 'OTUyMzEwNzYxODY5NDEwNDU1.GxTOp_.Wlbpsux_Kzl7yZ7_0K1e6J7hK7ysch7gzyz9dI'
  const axios = require("axios");
  const { Firestore } = require("@google-cloud/firestore");
  const db = new Firestore({
    projectId: "arigo-platform",
    keyFilename: "key.json",
  });

  const fs = require("fs");
  const {
    REST,
    SlashCommandBuilder,
    Routes,
    WebhookClient,
  } = require("discord.js");

  let moderation = "ERROR - Stuck at Var";
  let suggestion = "ERROR - Stuck at Var";
  let utility = "ERROR - Stuck at Var";
  const betaServers = [
    '864016187107966996', // Arigo Community
    '1059232854028062830', // Examply
    '970446611874467930', // Kavio (Kosma)
    '1035249668210298901' // Kestia (Landon)
  ]
  const commands = [];
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
  var enabled = ["help"];

  // Moderation Module
  const data = db
    .collection("bots")
    .doc(`${guildId}`)
    .collection("modules")
    .doc("moderation");
  const doc = await data.get();
  if (doc.data().status === "enabled") {
    enabled.push(
      "unban",
      "ban",
      "case",
      "kick",
      "slowmode",
      "timeout",
      "warn",
      "purge"
    );
  } else if (doc.data().status === "disabled") {
    const toRemove = [
      "ban",
      "case",
      "kick",
      "slowmode",
      "timeout",
      "warn",
      "unban",
      "purge",
    ];
    enabled.forEach((enabled) => {
      commandFiles.filter((file) => file.startsWith(toRemove));
    });
  }

  // Suggestion Module
  const dataSuggestion = db
    .collection("bots")
    .doc(`${guildId}`)
    .collection("modules")
    .doc("suggestion");
  const suggestionDoc = await dataSuggestion.get();
  if (suggestionDoc.data().status === "enabled") {
    enabled.push("suggest", "modifysuggestion");
  } else if (suggestionDoc.data().status === "disabled") {
    const toRemove = ["suggest", "modifysuggestion"];
    enabled.forEach((enabled) => {
      commandFiles.filter((file) => file.startsWith(toRemove));
    });
  }

  // Utility Module
  const dataUtility = db
    .collection("bots")
    .doc(`${guildId}`)
    .collection("modules")
    .doc("utility");
  const utilityDoc = await dataUtility.get();
  if (utilityDoc.data().status === "enabled") {
    if(betaServers.includes(guildId)) {
      enabled.push("suggestedreply")
    }
    enabled.push(
      "serverinfo",
      "calculator",
      "emojify",
      "ping",
      "say",
      "userinfo",
      "8ball",
    );
  } else if (utilityDoc.data().status === "disabled") {

    const toRemove = [
      "calculator",
      "serverinfo",
      "emojify",
      "ping",
      "say",
      "userinfo",
      "8ball",
      "suggestedreply",
    ];
    if(betaServers.includes(guildId)) {
      toRemove.push("suggestedreply")
    }
    enabled.forEach((enabled) => {
      commandFiles.filter((file) => file.startsWith(toRemove));
    });
  }

  enabled.forEach((enabled) => {
    commandFiles.filter((file) => file.startsWith(enabled));
  });

  for (const file of enabled) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
  }

  // Delete Commands
  const rest = new REST({ version: "9" }).setToken(token);
  // rest.put(Routes.applicationCommands(clientId), { body: [] })
  // 	.then((d) => console.log('Successfully deleted all guild commands.', d))
  // 	.catch(console.error);
  // 	return
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }

  const webhookInfo = {
    id: "1058385208623251488",
    token:
      "ZjYqjMcdwETGJmfXJMkt1OR3FqujFJAn-_Ik3bOeQn6ceEhC9-EWqWJkdG50lZTH2Q4Z",
  };
  const webhook = new WebhookClient(webhookInfo);
  webhook
    .send(
      "Client ``" +
        clientId +
        "`` located in Guild ``" +
        guildId +
        "`` has been successfully restarted."
    )
    .then((message) => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
}

// // get cli args
// const args = process.argv.slice(2);
// const clientId = args[0];
// const guildId = args[1];
// const token = args[2];

// // run the function
// deploy(clientId, guildId, token);

module.exports = deploy;
