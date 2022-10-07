"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/schedule.json").schedules.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Schedules", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Schedules");
  },
};
