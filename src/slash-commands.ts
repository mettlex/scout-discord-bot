import fs from "node:fs";
import path from "node:path";
import {
  CacheType,
  Collection,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import logger from "./logger";

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction<CacheType>) => Promise<void>;
};

const commands = new Collection<string, Command>();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const isFolder = fs.lstatSync(path.join(foldersPath, folder)).isDirectory();

  const commandsPath = path.join(foldersPath, isFolder ? folder : "");

  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js") || file.endsWith(".ts"))
    .map((file) => file.replace(/\.(js|ts)$/i, ""));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath).default;

    if ("data" in command && "execute" in command) {
      commands.set(command.data.name, command);
    } else {
      logger.info(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

export default commands;
