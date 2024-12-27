const express = require('express');
const { route } = require('./chat');
const {registeruser, authUser} = require("../controllers/usercontrollers");
const router = express.Router();
router.route("/").post(registeruser);
router.post("/login",authUser);
module.exports = router;