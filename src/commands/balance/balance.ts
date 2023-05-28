import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../../db/models/User.entity";
import logger from "../../logger";
import { currency } from "../../constants";

export default {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your wallet balance."),

  async execute(interaction: ChatInputCommandInteraction) {
    const discordId = interaction.user.id;

    let user = await User.findOne({
      where: {
        discordId,
      },
    });

    if (!user) {
      logger.info(`Creating a new user ${discordId} in the database`);

      try {
        user = await User.save({
          discordId,
          isEligible: false,
          walletBalance: 0,
        });
      } catch (error) {
        logger.error(`Error creating the user ${discordId}`);
        logger.error(error);

        await interaction.reply(
          "A database error occured. Please ask the developer to check logs.",
        );

        return;
      }
    }

    if (!user) {
      return;
    }

    let currencyName = currency.singular;

    if (Math.abs(user.walletBalance) > 1) {
      currencyName = currency.plural;
    }

    await interaction.reply(
      `${
        interaction.user
      }'s wallet balance: \`${user.walletBalance.toLocaleString(
        "en-IN",
      )}\` ${currencyName}.`,
    );
  },
};
