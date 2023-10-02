import { DataSource, } from "typeorm"
import dotenv from "dotenv"
dotenv.config()


export const dataBase = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["src/entity/*.ts"],
    synchronize: true
})

//Babasarkar@12