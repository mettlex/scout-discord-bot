import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
  type: "better-sqlite3",
  database: "db.sqlite",
  entities: [`${__dirname}/**/*.entity.{js,ts}`],
  migrations: [`${__dirname}/migrations/*.{js,ts}`],
  synchronize: false, // use schema:sync command instead
};

const datasource = new DataSource(dataSourceOptions);

export default datasource;
