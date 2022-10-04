import "dotenv/config";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_DATABASE as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

process.env.NODE_ENV !== "test" && (async () => await sequelize.sync())();

export { sequelize };
