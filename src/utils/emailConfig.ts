import config from "config";
import nodemailer from "nodemailer";
import { customEmailTokenFormat, signJWT } from "./jwtConfig";

const TEST_EMAIL = config.get<string>("TEST_EMAIL");
const TEST_EMAIL_PASSWORD = config.get<string>("TEST_EMAIL_PASSWORD");
const EMAIL_SECRET_TOKEN = config.get<string>("EMAIL_SECRET_TOKEN");
const EMAIL_TOKEN_TTL = config.get<string>("EMAIL_TOKEN_TTL");
const ORIGIN = config.get<string>("ORIGIN");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
        user: TEST_EMAIL,
        pass: TEST_EMAIL_PASSWORD,
    },
    secure: true,
});

const emailData = (token: string, client_email: string, type: string) => {
    let message = "Click here to confirm your email address";
    if (type === "resetPassword") {
        message = "Click here to reset your password";
    }
    return {
        from: TEST_EMAIL,
        to: client_email,
        subject: "server",
        html: `Hello,${message}
        <a href="${ORIGIN}/special/${type}/${token}"><button>click here</button></a>`,
    };
};

const sendEmailHandler = (tokenData: customEmailTokenFormat, client_email: string, type: string) => {
    const token = signJWT(tokenData, EMAIL_SECRET_TOKEN, EMAIL_TOKEN_TTL);
    transporter.sendMail(emailData(token, client_email, type));
};

export default sendEmailHandler;
