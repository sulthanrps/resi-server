const express = require("express");
const Controller = require("../controllers/bike");
const router = express.Router();

router.get("/", Controller.getBikes);

module.exports = router;
