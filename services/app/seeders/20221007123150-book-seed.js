"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/books.json").books.map((el) => {
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Books", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Books");
  },
};
