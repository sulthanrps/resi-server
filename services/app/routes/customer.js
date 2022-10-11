const express = require("express");
const Controller = require("../controllers/customer");
const router = express.Router();

router.get("/", Controller.getBooksByIdAll);
router.post("/", Controller.createBook);
router.patch("/:BookId", Controller.patchStatusBook);

module.exports = router;
