const type = require("../helpers/constant");

module.exports = function (err, req, res, next) {
  let data = {};
  switch (err.name) {
    case "SequelizeValidationError":
      data = { code: 400, message: err.errors[0].message };
      break;
    case type.washerPatch:
      data = { code: 401, message: "This book is already taken!" };
      break;
    case type.washerWrongPatch:
      data = {
        code: 401,
        message: "You have no authority to remove this book!",
      };
      break;
    case type.status:
      data = {
        code: 401,
        message: "You have no authority to change status of this book!",
      };
      break;
    case type.statusPaid:
      data = {
        code: 400,
        message: "This book is already paid!",
      };
      break;
    case type.invalidJwt:
      data = { code: 400, message: "Your token is no longer valid!" };
      break;
    case "emptyBookDate":
      data = { code: 400, message: "Book date is empty" };
      break;
    case "emptyGrandTotal":
      data = { code: 400, message: "Grand total is empty" };
      break;
    case "emptyBikeId":
      data = { code: 400, message: "Bike category is empty" };
      break;
    case "emptyScheduleId":
      data = { code: 400, message: "Schedule is empty" };
      break;
    case "emptyLocation":
      data = { code: 400, message: "Location is empty" };
      break;
    case "emptyStatus":
      data = { code: 400, message: "Status is empty" };
      break;
    case "notFound":
      data = { code: 404, message: "Book is not found" };
      break;
    case "JsonWebTokenError":
      data = { code: 401, message: "Your Token is invalid!" };
      break;
    case type.notfound:
      data = { code: 404, message: "Data Not Found!" };
      break;
    default:
      data = { code: 500, message: "INTERNAL SERVER ERROR" };
      break;
  }
  const { message, code } = data;
  res.status(data.code).json({ message });
};
