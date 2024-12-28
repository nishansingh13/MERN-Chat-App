const express = require('express');
const {protect} = require("../middleware/authmiddle");
const { route } = require('./chat');
const {registeruser, authUser , allUsers} = require("../controllers/usercontrollers");
const router = express.Router();
router.route("/").post(registeruser).get(protect,allUsers);
router.post("/login",authUser);

module.exports = router;