import dotenv from "dotenv";

dotenv.config();

export default {
    ORIGIN: "http://localhost:3000",
    HOST: "localhost",
    PORT: process.env.PORT || 4000,
    EMAIL_TOKEN_TTL: "7d",

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    DB_URL_PRODUCTION: process.env.DB_URL_PRODUCTION,
    // DB_URL: process.env.DB_URL,
    // DEV_DB: process.env.DEV_DB,
    // TEST_DB: process.env.TEST_DB,

    EMAIL_SECRET_TOKEN: process.env.EMAIL_SECRET_TOKEN,
    MAIN_SECRET_TOKEN: process.env.MAIN_SECRET_TOKEN,

    TEST_EMAIL: process.env.TEST_EMAIL,
    TEST_EMAIL_PASSWORD: process.env.TEST_EMAIL_PASSWORD,

    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL,
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL,

    MAX_AGE_TOKEN_COOKIE: process.env.MAX_AGE_TOKEN_COOKIE,
};
