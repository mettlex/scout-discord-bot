import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { User } from "../../db/models/User.entity";
import logger from "../../logger";
import { currency } from "../../constants";
import db from "../../db";

export default {
  data: new SlashCommandBuilder()
    .setName("gift")
    .addUserOption((option) => {
      return option
        .setName("to_user")
        .setDescription("Choose the user whom you want to send the gift to")
        .setRequired(true);
    })
    .addNumberOption((option) => {
      return option
        .setName("amount")
        .setMinValue(1)
        .setDescription("Amount to gift.")
        .setRequired(true);
    })
    .setDescription("Gift a user"),

  async execute(interaction: ChatInputCommandInteraction) {
    const targetUser = interaction.options.getUser("to_user");
    const targetUserId = targetUser?.id;
    const amount = interaction.options.getNumber("amount");

    if (!targetUserId || !amount) {
      return;
    }

    if (targetUserId === interaction.user.id) {
      await interaction.reply("Sorry, you can't gift yourself for now.");
      return;
    }

    const queryRunner = db.repository.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction();

    let targetUserInDb: User | null = null;
    let gifterUserInDb: User | null = null;

    try {
      targetUserInDb = await queryRunner.manager.findOneBy(User, {
        discordId: targetUserId,
      });

      gifterUserInDb = await queryRunner.manager.findOneBy(User, {
        discordId: interaction.user.id,
      });

      if (!targetUserInDb) {
        logger.info(`Creating a new user ${targetUserId} in the database`);

        try {
          targetUserInDb = await queryRunner.manager.save(User, {
            discordId: targetUserId,
            isEligible: false,
            walletBalance: 0,
          });
        } catch (error) {
          logger.error(`Error creating the user ${targetUserId}`);
          logger.error(error);

          await interaction.reply(
            "A database error occured. Please ask the developer to check logs.",
          );

          return;
        }
      }

      if (!gifterUserInDb) {
        logger.info(
          `Creating a new user ${interaction.user.id} in the database`,
        );

        try {
          gifterUserInDb = await queryRunner.manager.save(User, {
            discordId: interaction.user.id,
            isEligible: false,
            walletBalance: 0,
          });
        } catch (error) {
          logger.error(`Error creating the user ${interaction.user.id}`);
          logger.error(error);

          await interaction.reply(
            "A database error occured. Please ask the developer to check logs.",
          );

          return;
        }
      }

      gifterUserInDb.walletBalance = gifterUserInDb.walletBalance - amount;
      targetUserInDb.walletBalance = targetUserInDb.walletBalance + amount;

      if (gifterUserInDb.walletBalance < 0) {
        await interaction.reply(
          `You can't gift higher than your current balance.`,
        );
      } else {
        gifterUserInDb = await queryRunner.manager.save(User, gifterUserInDb);
        targetUserInDb = await queryRunner.manager.save(User, targetUserInDb);
      }

      await queryRunner.commitTransaction();

      if (gifterUserInDb.walletBalance < 0) {
        return;
      }
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

    if (!targetUserInDb) {
      return;
    }

    let currencyName = currency.singular;

    if (targetUserInDb.walletBalance > 1) {
      currencyName = currency.plural;
    }

    await interaction.reply(
      `${interaction.user} gifted **${amount.toLocaleString(
        "en-IN",
      )}** ${currencyName} to ${targetUser}`,
    );
  },
};
