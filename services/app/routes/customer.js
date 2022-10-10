const express = require("express");
const Controller = require("../controllers/customer");
const router = express.Router();

router.get("/", Controller.getBooksByIdAll);
router.post("/", Controller.createBook);
router.put("/:BookId", Controller.patchStatusBook);
// router.post("/token", Controller.getTokenById);

module.exports = router;
