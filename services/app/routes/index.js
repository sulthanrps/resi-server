const express = require("express");
const router = express.Router();
const customerRouter = require("./customer");
const washerRouter = require("./washer");
const bikeRouter = require("./bike");
const { authentication } = require("../middleware/authentication");
const Controller = require("../controllers/customer");

router.post("/", Controller.getTokenById);

router.use(authentication);
router.use("/bikes", bikeRouter);
router.use("/customers", customerRouter);
router.use("/washers", washerRouter);

module.exports = router;
