const express = require("express");
const router = express.Router();
const {register, getAllUsers} = require("../controllers/user.controller")
router.post("/register", register)
router.get("/allUsers",getAllUsers)

module.exports = router;