/* eslint-disable no-console */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const {
  Client, Collection, Events, GatewayIntentBits,
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    // GatewayIntentBits.GuildMessages,
    // GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();

// const commandsPath = path.join(__dirname, 'commands');
const foldersPath = path.join(__dirname, 'commands');

// const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const commandFolders = fs.readdirSync(foldersPath);

console.log('commandFolders', commandFolders);

// eslint-disable-next-line no-restricted-syntax
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
  // eslint-disable-next-line no-restricted-syntax
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log('command', command);
    // Set a new item in the Collection with the key as the command name
    // and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }
}
client.on(Events.ClientReady, (c) => {
  console.log(`[ClientReady] Logged in as ${c.user.tag}!`);
});

client.on(Events.Error, (e) => {
  console.log('[Error]', e);
});

client.on(Events.MessageCreate, (c) => {
  console.log(`[MessageCreate] Logged in as ${c.user.tag}!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  // if (!interaction.isChatInputCommand()) return;
//   console.log('InteractionCreate interaction', interaction);

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

console.log('heyyy');
client.login(process.env.CLIENT_TOKEN);
