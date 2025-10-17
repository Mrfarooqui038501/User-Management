import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";
const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:fkneuWmKEgOusRZMwToYNbCfzHjlSoeZ@turntable.proxy.rlwy.net:22279/railway";

export const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false 
    }
  },
  logging: false, 
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to Railway PostgreSQL successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1); 
  }
};
