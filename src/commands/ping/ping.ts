import { RepliableInteraction } from "discord.js";
import { CacheType, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction: RepliableInteraction<CacheType>) {
    await interaction.reply("Pong!");
  },
};
