const express = require('express');
const { route } = require('./chat');
const {registeruser} = require("../controllers/usercontrollers");
const router = express.Router();
router.route("/").post(registeruser);
module.exports = router;