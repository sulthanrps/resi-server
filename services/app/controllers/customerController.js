const { verifyToken, createToken } = require("../helpers/jwt");
const { Book } = require("../models");
module.exports = class Controller {
  static async getBooksByIdAll(req, res, next) {
    try {
      const { access_token } = req.headers;
      const customerId = verifyToken(access_token);
      const data = await Book.findAll({
        where: { UserId: customerId },
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  static async getBooksByIdPending(req, res, next) {
    try {
      const { access_token } = req.headers;
      const customerId = verifyToken(access_token);
      const data = await Book.findAll({
        where: { UserId: customerId, WasherId: null },
      });
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json(error);
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
