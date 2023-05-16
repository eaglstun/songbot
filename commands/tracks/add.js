/* eslint-disable max-len */
/* eslint-disable no-console */
const {
  ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder,
} = require('discord.js');
// const { DiscogsClient } = require('@lionralfs/discogs-client/commonjs');
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

    const { tracks } = await client.search(input, { types: ['track', 'album'] });
    console.log('tracks', tracks[0]);

    const display = `${tracks[0].artists[0].name} - ${tracks[0].name}`;
    console.log('display', display);

    const embed = new EmbedBuilder()
      // .setFooter({
      //   text: 'this is the footer',
      // })
      // .setImage('https://i.imgur.com/AfFp7pu.png')
      .setThumbnail(tracks[0].album.images[0].url)
      // .setTimestamp()
      .setTitle(display)
      .setURL(tracks[0].externalURL.spotify);
      // .setAuthor({
      //   name: 'Some name',
      //   iconURL: 'https://i.imgur.com/AfFp7pu.png',
      //   url: 'https://discord.js.org',
      // })
      // .setDescription('Some description here')
      // .addFields(
      //   {
      //     name: 'Regular field title 1',
      //     value: tracks[0].externalURL.spotify,
      //   },
      // );

    const confirm = new ButtonBuilder()
      .setCustomId('confirm')
      .setLabel('Add track')
      .setStyle(ButtonStyle.Primary);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    const action = new ActionRowBuilder()
      .addComponents(cancel, confirm);

    const response = await interaction.reply(
      {
        content: tracks[0].externalURL.spotify,
        components: [action],
        // embeds: [embed],
      },
    );

    console.log('response', response);

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
