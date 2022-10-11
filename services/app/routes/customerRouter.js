const express = require("express");
const Controller = require("../controllers/customerController");
const router = express.Router();

router.get("/", Controller.getBooksByIdAll);
router.post("/token", Controller.getTokenById);

module.exports = router;
