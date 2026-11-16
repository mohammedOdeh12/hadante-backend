import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

// قراءة المتغيرات من ملف .env
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "123456",
    database: process.env.DB_DATABASE || "hadante_db",
    synchronize: true, // لإنشاء الجداول تلقائياً
    logging: false,
    entities: ["src/entities/**/*.ts"],
});