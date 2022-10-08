const { createToken } = require("../helpers/jwt");
const { User } = require("../models");

class Controller {
  static async register(req, res, next) {
    try {
      let { name, email, password, role, address, phoneNumber, balance } =
        req.body;
        balance = +balance
      
        const newUser = await User.create({
        name,
        email,
        password,
        role,
        address,
        phoneNumber,
        balance,
      });
      
      const payload = {id: newUser.id}
      const access_token = createToken(payload)

      res.status(201).json({access_token})
    } catch (error) {
      next(error);
    }
  }

  static login (req, res, next) {
    console.log('ini login')
  }
}

module.exports = Controller;
