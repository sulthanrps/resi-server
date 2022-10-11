const { createToken } = require("../helpers/jwt");
const { User } = require("../models");
const { compareHash } = require("../helpers/bcrypt");
const midtransClient = require('midtrans-client')

class Controller {
  static async register(req, res, next) {
    try {
      let {
        name,
        email,
        password,
        role,
        profileImg,
        address,
        phoneNumber,
        balance,
      } = req.body;
      balance = +balance;

      const newUser = await User.create({
        name,
        email,
        password,
        role,
        address,
        phoneNumber,
        balance,
        profileImg,
      });

      const payload = { id: newUser.id };
      const access_token = createToken(payload);

      res.status(201).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email) throw { name: "Email is required" };
      if (!password) throw { name: "Password is required" };

      const user = await User.findOne({ where: { email } });
      if (!user) throw { name: "Invalid email/password" };

      const comparedPass = compareHash(password, user.password);
      if (!comparedPass) throw { name: "Invalid email/password" };

      const payload = { id: user.id };
      const access_token = createToken(payload);

      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async user(req, res, next) {
    try {
      const { id } = req.user;
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
      if (!user) throw { name: "Data not found" };

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const { name, email, address, phoneNumber, profileImg } = req.body;
      const updated = await User.update(
        { name, email, address, phoneNumber, profileImg },
        { where: { id: req.user.id } }
      );
      if (!updated[0]) throw { name: "Bad request" };

      res.status(200).json({ messasge: "Profile updated" });
    } catch (error) {
      next(error);
    }
  }

  static async updateBalance(req, res, next) {
    try {
      let balance = +req.body.balance;
      const updateBalance = await User.update(
        { balance },
        { where: { id: req.params.id } }
      );

      if (!updateBalance[0]) throw { name: "Bad Request" };

      res.status(200).json({ message: "Balance updated" });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.user;
      await User.destroy({ where: { id } });
      res.status(200).json({ message: "Account deleted" });
    } catch (error) {
      next(error);
    }
  }

  static async topup (req, res, next) {
    try {
      const {nominal} = req.body
      const {email} = req.user

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY
      })

      let parameter = {
        transaction_details: {
          order_id: Date.now(),
          gross_amount: nominal,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email,
        },
      };
     
      const transaction = await snap.createTransaction(parameter);
      let redirect_url = transaction.redirect_url;
      console.log(redirect_url)

      res.status(200).json({redirect_url})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
