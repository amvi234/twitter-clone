const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.controller");
const authCtrl = require("../controllers/auth.controller");

router.route("/").get(userCtrl.list).post(userCtrl.create);
router
  .route("/:username")
  .get(authCtrl.requireSignIn, userCtrl.read)
  .put(userCtrl.update)
  .delete(userCtrl.remove);

router.param("username", userCtrl.userByUsername);

module.exports = router;
