const type = require("../helpers/constant");
const { verifyToken } = require("../helpers/jwt");

module.exports = {
  async authentication(req, _, next) {
    try {
      const { id } = verifyToken(req.headers.access_token);

      req.user = { id };

      next();
    } catch (error) {
      next(error);
    }
  },
};
