const errorHandler = (err, req, res, next) => {
  console.log(err);
  code = 500;
  message = "Internal server error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    code = 400;
    message = err.errors[0].message;
  }

  res.status(code).json({ message });
};

module.exports = errorHandler;
