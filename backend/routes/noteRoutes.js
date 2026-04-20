const express = require("express");
const noteController = require("../controllers/note.controller");
const authorize = require("../middleware/authorization.middleware");

const router = express.Router();

// All note routes are protected
router.use(authorize);

router.get("/", noteController.getAllNotes);
router.post("/", noteController.createNote);
router.put("/:id", noteController.updateNote);
router.delete("/:id", noteController.deleteNote);

module.exports = router;
