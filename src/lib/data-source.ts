import "reflect-metadata";
import { DataSource } from "typeorm";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // Auto-create tables in development
    logging: process.env.NODE_ENV === "development",
    entities: [join(__dirname, "..", "entities", "**", "*.entity{.ts,.js}").replace(/\\/g, "/")],
    migrations: [],
    subscribers: [],
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

let isInitialized = false;

export const initializeDatabase = async () => {
    if (isInitialized) return AppDataSource;

    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized!");
            isInitialized = true;
        }
        return AppDataSource;
    } catch (err) {
        console.error("Error during Data Source initialization", err);
        throw err;
    }
};
