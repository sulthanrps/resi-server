const req = require("supertest")(require("../app"));
const { User } = require("../models");
const REGISTER_END_POINT = "/register";
const LOGIN_END_POINT = "/login";

describe("================================ CUSTOMER CREDENTIAL TEST ================================", () => {
  const registeredMail = "used@mail.com";
  const registeredPassword = "lelelele";
  const role = "customer";

  beforeAll(async () => {
    await User.create({
      name: "usedname",
      email: registeredMail,
      password: registeredPassword,
      profileImg: "used image URL",
      phoneNumber: "08112121212",
      role,
    });
  });

  afterAll(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("Register customer expected response", () => {
    const name = "asep";
    const email = "asep@mail.com";
    const password = "asepkasep";
    const profileImg =
      "https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg";
    const phoneNumber = "0811111111";

    test("Success request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password, profileImg, phoneNumber, role });
      expect(res.status).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("access_token", expect.any(String));
    });

    test("Empty name request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ email, password, profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty email request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, password, profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty password request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty profile picture request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty phone number request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password, profileImg, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty string name request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name: "", email, password, profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty string email request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email: "", password, profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty string password request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password: "", profileImg, phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty string profile picture request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password, profileImg: "", phoneNumber, role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty string phone number request", async () => {
      const res = await req
        .post(REGISTER_END_POINT)
        .send({ name, email, password, profileImg, phoneNumber: "", role });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Email is not unique request", async () => {
      const res = await req.post(REGISTER_END_POINT).send({
        name,
        email: registeredPassword,
        password: registeredPassword,
        profileImg,
        phoneNumber,
        role,
      });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Incorrect email format request", async () => {
      const res = await req.post(REGISTER_END_POINT).send({
        name,
        email: "incorrectmailcom",
        password,
        profileImg,
        phoneNumber,
        role,
      });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Login customer expected response", () => {
    test("Success request", async () => {
      const res = await req
        .post(LOGIN_END_POINT)
        .send({ email: registeredMail, password: registeredPassword });
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("access_token", expect.any(String));
    });

    test("Incorrect password request", async () => {
      const res = await req
        .post(LOGIN_END_POINT)
        .send({ email: registeredMail, password: "wrong password" });
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Unregistered email request", async () => {
      const res = await req.post(LOGIN_END_POINT).send({
        email: "unregisteredmail@mail.com",
        password: registeredPassword,
      });
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });
});
