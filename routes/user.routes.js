const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.controller");

router.route("/").get(userCtrl.list).post(userCtrl.create);
router.route("/:username").get(userCtrl.read).delete(userCtrl.create);

router.param("username", userCtrl.userByUsername);

module.exports = router;
