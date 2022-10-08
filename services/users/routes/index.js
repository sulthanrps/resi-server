const express = require("express");
const Controller = require("../controllers");
const router = express.Router();
const authentication = require('../middlewares/authentication')

router.post('/register', Controller.register)
router.post('/login', Controller.login)

router.use(authentication)

router.get('/user', Controller.user)
router.patch('/user', Controller.updateProfile)

module.exports = router;
