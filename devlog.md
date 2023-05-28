## Dev Log

### 1. How I created the first migration file:

- Created [src/db/data_source.ts](src/db/data_source.ts) file with the following code:

```ts
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "better-sqlite3",
  database: "db.sqlite",
  entities: ["dist/db/**/*.entity.js"],
  migrations: ["dist/db/migrations/*.js"],
  synchronize: false,
};

const datasource = new DataSource(dataSourceOptions);

export default datasource;
```

- Created [src/db/models/User.entity.ts](src/db/models/User.entity.ts) file with the following code:

```ts
import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity("users")
export class User extends BaseEntity {
  @PrimaryColumn({ nullable: false })
  discordId: string;

  @Column({ nullable: false, default: false })
  isEligible: boolean;

  @Column({ nullable: false, type: "double", default: 0 })
  walletBalance: number;
}
```

- Added the following the lines to the scripts property of [package.json](package.json):

```json
"typeorm": "npm run build && npx typeorm -d dist/db/data_source.js",
"migrate": "npm run typeorm -- migration:run",
"migration:generate": "npm run typeorm -- migration:generate",
"migration:run": "npm run typeorm -- migration:run",
"migration:revert": "npm run typeorm -- migration:revert"
```

- Ran the following command and the output is shown:

```
❯ npm run migration:generate -- src/db/migrations/CreateUserMigration
```

Output:

```
> scout-discord-bot@0.0.1 migration:generate
> npm run typeorm -- migration:generate src/db/migrations/CreateUserMigration


> scout-discord-bot@0.0.1 typeorm
> npm run build && npx typeorm -d dist/db/data_source.js migration:generate src/db/migrations/CreateUserMigration


> scout-discord-bot@0.0.1 build
> rm -rf dist/ && npm run lint && tsc && cp .env dist/


> scout-discord-bot@0.0.1 lint
> eslint .

Migration ~/scout-discord-bot/src/db/migrations/1685288040852-CreateUserMigration.ts has been generated successfully.
```

### 2. First migration run for the database:

```
❯ npm run migrate
```

Output:

```
> scout-discord-bot@0.0.1 migrate
> npm run typeorm -- migration:run


> scout-discord-bot@0.0.1 typeorm
> npm run build && npx typeorm -d dist/db/data_source.js migration:run


> scout-discord-bot@0.0.1 build
> rm -rf dist/ && npm run lint && tsc && cp .env dist/


> scout-discord-bot@0.0.1 lint
> eslint .

query: SELECT * FROM "sqlite_master" WHERE "type" = 'table' AND "name" = 'migrations'
query: CREATE TABLE "migrations" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "timestamp" bigint NOT NULL, "name" varchar NOT NULL)
query: SELECT * FROM "migrations" "migrations" ORDER BY "id" DESC
0 migrations are already loaded in the database.
1 migrations were found in the source code.
1 migrations are new migrations must be executed.
query: PRAGMA foreign_keys = OFF
query: BEGIN TRANSACTION
query: CREATE TABLE "users" ("discordId" varchar PRIMARY KEY NOT NULL, "isEligible" boolean NOT NULL DEFAULT (0), "walletBalance" double NOT NULL DEFAULT (0))
query: INSERT INTO "migrations"("timestamp", "name") VALUES (1685288040852, ?) -- PARAMETERS: ["CreateUserMigration1685288040852"]
Migration CreateUserMigration1685288040852 has been  executed successfully.
query: COMMIT
query: PRAGMA foreign_keys = ON
```