const { Book, Bike } = require("../models");

const type = require("../helpers/constant");
const { signToken } = require("../helpers/jwt");
const { Op } = require("sequelize");

module.exports = class Controller {
  static async getBooksByBooksId(req, res, next) {
    try {
      const { id: UserId } = req.user;
      const { BookId: id } = req.params;

      const books = await Book.findOne({
        include: { model: Bike },
        where: { UserId, id },
        order: [["updatedAt", "DESC"]],
      });
      console.log(type);
      if (books.length == 0) throw { name: type.notfound };

      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  static async getBooksByIdAll(req, res, next) {
    try {
      console.log("masuk");
      const { id: UserId } = req.user;
      let { status } = req.query;
      if (!status) status = "taken";

      const data = await Book.findAll({
        where: { [Op.and]: [{ UserId }, { status }] },
        order: [["updatedAt", "DESC"]],
        include: { model: Bike },
      });

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getBooksByIdPending(req, res, next) {
    try {
      const { id: UserId } = req.user;

      const data = await Book.findAll({
        where: { UserId, WasherId: null },
        order: [["updatedAt", "DESC"]],
        include: { model: Bike },
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    try {
      const { BookDate, GrandTotal, BikeId, ScheduleId, lon, lat } = req.body;
      const location = JSON.stringify({ lon, lat });
      const { id: UserId } = req.user;

      if (!BookDate) throw { name: "emptyBookDate" };
      if (!GrandTotal) throw { name: "emptyGrandTotal" };
      if (!BikeId) throw { name: "emptyBikeId" };
      if (!ScheduleId) throw { name: "emptyScheduleId" };
      if (!location) throw { name: "emptyLocation" };

      if (!BookDate) throw { name: "emptyBookDate" };
      if (!GrandTotal) throw { name: "emptyGrandTotal" };
      if (!BikeId) throw { name: "emptyBikeId" };
      if (!ScheduleId) throw { name: "emptyScheduleId" };
      if (!location) throw { name: "emptyLocation" };

      const book = await Book.create({
        UserId,
        BookDate,
        GrandTotal,
        BikeId,
        ScheduleId,

        location,
        status: "wait for washer",
      });

      res.status(201).json({
        id: book.id,
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchStatusBook(req, res, next) {
    try {
      const { BookId } = req.params;
      const { id: WasherId } = req.user;

      if (!status) throw { name: "emptyStatus" };

      if (!status) throw { name: "emptyStatus" };

      const book = await Book.findByPk(BookId);
      if (book.status == "paid") throw { name: type.statusPaid };

      if (!book) throw { name: "notFound" };

      await Book.update(
        { status: "paid" },
        { where: { [Op.and]: [{ id: BookId }, { WasherId }] } }
      );
      res.status(200).json({
        message: `Book ID: ${BookId} change status from ${book.status} to paid`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTokenById(req, res, next) {
    //untuk testing
    try {
      const { id } = req.body;
      res.status(200).json(signToken({ id, role: "customer" }));
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteBook(req, res, next) {
    //untuk testing
    try {
      const { BookId: id } = req.params;

      const book = await Book.destroy({
        where: { id },
      });
      if (book < 1) throw { name: type.notfound };
      res.status(201).json({
        message: `Book ID: ${id} deleted`,
      });
    } catch (error) {
      next(error);
    }
  }
};
