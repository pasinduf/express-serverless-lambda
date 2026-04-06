"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL,
    synchronize: true, // Auto-create tables in development
    logging: process.env.NODE_ENV === "development",
    entities: [(0, path_1.join)(__dirname, "..", "entities", "**", "*.entity{.ts,.js}").replace(/\\/g, "/")],
    migrations: [],
    subscribers: [],
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
let isInitialized = false;
const initializeDatabase = async () => {
    if (isInitialized)
        return exports.AppDataSource;
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log("Data Source has been initialized!");
            isInitialized = true;
        }
        return exports.AppDataSource;
    }
    catch (err) {
        console.error("Error during Data Source initialization", err);
        throw err;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=data-source.js.map