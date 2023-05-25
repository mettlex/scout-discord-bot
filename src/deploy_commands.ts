import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { botToken, clientId, guildId } from "./constants";
import logger from "./logger";

if (process.env.NODE_ENV !== "production") {
  process.exit(0);
}

(async () => {
  try {
    if (!botToken || !clientId || !guildId) {
      return;
    }

    const commands = [];

    const foldersPath = path.join(__dirname, "commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const isFolder = fs
        .lstatSync(path.join(foldersPath, folder))
        .isDirectory();

      const commandsPath = path.join(foldersPath, isFolder ? folder : "");

      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = (await import(filePath)).default;

        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        } else {
          logger.info(
            `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
          );
        }
      }
    }

    const rest = new REST().setToken(botToken);

    logger.info(`Started refreshing ${commands.length} application commands.`);

    const data = (await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    )) as unknown[];

    if ("length" in data) {
      logger.info(`Successfully reloaded ${data.length} application commands.`);
    }
  } catch (error) {
    logger.error(error);
  }
})().catch((e) => {
  logger.error(e);
});
