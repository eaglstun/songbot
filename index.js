require('dotenv').config(); // initialize dotenv
const { Client, Events, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    // GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

client.on(Events.ClientReady, (c) => {
  console.log(`[ClientReady] Logged in as ${c.user.tag}!`);
});

client.on(Events.Error, (c) => {
  console.log(`[Error] Logged in as ${c.user.tag}!`);
});

client.login(process.env.CLIENT_TOKEN);
