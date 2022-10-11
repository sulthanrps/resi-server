const { Book } = require("../models");

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
        location: JSON.stringify(location),
      });

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

      if (!status) throw { name: "emptyStatus" };

      const book = await Book.findByPk(BookId);

      if (!book) throw { name: "notFound" };

      await Book.update({ status }, { where: { id: BookId } });
      res.status(200).json({
        message: `Book ID: ${BookId} change status from ${book.status} to ${status}`,
      });
    } catch (error) {
      next(error);
    }
  }
};
