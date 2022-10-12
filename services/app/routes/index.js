const express = require("express");
const router = express.Router();
const customerRouter = require("./customer");
const washerRouter = require("./washer");
const bikeRouter = require("./bike");
const Controller = require("../controllers/customer");

const { authentication } = require("../middleware/authentication");

router.post("/token", Controller.getTokenById);
router.use(authentication);
router.use("/bikes", bikeRouter);
router.use("/customers", customerRouter);
router.use("/washers", washerRouter);

module.exports = router;
