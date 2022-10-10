const { Book } = require("../models");
const { type } = require("../helpers/constant");
const { Op } = require("sequelize");

module.exports = class Controller {
  static async patchUpdateStatus(req, res, next) {
    try {
      const { BookId: id } = req.params;
      const { status } = req.body;
      const { id: WasherId } = req.user;

      const book = await Book.findOne({
        where: { [Op.and]: [{ id }, { WasherId }] },
      });

      if (!book) throw { name: type.washerWrongPatch };

      await Book.update({ status }, { where: { id } });

      res.status(200).json({
        message: `Book ID: ${BookId} change status from ${book.status} to ${status}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchRemoveBook(req, res, next) {
    try {
      const { BookId: id } = req.params;
      const { id: WasherId } = req.user;

      const book = await Book.findOne({
        where: { [Op.and]: [{ id }, { WasherId }] },
      });

      if (!book) throw { name: type.washerWrongPatch };

      await Book.update({ WasherId: null }, { where: { id } });

      res.status(200).json({
        message: `Book ID: ${id} removed`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchPickBook(req, res, next) {
    try {
      const { BookId: id } = req.params;
      const { id: WasherId } = req.user;

      const book = await Book.findByPk(BookId);

      if (!book) throw { name: type.washerWrongPatch };

      await Book.update({ WasherId }, { where: { id } });

      res.status(200).json({ message: `Book ID: ${id} added` });
    } catch (error) {
      next(error);
    }
  }

  static async getBooksById(req, res, next) {
    try {
      const { id: WasherId } = req.user;

      const books = await Book.findAll({
        order: [
          ["BookDate", "ASC"],
          ["ScheduleId", "ASC"],
        ],
        where: { WasherId },
      });

      res.status(200).json(books);
    } catch (error) {
      next(error);
    }
  }

  static async getBooksByIdPending(req, res, next) {
    //ini maksudnya apa?
    try {
      const { id: WasherId } = req.user;

      const dataBooksWasher = await Book.findAll({
        where: { WasherId },
      });

      const data = await Book.findAll({
        where: { WasherId: null },
      });

      const newData = data
        .map((el) => {
          const filtered = dataBooksWasher.filter((fil) => {
            if (
              el.BookDate.getDate() == fil.BookDate.getDate() &&
              el.ScheduleId == fil.ScheduleId
            )
              return true;
            else return false;
          });
          if (filtered.length == 0) return el;
        })
        .filter((fil) => fil != null);

      res.status(200).json(newData);
    } catch (error) {
      next(error);
    }
  }

  // static async getTokenById(req, res, next) {
  //   try {
  //     const { id } = req.body;
  //     res.status(200).json(createToken(id));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};
