const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../../app");
const { User } = require("../../model/user");

const { DB_HOST } = process.env;

describe("test auth", () => {
  let server;
  beforeAll(() => (server = app.listen(3000)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(() => done());
    });
  });

  test("test register route", async () => {
    const registerData = {
      email: "Test12@ukr.net",
      password: "123123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(registerData);

    // check response
    // console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("Register successs");

    // check data in database
    const user = await User.findOne({ email: response.body.user.email });
    // console.log(user);
    expect("dfgfdgf").toByThruthy();
    expect(user.email).toBe(registerData.email);
  });
  test("test login route", async () => {
    const loginData = {
      email: "Petr@ukr.net",
      password: "123123",
    };

    const response = await request(app).post("/api/auth/login").send(loginData);

    // check response
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successs");

    // check data in database
    const user = await User.findOne(response.body.email);
    expect(user).toBeTruthy();
    // email field test
    expect(typeof response.body.user.email).toBe("string");
    // subscription field test
    expect(typeof response.body.user.subscription).toBe("string");
  });
});
