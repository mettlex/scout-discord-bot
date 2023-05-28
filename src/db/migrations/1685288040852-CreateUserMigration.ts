import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserMigration1685288040852 implements MigrationInterface {
  name = "CreateUserMigration1685288040852";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("discordId" varchar PRIMARY KEY NOT NULL, "isEligible" boolean NOT NULL DEFAULT (0), "walletBalance" double NOT NULL DEFAULT (0))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
