const express = require("express");
const authController = require("../controllers/auth.controller");
const authorize = require("../middleware/authorization.middleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/me", authorize, authController.getMe);

module.exports = router;
