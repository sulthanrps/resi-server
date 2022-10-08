const jwt = require("jsonwebtoken");

const keys = process.env.JWT_TOKEN;

function createToken(value) {
  return jwt.sign(value, keys);
}

function verifyToken(token) {
  return jwt.verify(token, keys);
}
module.exports = { createToken, verifyToken };
