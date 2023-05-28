import "reflect-metadata";
import { Client, Events, GatewayIntentBits } from "discord.js";

import logger from "./logger";
import { botToken } from "./constants";
import commands from "./slash-commands";
import db from "./db";

db.connect();

logger.info(`${Array.from(commands.keys()).length} slash-commands loaded.`);

if (!botToken) {
  logger.error("Set DISCORD_BOT_TOKEN as an environment variable.");

  process.exit(1);
}

logger.info("Logging in...");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  logger.info(`${c.user.tag}: I'm ready!`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);

  if (!command) {
    logger.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    logger.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(botToken);
