const req = require("supertest")(require("../app"));
const { signToken } = require("../helpers/jwt");
const { Book, Schedule, Bike } = require("../models");
const WASHER_END_POINT = "/washers";

describe("================================ WASHER BOOK TEST ================================", () => {
  const userId = 2;
  const token = signToken({ id: userId, role: "washer" });

  beforeAll(async () => {
    const bikes = require("../data/bike.json").bikes.map((bike) => ({
      name: bike.name,
      price: bike.price,
    }));
    await Bike.bulkCreate(bikes);

    const { schedules } = require("../data/schedule.json");
    await Schedule.bulkCreate(schedules);

    const books = require("../data/books.json").books.map((book) => {
      book.location = JSON.stringify(book.location);
      return book;
    });
    await Book.bulkCreate(books);
  });

  afterAll(async () => {
    await Book.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Bike.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await Schedule.destroy({
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  });

  describe("Retrieve all books request", () => {
    test("Success request", async () => {
      const res = await req.get(WASHER_END_POINT).set("access_token", token);
      const expected = Array(
        expect.objectContaining({
          UserId: expect.any(Number),
          BookDate: expect.any(String), //bukan Date object ya
          GrandTotal: expect.any(Number),
          WasherId: expect.any(Number),
          BikeId: expect.any(Number),
          ScheduleId: expect.any(Number),
          status: expect.any(String),
          location: expect.any(String),
        })
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(expected));
    });

    test("Without access token request", async () => {
      const res = await req.get(WASHER_END_POINT);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .get(WASHER_END_POINT)
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Retrieve all pending books request", () => {
    test("Success request", async () => {
      const res = await req
        .get(WASHER_END_POINT + "/books")
        .set("access_token", token)
        .send({ lon: 106.94879298422012, lat: -6.191868763798379 });
      const expected = Array(
        expect.objectContaining({
          UserId: expect.any(Number),
          BookDate: expect.any(String), //bukan Date object ya
          GrandTotal: expect.any(Number),
          WasherId: null,
          BikeId: expect.any(Number),
          ScheduleId: expect.any(Number),
          status: expect.any(String),
          location: expect.any(String),
        })
      );
      expect(res.status).toBe(200);
      expect(res.body).toEqual(expect.arrayContaining(expected));
    });

    test("Without access token request", async () => {
      const res = await req.get(WASHER_END_POINT + "/books");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .get(WASHER_END_POINT + "/books")
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Washer pick a book request", () => {
    const BookDate = "2022-10-13";
    const GrandTotal = 60_000;
    const BikeId = 2;
    const ScheduleId = 4;
    const location = {
      lon: 106.94879298422012,
      lat: -6.191868763798379,
    };
    let bookId;
    beforeAll(async () => {
      const book = await Book.create({
        UserId: 10,
        BookDate,
        GrandTotal,
        BikeId,
        ScheduleId,
        location: JSON.stringify(location),
      });
      bookId = book.id;
    });

    test("Success request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}`)
        .set("access_token", token);
      const { WasherId } = await Book.findByPk(bookId);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(WasherId).toBe(userId);
    });

    test("With invalid book id request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${999999}`)
        .set("access_token", token);
      expect(res.status).toBe(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Without access token request", async () => {
      const res = await req.patch(WASHER_END_POINT + `/books/${bookId}`);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}`)
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Washer remove a picked book request", () => {
    const BookDate = "2022-10-13";
    const GrandTotal = 60_000;
    const BikeId = 2;
    const ScheduleId = 4;
    const location = {
      lon: 106.94879298422012,
      lat: -6.191868763798379,
    };
    let bookId;
    beforeAll(async () => {
      const book = await Book.create({
        UserId: 10,
        BookDate,
        GrandTotal,
        WasherId: userId,
        BikeId,
        ScheduleId,
        location: JSON.stringify(location),
      });
      bookId = book.id;
    });

    test("Success request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/remove`)
        .set("access_token", token);
      const { WasherId } = await Book.findByPk(bookId);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(WasherId).toBeNull();
    });

    test("With invalid book id request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${999999}/remove`)
        .set("access_token", token);
      expect(res.status).toBe(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Without access token request", async () => {
      const res = await req.patch(WASHER_END_POINT + `/books/${bookId}/remove`);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/remove`)
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Change status book", () => {
    const UserId = 10;
    const BookDate = "2022-10-13";
    const GrandTotal = 60_000;
    const BikeId = 2;
    const ScheduleId = 4;
    const location = {
      lon: 106.94879298422012,
      lat: -6.191868763798379,
    };
    const changeStatus = "taken";
    let bookId;

    beforeEach(async () => {
      const book = await Book.create({
        UserId,
        BookDate,
        GrandTotal,
        WasherId: userId,
        BikeId,
        ScheduleId,
        location: JSON.stringify(location),
      });

      bookId = book.id;
    });

    test("Success request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/status`)
        .set("access_token", token)
        .send({ status: changeStatus });

      const { status } = await Book.findByPk(bookId);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(status).toBe(changeStatus);
    });

    test("With unregistered book id", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${9999}/status`)
        .set("access_token", token)
        .send({ status: changeStatus });
      expect(res.status).toBe(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Status field empty string request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/status`)
        .set("access_token", token)
        .send({ status: "" });
      const { status } = await Book.findByPk(bookId);

      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(status).toBe("pending");
    });

    test("Without access token request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/status`)
        .send({ status: changeStatus });
      const { WasherId } = await Book.findByPk(bookId);

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(WasherId).toBe(userId);
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .patch(WASHER_END_POINT + `/books/${bookId}/status`)
        .set("access_token", "wrong token")
        .send({ status: changeStatus });
      const { WasherId } = await Book.findByPk(bookId);

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(WasherId).toBe(userId);
    });
  });
});
