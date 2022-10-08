const express = require("express");
const Controller = require("../controllers");
const router = express.Router();

router.post('/register', Controller.register)
router.post('/login', Controller.login)

module.exports = router;
