const type = require("../helpers/constant");
const { verifyToken } = require("../helpers/jwt");

module.exports = {
  async authentication(req, _, next) {
    try {
      const { id, role } = verifyToken(req.headers.access_token);

      req.user = { id, role };

      next();
    } catch (error) {
      next(error);
    }
  },
};
