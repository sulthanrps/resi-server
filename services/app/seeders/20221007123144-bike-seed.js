"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/bike.json").bikes.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Bikes", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Bikes");
  },
};
