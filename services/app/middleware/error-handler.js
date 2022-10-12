const type = require("../helpers/constant");

module.exports = function (err, _, res, _) {
  let data = {};
  switch (err.name) {
    case type.washerPatch:
      data = { code: 401, message: "This book is already taken!" };
      break;
    case type.washerWrongPatch:
      data = {
        code: 401,
        message: "You have no authority to remove this book!",
      };
      break;
    case type.invalidJwt:
      data = { code: 401, message: "Your token is no longer valid!" };
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
  res.status(code).json({ message });
};
