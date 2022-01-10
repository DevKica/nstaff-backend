import config from "config";
import mongoose from "mongoose";
import app from "./server";

const PORT = config.get<number>("PORT");
const HOST = config.get<string>("HOST");
const DB_URL = config.get<string>("DB_URL");
const DEV_DB = config.get<string>("DEV_DB");

mongoose
    .connect(`${DB_URL}${DEV_DB}`)
    .then(() => {
        app.listen(PORT, HOST, async () => {
            console.log(`server is running on ${PORT}`);
        });
    })
    .catch((e) => {
        throw new Error(e);
    });
