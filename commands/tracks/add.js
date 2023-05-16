/* eslint-disable max-len */
/* eslint-disable no-console */
const { AttachmentBuilder, EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { DiscogsClient } = require('@lionralfs/discogs-client/commonjs');
const Spotify = require('spotify-api.js');

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

    const client = new Spotify.Client({
      token: {
        clientID: process.env.SPOTIFY_ID,
        clientSecret: process.env.SPOTIFY_SECRET,
      },
    });
    // console.log('client', client);

    const { tracks } = await client.search(input, { types: ['track', 'album'] });
    console.log('tracks', tracks[0].album.images);

    const embed = new EmbedBuilder()
      .setTitle(`${tracks[0].artists[0].name} - ${tracks[0].name}`);

    const thumb = new AttachmentBuilder(tracks[0].album.images[0].url, {
      name: 'album.jpg',
    });

    return interaction.reply({
      embeds: [embed],
      files: [thumb],
    });

    // const db = new DiscogsClient({
    //   auth: { userToken: process.env.DISCOGS_TOKEN },
    // }).database();

    // db.search({
    //   query: input,
    //   // type: 'release'
    // }).then(
    //   ({ data }) => {
    //     console.log(data);

    //     if (data.results.length) {

    //     }

    //     return interaction.reply('not found');
    //   },
    // ).catch(
    //   (e) => interaction.reply(`Error: ${e}`),
    // );
  },
};
