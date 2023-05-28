import "dotenv/config";

export const botToken = process.env.DISCORD_BOT_TOKEN;
export const clientId = process.env.DISCORD_CLIENT_ID;
export const guildId = process.env.DISCORD_GUILD_ID;
export const adminIds = process.env.ADMIN_DISCORD_USER_IDS?.split(",").map(
  (id) => id.trim(),
);

export const currency = {
  singular: "token",
  plural: "tokens",
  ticker: "T",
};
