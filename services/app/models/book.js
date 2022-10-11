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
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is empty" },
          notEmpty: { msg: "User is empty" },
        },
      },
      BookDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Book date is empty" },
          notEmpty: { msg: "Book date is empty" },
        },
      },
      GrandTotal: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Grand total is empty" },
          notEmpty: { msg: "Grand total is empty" },
        },
      },
      WasherId: DataTypes.INTEGER,
      BikeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Bike category is empty" },
          notEmpty: { msg: "Bike category is empty" },
        },
      },
      ScheduleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Schedule is empty" },
          notEmpty: { msg: "Schedule is empty" },
        },
      },
      status: DataTypes.STRING,
      location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Location is empty" },
          notEmpty: { msg: "Location is empty" },
        },
      },
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
