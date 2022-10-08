const type = require("../helpers/constant");

modulex.exports = function (err, _, res, _) {
  let status, response;
  switch (err.name) {
    case type.washerPatch:
      (status = 401), (response = { message: "This book is already taken!" });
      break;
    case type.washerWrongPatch:
      (code = 401),
        (response = { message: "You have no authority to remove this book!" });
      break;
    case type.invalidJwt:
      (code = 401), (response = { message: "Your token is no longer valid!" });
      break;
    case "JsonWebTokenError":
      (code = 401), (response = { message: "Your Token is invalid!" });
      break;
    default:
      (code = 500), (response = { message: "INTERNAL SERVER ERROR" });
      break;
  }
  res.status(status).json(data);
};
