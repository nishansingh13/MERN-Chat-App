const express = require('express');
const {protect} = require("../middleware/authmiddle");
const { route } = require('./chat');
const {registeruser, authUser , allUsers, changename} = require("../controllers/usercontrollers");
const router = express.Router();
router.route("/").post(registeruser).get(protect,allUsers);
router.post("/login",authUser);
router.put("/change-name",changename);
module.exports = router;