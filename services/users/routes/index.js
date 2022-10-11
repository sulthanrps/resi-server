const express = require("express");
const Controller = require("../controllers");
const router = express.Router();
const authentication = require('../middlewares/authentication')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.patch('/balance/:id', Controller.updateBalance)
router.post('/topup', Controller.topUpBalance)

router.use(authentication)

router.get('/user', Controller.user)
router.delete('/user', Controller.delete)
router.patch('/user', Controller.updateProfile)
router.post('/midtrans', Controller.topup)

module.exports = router;
