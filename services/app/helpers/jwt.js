const jwt = require("jsonwebtoken");
const KEY = process.env.JWT_SECRET;

module.exports = {
  signToken(payload) {
    return jwt.sign(payload, KEY);
  },

  verifyToken(token) {
    return jwt.verify(token, KEY);
  },
};
