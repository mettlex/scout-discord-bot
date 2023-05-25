import { RepliableInteraction } from "discord.js";
import { CacheType, SlashCommandBuilder } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your wallet balance."),
  async execute(interaction: RepliableInteraction<CacheType>) {
    await interaction.reply("Coming soon!");
  },
};
