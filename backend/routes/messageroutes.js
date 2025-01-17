const express = require("express");
const { protect } = require("../middleware/authmiddle");
const {sendmessage , allMessages, deleteMessage} = require("../controllers/messagecontroller")

const router = express.Router();
router.route("/").post(protect,sendmessage);
router.route("/:chatId").get(protect,allMessages);
router.route("/delete").delete(deleteMessage);
module.exports = router;