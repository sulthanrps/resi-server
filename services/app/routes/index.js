const express = require("express");
const router = express.Router();
const customerRouter = require("./customerRouter");
const washerRouter = require("./washerRouter");

router.use("/customer", customerRouter);
router.use("/washer", washerRouter);

module.exports = router;
