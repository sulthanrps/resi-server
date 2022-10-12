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
  } else if (
    err.name === "Email is required" ||
    err.name === "Password is required"
  ) {
    code = 400;
    message = err.name;
  } else if (err.name === "Bad Request") {
    code = 400;
    message = err.name;
  } else if (err.name === "Invalid email/password") {
    code = 401;
    message = err.name;
  } else if (err.name === "Please login first") {
    code = 401;
    message = err.name;
  } else if (err.name === "Unauthorized") {
    code = 403;
    message = err.name;
  } else if (err.name === "Data not found") {
    code = 404;
    message = err.name;
  } else if (err.name === "Service Unavailable") {
    code = 503;
    message = err.name;
  }

  res.status(code).json({ message });
};

module.exports = errorHandler;
