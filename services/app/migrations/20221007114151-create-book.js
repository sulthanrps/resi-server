"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Books", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      BookDate: {
        type: Sequelize.DATE,
      },
      GrandTotal: {
        type: Sequelize.INTEGER,
      },
      WasherId: {
        type: Sequelize.INTEGER,
      },
      BikeId: {
        type: Sequelize.INTEGER,
        references: { model: "Bikes" },
      },
      ScheduleId: {
        type: Sequelize.INTEGER,
        references: { model: "Schedules" },
      },
      status: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Books");
  },
};
