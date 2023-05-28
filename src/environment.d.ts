declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DISCORD_BOT_TOKEN?: string;
      DISCORD_CLIENT_ID?: string;
      DISCORD_GUILD_ID?: string;
      ADMIN_DISCORD_USER_IDS?: string;
      NODE_ENV?: "development" | "production";
    }
  }
}

export {};
