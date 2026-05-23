process.env.DISCORD_TOKEN = 'MTUwNTk0Mjk1MDM1MjM5MjI0Mg.GXmndA.CSE-b9-ePlGid6ILGmVBST_GINJixEQKB6rw1U';

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');

const TOKEN              = process.env.DISCORD_TOKEN;
const WELCOME_CHANNEL_ID = '1505691279747448893';

const processing = new Set();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`✅ Connecté → ${client.user.tag}`);
  client.user.setActivity('👋 Bienvenue !', { type: ActivityType.Watching });
});

client.on('guildMemberAdd', async (member) => {
  if (processing.has(member.id)) return;
  processing.add(member.id);
  setTimeout(() => processing.delete(member.id), 5000);

  const user      = member.user;
  const avatarURL = user.displayAvatarURL({ dynamic: true, size: 512 });
  const joinedAt  = Math.floor(Date.now() / 1000);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setAuthor({ name: `${user.username} vient d'arriver !`, iconURL: avatarURL })
    .setTitle(`👋 Bienvenue sur ${member.guild.name} !`)
    .setDescription(
      `Salut ${member} ! Heureux de t'accueillir 🎉\n\n` +
      `> 📜 Pense à lire les règles\n` +
      `> 💬 Présente-toi dans le bon salon\n` +
      `> 🎉 Amuse-toi bien !`
    )
    .setThumbnail(avatarURL)
    .setImage(avatarURL)
    .addFields(
      { name: '👤 Membre',      value: `${member}`,                                         inline: true },
      { name: '🪪 ID',          value: `\`${member.id}\``,                                  inline: true },
      { name: '👥 Membre n°',   value: `**${member.guild.memberCount}**`,                   inline: true },
      { name: '📅 Arrivée',     value: `<t:${joinedAt}:R>`,                                inline: true },
      { name: '📆 Compte créé', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
    )
    .setFooter({
      text: `${member.guild.name} • ${member.guild.memberCount} membres`,
      iconURL: member.guild.iconURL({ dynamic: true }) ?? undefined,
    })
    .setTimestamp();

  try {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
    if (channel) {
      await channel.send({ content: `${member}`, embeds: [embed] });
    } else {
      console.warn(`❌ Salon introuvable : ${WELCOME_CHANNEL_ID}`);
    }
  } catch (err) {
    console.error('Erreur :', err.message);
  }
});

client.login(TOKEN);
