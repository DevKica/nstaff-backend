import cors from "cors";
import config from "config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import router from "./routes/main_router";
import limitter from "express-rate-limit";
import fileUpload from "express-fileupload";
import deserializeUser from "./middlewares/deserializeUser";
import { emailToLowerCase } from "./middlewares/emailToLowerCase";
import { tooManyRequestHandler } from "./utils/randomUtils";

const ORIGIN = config.get<string>("ORIGIN");

const app = express();

app.use(
    cors({
        origin: ORIGIN,
        credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());

app.use(limitter({ windowMs: 5000, max: 50, handler: tooManyRequestHandler }));

app.use(fileUpload());

app.use(deserializeUser);

app.use(emailToLowerCase);

app.get("/", (_: Request, res: Response) => res.send("Hi"));

app.use("/app", router);

export default app;
