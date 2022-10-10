const { Bike } = require("../models");

module.exports = class Controller {
  static async getBikes(req, res, next) {
    try {
      let data = await Bike.findAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
};
