const req = require("supertest")(require("../app"));
const { signToken } = require("../helpers/jwt");
const { Bike } = require("../models");
const BIKES_END_POINT = "/bikes";

describe("================================ BIKES TEST ================================", () => {
  const token = signToken({ id: 1, role: "customer" });

  beforeAll(async () => {
    const bikes = require("../data/bike.json").bikes.map((bike) => ({
      name: bike.name,
      price: bike.price,
    }));
    await Bike.bulkCreate(bikes);
  });

  afterAll(async () => {
    await Bike.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("Retrieve all bike categories", () => {
    test("Success request", async () => {
      const res = await req.get(BIKES_END_POINT).set("access_token", token);
      const expected = Array(
        expect.objectContaining({
          name: expect.any(String),
          price: expect.any(Number),
        })
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(expected));
    });

    test("Without access token request", async () => {
      const res = await req.get(BIKES_END_POINT);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .get(BIKES_END_POINT)
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });
});
