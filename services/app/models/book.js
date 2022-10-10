"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init(
    {
      UserId: DataTypes.INTEGER,
      BookDate: DataTypes.DATE,
      GrandTotal: DataTypes.INTEGER,
      WasherId: DataTypes.INTEGER,
      BikeId: DataTypes.INTEGER,
      ScheduleId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      location: DataTypes.STRING,
    },
    {
      hooks: {
        beforeCreate: (instance) => {
          instance.status = "pending"; //pending atau waiting?
        },
      },
      sequelize,
      modelName: "Book",
    }
  );
  return Book;
};
