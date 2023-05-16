/* eslint-disable max-len */
/* eslint-disable no-console */
const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { DiscogsClient } = require('@lionralfs/discogs-client/commonjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a song to the db')
    .addStringOption(
      (option) => option.setName('input')
        .setDescription('The song title and artist name'),
    ),

  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    const input = interaction.options.getString('input');
    console.log('input', input);

    const db = new DiscogsClient({
      auth: { userToken: process.env.DISCOGS_TOKEN },
    }).database();

    db.search({
      query: input,
      // type: 'release'
    }).then(
      ({ data }) => {
        console.log(data);

        if (data.results.length) {
          const attachment = new AttachmentBuilder(data.results[0].cover_image, {

          });

          const thumb = new EmbedBuilder()
            .setTitle(data.results[0].title);

          return interaction.reply({
            embeds: [thumb],
            files: [attachment],
          });
        }

        return interaction.reply('not found');
      },
    ).catch(
      (e) => interaction.reply(`Error: ${e}`),
    );
  },
};
