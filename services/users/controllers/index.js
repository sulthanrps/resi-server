const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const {compareHash} = require('../helpers/bcrypt')

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

  static async login (req, res, next) {
    try {
      const {email, password} = req.body
      if(!email) throw {name: "Email is required"}
      if(!password) throw {name: "Password is required"}

      const user = await User.findOne({where: {email}})
      if(!user) throw {name: "Invalid email/password"}

      const comparedPass = compareHash(password, user.password)
      if(!comparedPass) throw {name: "Invalid email/password"}

      const payload = {id: user.id}
      const access_token = createToken(payload)

      res.status(200).json({access_token})
    } catch (error) {
      next(error)
    }
  }

  static async user(req, res, next) {
    try {
      const {id} = req.user
      const user = await User.findByPk(id)
      if(!user) throw {name: "Data not found"}

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
