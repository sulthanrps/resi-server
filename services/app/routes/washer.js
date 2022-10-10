const express = require("express");
const Controller = require("../controllers/washer");
const router = express.Router();

router.get("/", Controller.getBooksById);
router.get("/books", Controller.getBooksByIdPending);
router.patch("/books/:id", Controller.patchPickBook);
router.patch("/books/:id/remove", Controller.patchRemoveBook);
router.patch("/books/:id/status", Controller.patchUpdateStatus);

module.exports = router;
