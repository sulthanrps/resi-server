const bcrypt = require("bcryptjs");

function hash(value) {
  return bcrypt.hashSync(`${value}`, 10);
}

function compareHash(value, encryptedValue) {
  return bcrypt.compareSync(value, encryptedValue);
}
module.exports = { hash, compareHash };
