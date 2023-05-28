import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../../db/models/User.entity";
import logger from "../../logger";
import { adminIds, currency } from "../../constants";
import db from "../../db";

export default {
  data: new SlashCommandBuilder()
    .setName("update_balance")
    .addUserOption((option) => {
      return option
        .setName("user")
        .setDescription("Choose the user whose balance you wanna update")
        .setRequired(true);
    })
    .addNumberOption((option) => {
      return option
        .setName("amount")
        .setDescription("Amount to add or deduct. Use minus sign (-) to deduct")
        .setRequired(true);
    })
    .setDescription("[Admin Only] Add or deduct wallet balance for a user"),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser("user");
    const discordId = targetUser?.id;
    const amount = interaction.options.getNumber("amount");

    if (!discordId || !amount) {
      return;
    }

    if (!adminIds?.includes(interaction.user.id)) {
      await interaction.reply("This is an admin only command.");
      return;
    }

    const queryRunner = db.repository.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    let user: User | null = null;

    try {
      user = await queryRunner.manager.findOneBy(User, { discordId });

      if (!user) {
        logger.info(`Creating a new user ${discordId} in the database`);

        try {
          user = await queryRunner.manager.save(User, {
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

      user.walletBalance = user.walletBalance + amount;

      user = await queryRunner.manager.save(User, user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
      logger.error(e);
      await interaction.reply(
        "A database error occured. Please ask the developer to check logs.",
      );

      return;
    } finally {
      await queryRunner.release();
    }

    if (!user) {
      return;
    }

    let currencyName = currency.singular;

    if (user.walletBalance > 1) {
      currencyName = currency.plural;
    }

    await interaction.reply(
      `Updated ${targetUser}'s wallet balance: \`${user.walletBalance.toLocaleString(
        "en-IN",
      )}\` ${currencyName}.`,
    );
  },
};
