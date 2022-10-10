const express = require("express");
const router = express.Router();
const customerRouter = require("./customer");
const washerRouter = require("./washer");
const { authentication } = require("../middleware/authentication");
const Controller = require("../controllers/customer"); //untuk keperluan test

router.post("/token", Controller.getTokenById);
router.use(authentication);
router.use("/customers", customerRouter);
router.use("/washers", washerRouter);

module.exports = router;
