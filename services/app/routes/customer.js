const express = require("express");
const Controller = require("../controllers/customer");
const router = express.Router();

router.get("/", Controller.getBooksByIdAll);
router.get("/pending", Controller.getBooksByIdPending);
router.get("/:BookId", Controller.getBooksByBooksId);

router.post("/", Controller.createBook);
router.patch("/:BookId", Controller.patchStatusBook);

router.delete("/:BookId", Controller.deleteBook);
// router.post("/token", Controller.getTokenById);


module.exports = router;
