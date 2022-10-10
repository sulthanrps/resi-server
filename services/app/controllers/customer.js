const { Book } = require("../models");
const { type } = require("../helpers/constant");
const { signToken } = require("../helpers/jwt");

module.exports = class Controller {
  static async getBooksByIdAll(req, res, next) {
    try {
      const { id: UserId } = req.user;

      const data = await Book.findAll({
        where: { UserId },
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getBooksByIdPending(req, res, next) {
    try {
      const { id: UserId } = req.user;

      const data = await Book.findAll({
        where: { UserId, WasherId: null },
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async createBook(req, res, next) {
    try {
      const { BookDate, GrandTotal, BikeId, ScheduleId, location } = req.body;
      const { id: UserId } = req.user;

      const book = await Book.create({
        UserId,
        BookDate, //bookdate ini bentuknya beruapa apa
        GrandTotal,
        BikeId,
        ScheduleId,
        location, //beruapa apa bentuknya?
      }); //belum validasi

      res.status(201).json({
        message: `Book ID: ${book.id} created`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchStatusBook(req, res, next) {
    try {
      const { BookId } = req.params;
      const { status } = req.body;

      const book = await Book.findByPk(BookId);

      if (!book) throw { name: type.washerWrongPatch };

      await Book.update({ status }, { where: { id: BookId } });
      res.status(200).json({
        message: `Book ID: ${BookId} change status from ${book.status} to ${status}`,
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
};
