const { type } = require("../helpers/constant");

function errorHandler(err, req, res, next) {
  let data = {};
  // console.log(err.type, "<<<<<ERRORTYPE");
  switch (err.name) {
    case type.washerPatch:
      data = {
        code: 401,
        response: { message: "This book is already taken!" },
      };
      break;
    case type.washerWrongPatch:
      data = {
        code: 401,
        response: { message: "You have no authority to remove this book!" },
      };
      break;
    case type.invalidJwt:
      data = {
        code: 401,
        response: { message: "Your token is no longer valid!" },
      };
      break;
    case "JsonWebTokenError":
      data = {
        code: 401,
        response: { message: "Your Token is invalid!" },
      };
      break;
    default:
      data = {
        code: 500,
        response: { message: "INTERNAL SERVER ERROR" },
      };
      break;
  }
  res.status(data.code).json(data.response);
}

module.exports = errorHandler;
