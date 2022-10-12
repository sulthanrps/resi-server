"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require("../data/users.json").users.map((el) => {
      delete el.address;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Users", data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users");
  },
};
