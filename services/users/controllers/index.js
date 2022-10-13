const { createToken } = require("../helpers/jwt");
const { User, sequelize } = require("../models");
const { compareHash } = require("../helpers/bcrypt");
const midtransClient = require("midtrans-client");

const axios = require("axios");

class Controller {
  static async register(req, res, next) {
    try {
      let { name, email, password, role, profileImg, phoneNumber } = req.body;
      const balance = 0;

      const newUser = await User.create({
        name,
        email,
        password,
        role,
        phoneNumber,
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
      const { name, email, phoneNumber, profileImg } = req.body;
      const updated = await User.update(
        { name, email, phoneNumber, profileImg },
        { where: { id: req.user.id } }
      );
      if (!updated[0]) throw { name: "Bad request" };

      res.status(200).json({ message: "Profile updated" });
    } catch (error) {
      next(error);
    }
  }

  static async updateBalance(req, res, next) {
    const t = await sequelize.transaction();
    try {
      const { access_token } = req.query;
      const bookId = req.params.id;
      let balance;

      const book = await axios({
        url: `https://service-app-resi.herokuapp.com/customers/${bookId}`,
        method: "GET",
        headers: { access_token },
      });
      if (!book.data) throw { name: "Data not found" };

      const customer = await User.findByPk(book.data.UserId);
      if (!customer) throw { name: "Data not found" };

      balance = customer.balance - book.data.GrandTotal;
      if (balance < 0) throw { name: "Unsufficient balance" };

      const balanceCustomer = await User.update(
        { balance },
        { where: { id: book.data.UserId } },
        { transaction: t }
      );
      if (!balanceCustomer[0]) throw { name: "Bad Request" };

      balance = 0;

      const washer = await User.findByPk(book.data.WasherId);
      if (!washer) throw { name: "Data not found" };

      balance = washer.balance + book.data.GrandTotal;

      const balanceWasher = await User.update(
        { balance },
        { where: { id: book.data.WasherId } },
        { transaction: t }
      );
      if (!balanceWasher[0]) throw { name: "Bad Request" };

      await axios({
        method: "PATCH",
        url: `https://service-app-resi.herokuapp.com/customers/${bookId}`,
        headers: { access_token },
      });

      await t.commit();
      res.status(200).json({ message: "Payment complete" });
    } catch (error) {
      await t.rollback();
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

  static async topup(req, res, next) {
    try {
      const { nominal } = req.body;
      const { email, id } = req.user;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: `${id}-${Date.now()}`,
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

      res.status(200).json({ redirect_url });
    } catch (error) {
      next(error);
    }
  }

  static async topUpBalance(req, res, next) {
    try {
      let { order_id, transaction_status, gross_amount } = req.body;
      const id = order_id.split("-");
      const user = await User.findByPk(id[0]);

      if (!user) throw { name: "Data not found" };
      if (transaction_status !== "capture")
        throw { name: "Service Unavailable" };

      let balance = user.balance + +gross_amount;
      await User.update({ balance }, { where: { id: id[0] } });
      res.status(200).json({ message: "Top Up successfull" });
    } catch (error) {
      next(error);
    }
  }

  static async findUser(req, res, next) {
    try {
      const {id} = req. params
      const user = await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      })
      if(!user) throw {name: "Data not found"}

      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = Controller;
