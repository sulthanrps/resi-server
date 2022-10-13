const express = require("express");
const router = express.Router();
const customerRouter = require("./customer");
const washerRouter = require("./washer");
const bikeRouter = require("./bike");
const { authentication } = require("../middleware/authentication");
<<<<<<< HEAD
const Controller = require("../controllers/customer");

router.post("/", Controller.getTokenById);
=======
>>>>>>> 63c98e2aa81a36239987c6fceb9cb3128abb3df9

router.use(authentication);
router.use("/bikes", bikeRouter);
router.use("/customers", customerRouter);
router.use("/washers", washerRouter);

module.exports = router;
