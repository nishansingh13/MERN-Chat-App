const express = require("express");
const { protect } = require("../middleware/authmiddle");
const {sendmessage , allMessages} = require("../controllers/messagecontroller")

const router = express.Router();
router.route("/").post(protect,sendmessage);
router.route("/:chatId").get(protect,allMessages);
module.exports = router;