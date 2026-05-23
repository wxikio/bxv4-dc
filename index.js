// 🔐 Token du bot
const TOKEN = 'MTUwNTk0Mjk1MDM1MjM5MjI0Mg.G3uv1u.Oy32Vn3aAS4d8hTrMr3kSU5nCGkcdgi9yWXnnY';

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActivityType,
} = require('discord.js');

// 📢 ID salon bienvenue
const WELCOME_CHANNEL_ID = '1505691279747448893';

// Anti double trigger
const processing = new Set();

// Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

// Bot prêt
client.once('ready', () => {
  console.log(`✅ Connecté → ${client.user.tag}`);

  client.user.setActivity('👋 Bienvenue !', {
    type: ActivityType.Watching,
  });
});

// Event join serveur
client.on('guildMemberAdd', async (member) => {
  if (processing.has(member.id)) return;
  processing.add(member.id);

  setTimeout(() => processing.delete(member.id), 5000);

  const user = member.user;
  const avatarURL = user.displayAvatarURL({ size: 512 });
  const joinedAt = Math.floor(Date.now() / 1000);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setAuthor({
      name: `${user.username} vient d'arriver !`,
      iconURL: avatarURL,
    })
    .setTitle(`👋 Bienvenue sur ${member.guild.name} !`)
    .setDescription(
      `Salut ${member} 👋\n\n` +
      `📜 Lis les règles\n` +
      `💬 Présente-toi\n` +
      `🎉 Amuse-toi bien !`
    )
    .setThumbnail(avatarURL)
    .setImage(avatarURL)
    .addFields(
      { name: '👤 Membre', value: `${member}`, inline: true },
      { name: '🪪 ID', value: `\`${member.id}\``, inline: true },
      { name: '👥 Total', value: `**${member.guild.memberCount}**`, inline: true },
      { name: '📅 Arrivée', value: `<t:${joinedAt}:R>`, inline: true },
      { name: '📆 Compte créé', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:D>`, inline: true },
    )
    .setFooter({
      text: `${member.guild.name}`,
      iconURL: member.guild.iconURL() ?? undefined,
    })
    .setTimestamp();

  try {
    const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);

    if (!channel) {
      console.warn("❌ Salon bienvenue introuvable");
      return;
    }

    await channel.send({
      content: `${member}`,
      embeds: [embed],
    });

  } catch (err) {
    console.error("❌ Erreur envoi message :", err);
  }
});

// Logs erreurs
process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

// Login bot
client.login(TOKEN);
