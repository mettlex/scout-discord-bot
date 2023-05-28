import "reflect-metadata";

import datasource from "../../../db/data_source";
import logger from "../../../logger";
import type { DataSource } from "typeorm";
import { User } from "../../../db/models/User.entity";

let ds: DataSource;

beforeAll(async () => {
  ds = await datasource.initialize();
  logger.info("Database connected");
});

afterAll(async () => {
  await ds?.destroy();
  logger.info("Database disconnected");
});

describe("User Entity", () => {
  test("User can be created and deleted properly", async () => {
    if (!ds) {
      throw "Unexpected";
    }

    const user = new User();
    user.discordId = "12345";

    await expect(ds.manager.save(user)).resolves.not.toThrow();

    const foundUser = await User.findOne({
      where: { discordId: user.discordId },
    });

    expect(foundUser?.discordId).toBeTruthy();

    if (!foundUser) {
      throw "Unexpected";
    }

    expect(foundUser.discordId).toBe(user.discordId);
    expect(foundUser.walletBalance).toBe(0);
    expect(foundUser.isEligible).toBe(false);

    await expect(foundUser.remove()).resolves.not.toThrow();
  });
});
