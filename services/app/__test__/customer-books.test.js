const req = require("supertest")(require("../app"));
const { signToken } = require("../helpers/jwt");
const { Book, Schedule, Bike } = require("../models");
const CUSTOMER_END_POINT = "/customers";

describe("================================ CUSTOMER BOOK TEST ================================", () => {
  const userId = 1;
  const token = signToken({ id: userId, role: "customer" });

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
      const res = await req.get(CUSTOMER_END_POINT).set("access_token", token);
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
      const res = await req.get(CUSTOMER_END_POINT);
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .get(CUSTOMER_END_POINT)
        .set("access_token", "wrong token");
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Create a book request", () => {
    const BookDate = "2022-10-13";
    const GrandTotal = 60_000;
    const BikeId = 2;
    const ScheduleId = 4;
    const location = {
      lon: 106.94879298422012,
      lat: -6.191868763798379,
    };

    test("Success request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, GrandTotal, BikeId, ScheduleId, location });
      expect(res.status).toBe(201);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Book date field is empty request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ GrandTotal, BikeId, ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Book date is empty");
    });

    test("Grand total field is empty request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, BikeId, ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Grand total is empty");
    });

    test("Bike category field is empty request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ GrandTotal, BookDate, ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Bike category is empty");
    });

    test("Schedule field is empty request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ GrandTotal, BookDate, BikeId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Schedule is empty");
    });

    test("Location field is empty request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ GrandTotal, BookDate, BikeId, ScheduleId });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Location is empty");
    });

    test("Book date field is empty string request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate: "", GrandTotal, BikeId, ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Book date is empty");
    });

    test("Grand total field is empty string request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, GrandTotal: "", BikeId, ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Grand total is empty");
    });

    test("Bike category field is empty string request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, GrandTotal, BikeId: "", ScheduleId, location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Bike category is empty");
    });

    test("Schedule field is empty string request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, GrandTotal, BikeId, ScheduleId: "", location });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Schedule is empty");
    });

    test("Location field is empty string request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", token)
        .send({ BookDate, GrandTotal, BikeId, ScheduleId, location: "" });
      expect(res.status).toBe(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message", "Location is empty");
    });

    test("Without access token request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .send({ BookDate, GrandTotal, BikeId, ScheduleId, location });
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .post(CUSTOMER_END_POINT)
        .set("access_token", "wrong token")
        .send({ BookDate, GrandTotal, BikeId, ScheduleId, location });
      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });
  });

  describe("Change status book", () => {
    const UserId = 1;
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
        BikeId,
        ScheduleId,
        location: JSON.stringify(location),
      });

      bookId = book.id;
    });

    test("Success request", async () => {
      const res = await req
        .patch(CUSTOMER_END_POINT + `/${bookId}`)
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
        .patch(CUSTOMER_END_POINT + `/${99999}`)
        .set("access_token", token)
        .send({ status: changeStatus });
      expect(res.status).toBe(404);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
    });

    test("Status field empty string request", async () => {
      const res = await req
        .patch(CUSTOMER_END_POINT + `/${bookId}`)
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
        .patch(CUSTOMER_END_POINT + `/${bookId}`)
        .send({ status: changeStatus });
      const { status } = await Book.findByPk(bookId);

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(status).toBe("pending");
    });

    test("With incorrect access token request", async () => {
      const res = await req
        .patch(CUSTOMER_END_POINT + `/${bookId}`)
        .set("access_token", "wrong token")
        .send({ status: changeStatus });
      const { status } = await Book.findByPk(bookId);

      expect(res.status).toBe(401);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body).toHaveProperty("message");
      expect(status).toBe("pending");
    });
  });
});
