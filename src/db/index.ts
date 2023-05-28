import { DataSource } from "typeorm";
import datasource from "./data_source";
import logger from "../logger";

export default class db {
  public static repository: DataSource;

  public static async connect() {
    if (this.repository) {
      return this.repository;
    }

    try {
      this.repository = await datasource.initialize();
      logger.info("Database Connected.");

      return this.repository;
    } catch (e) {
      logger.info("Unable to connect to database.");
      logger.error(e);
      process.exit(1);
    }
  }
}
