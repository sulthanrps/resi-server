const { verifyToken, createToken } = require("../helpers/jwt");
const { Op } = require("sequelize");
const { Book } = require("../models");
const { type } = require("../helpers/constant");

module.exports = class Controller {
  static async patchUpdateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const { access_token } = req.headers;
      if (!access_token) throw { name: type.invalidJwt };
      const washerId = verifyToken(access_token);
      console.log(washerId);
      const checkData = await Book.findOne({
        where: { [Op.and]: [{ id }, { WasherId: washerId }] },
      });
      if (!checkData) throw { name: type.washerWrongPatch };
      const data = await Book.update({ status }, { where: { id } });
      res.status(200).json({
        checkData,
        message: "Book's status has been changed!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchRemoveBook(req, res, next) {
    try {
      const { id } = req.params;
      const { access_token } = req.headers;
      if (!access_token) throw { name: type.invalidJwt };
      const washerId = verifyToken(access_token);
      const checkData = await Book.findOne({
        where: { [Op.and]: [{ id }, { WasherId: washerId }] },
      });
      if (!checkData) throw { name: type.washerWrongPatch };
      const data = await Book.update({ WasherId: null }, { where: { id } });
      res.status(200).json({
        checkData,
        message: "Book has been removed from your book list!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async patchPickBook(req, res, next) {
    try {
      const { id } = req.params;
      const { access_token } = req.headers;
      if (!access_token) throw { name: type.invalidJwt };
      const washerId = verifyToken(access_token);
      const checkData = await Book.findOne({
        where: { [Op.and]: [{ id }, { WasherId: null }] },
      });
      if (!checkData) throw { name: type.washerPatch };
      const data = await Book.update({ WasherId: washerId }, { where: { id } });
      res
        .status(200)
        .json({ checkData, message: "Book has been added to your book list!" });
    } catch (error) {
      next(error);
    }
  }

  static async getBooksById(req, res, next) {
    try {
      const { access_token } = req.headers;
      if (!access_token) throw { name: type.invalidJwt };
      const washerId = verifyToken(access_token);
      const data = await Book.findAll({
        order: [
          ["BookDate", "ASC"],
          ["ScheduleId", "ASC"],
        ],
        where: { WasherId: washerId },
      });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async getBooksByIdPending(req, res, next) {
    try {
      const { access_token } = req.headers;
      if (!access_token) throw { name: type.invalidJwt };
      const washerId = verifyToken(access_token);
      const dataBooksWasher = await Book.findAll({
        where: { WasherId: washerId },
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
      console.log(error);
      next(error);
    }
  }

  static async getTokenById(req, res, next) {
    try {
      const { id } = req.body;
      res.status(200).json(createToken(id));
    } catch (error) {
      console.log(error);
    }
  }
};
