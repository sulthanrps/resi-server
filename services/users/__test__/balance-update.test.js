const req = require("supertest")(require("../app"));
const { User } = require("../models");
const BALANCE_END_POINT = "/balance";
const MIDTRANS_END_POINT = "/topup";
const LOGIN_END_POINT = "/login";

describe("================================ BALANCE UPDATE TEST ================================", () => {
  const registeredMail = "used@mail.com";
  const registeredPassword = "lelelele";

  let token;
  beforeEach(async () => {
    await User.create({
      name: "ASEP",
      email: registeredMail,
      password: registeredPassword,
      profileImg: "image URL",
      phoneNumber: "08112121212",
      role: "customer",
    });

    const {
      body: { access_token },
    } = await req
      .post(LOGIN_END_POINT)
      .send({ email: registeredMail, password: registeredPassword });
    token = access_token;
  });

  afterEach(async () => {
    await User.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("Update database balance customer", () => {
    test("Success request", async () => {
      const VALUE = 10_000;
      const res = await req
        .patch(BALANCE_END_POINT)
        .set("access_token", token)
        .send({ balance: VALUE });

      const { balance } = await User.findOne({
        where: { email: registeredMail },
      });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(balance).toBe(VALUE);
    });

    test("Without access token request", async () => {
      const res = await req.patch(BALANCE_END_POINT).send({ balance: 10_000 });

      const { balance } = await User.findOne({
        where: { email: registeredMail },
      });

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(balance).toBe(0);
    });

    test("Without access token request", async () => {
      const res = await req
        .patch(BALANCE_END_POINT)
        .set("access_token", "wrong token")
        .send({ balance: 10_000 });

      const { balance } = await User.findOne({
        where: { email: registeredMail },
      });

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(balance).toBe(0);
    });
  });

  describe.skip("Top-up balance by midtrans customer", () => {
    test("Success request", async () => {
      const res = await req
        .patch(MIDTRANS_END_POINT)
        .set("access_token", token)
        .send({ balance: 10_000 });
      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Without access token request", async () => {
      const res = await req.patch(MIDTRANS_END_POINT).send({ balance: 10_000 });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Without access token request", async () => {
      const res = await req
        .patch(MIDTRANS_END_POINT)
        .set("access_token", "wrong token")
        .send({ balance: 10_000 });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });
});
