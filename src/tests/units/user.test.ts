// import { expect } from "chai";
// import request from "supertest";
// import app from "./../../server";
// import dbConnect from "./../../utils/dbConnect";
// import config from "config";
// import { createUser } from "../../services/user/user.service";
// import { activeUser } from "../data/user.data";

// const TEST_DB = config.get<string>("TEST_DB");

// describe("test", () => {
//     before(async () => {
//         await dbConnect(TEST_DB);
//         const activeUserObject = await createUser({
//             ...activeUser,
//             active: true,
//         });
//     });
//     describe("USER", () => {
//         it("should return true", async () => {
//             const res = await request(app).get("/app/user/profile/privateInfo");
//             //active users??/
//             console.log(res.body);
//             expect(true).to.be.eql(true);
//         });
//     });
// });
