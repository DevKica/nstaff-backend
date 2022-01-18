import config from "config";
import mongoose from "mongoose";
import app from "./server";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 4000;
const DB_URL = config.get<string>("DB_URL");

mongoose
    .connect(DB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("running");
        });
    })
    .catch((e) => {
        console.log("error", e);
    });
