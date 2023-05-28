import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtAndUpdatedAtToUserMigration1685300212355 implements MigrationInterface {
    name = 'AddCreatedAtAndUpdatedAtToUserMigration1685300212355'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("discordId" varchar PRIMARY KEY NOT NULL, "isEligible" boolean NOT NULL DEFAULT (0), "walletBalance" double NOT NULL DEFAULT (0), "createdAt" datetime DEFAULT (datetime('now')), "updatedAt" datetime DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("discordId", "isEligible", "walletBalance") SELECT "discordId", "isEligible", "walletBalance" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("discordId" varchar PRIMARY KEY NOT NULL, "isEligible" boolean NOT NULL DEFAULT (0), "walletBalance" double NOT NULL DEFAULT (0))`);
        await queryRunner.query(`INSERT INTO "users"("discordId", "isEligible", "walletBalance") SELECT "discordId", "isEligible", "walletBalance" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
