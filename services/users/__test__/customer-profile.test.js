const req = require("supertest")(require("../app"));
const { User } = require("../models");
const PROFILE_END_POINT = "/user";
const LOGIN_END_POINT = "/login";

describe("================================ CUSTOMER PROFILE TEST ================================", () => {
  const registeredMail = "used@mail.com";
  const registeredPassword = "lelelele";
  const testMail = "unique@mail.com";

  let token;
  beforeAll(async () => {
    await User.create({
      name: "ASEP",
      email: registeredMail,
      password: registeredPassword,
      profileImg: "image URL",
      phoneNumber: "08112121212",
      role: "customer",
    });

    await User.create({
      name: "MANTEP",
      email: testMail,
      password: registeredPassword,
      profileImg: "image URL",
      phoneNumber: "088888888",
      role: "customer",
    });

    const {
      body: { access_token },
    } = await req
      .post(LOGIN_END_POINT)
      .send({ email: registeredMail, password: registeredPassword });
    token = access_token;
  });

  afterAll(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("Retrieving customer profile expected response", () => {
    test("Success request", async () => {
      const res = await req.get(PROFILE_END_POINT).set("access_token", token);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("name");
      expect(res.body).toHaveProperty("email");
      expect(res.body).toHaveProperty("phoneNumber");
      expect(res.body).toHaveProperty("profileImg");
      expect(res.body).toHaveProperty("role");
      expect(res.body).toHaveProperty("balance");
    });

    test("Without access token request", async () => {
      const res = await req.get(PROFILE_END_POINT);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .get(PROFILE_END_POINT)
        .set("access_token", "wrong_token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Update customer profile expected response", () => {
    //yang diupdate hanya name saja
    test("Success request", async () => {
      const updatedName = "MANTEP";
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ name: updatedName });

      const { name } = await User.findOne({ where: { email: registeredMail } });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(name).toBe(updatedName);
    });

    test("Empty name field request", async () => {
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ name: "" });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty email field request", async () => {
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ email: "" });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Empty phone number field request", async () => {
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ phoneNumber: "" });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test.skip("Empty profile image field request", async () => {
      //ini dibutuhkan tidak?
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ profileImg: "" });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Email is not unique update request", async () => {
      const res = await req
        .patch(PROFILE_END_POINT)
        .set("access_token", token)
        .send({ email: testMail });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Delete profile expected response", () => {
    const registeredMail = "deleted@mail.com";
    const registeredPassword = "deletedpassword";
    let token;
    beforeAll(async () => {
      await User.create({
        name: "deleted",
        email: registeredMail,
        password: registeredPassword,
        profileImg: "image URL",
        phoneNumber: "099999999",
        role: "customer",
      });

      const {
        body: { access_token },
      } = await req
        .post(LOGIN_END_POINT)
        .send({ email: registeredMail, password: registeredPassword });
      token = access_token;
    });

    test("Success request", async () => {
      const res = await req
        .delete(PROFILE_END_POINT)
        .set("access_token", token);
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Without access token request", async () => {
      const res = await req.delete(PROFILE_END_POINT);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .delete(PROFILE_END_POINT)
        .set("access_token", "wrong_token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });
});
