const express = require("express");
const Controller = require("../controllers/washerController");
const router = express.Router();

router.get("/", Controller.getBooksById);
router.get("/books", Controller.getBooksByIdPending);
router.patch("/books/:id", Controller.patchPickBook);
router.patch("/books/:id/remove", Controller.patchRemoveBook);
router.patch("/books/:id/status", Controller.patchUpdateStatus);

router.post("/token", Controller.getTokenById);

module.exports = router;
