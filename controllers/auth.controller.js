const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

const User = require("../models/user.model");
const config = require("../config/config");

const signin = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err || !user) {
      return res.status(404).json({
        error: "No user found.",
      });
    }
    if (!user.authenticate(req.body.password)) {
      return res.status(401).json({
        error: "Email and password don't match.",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
      },
      config.JWT_SECRET
    );
    res.cookie("t", token, {
      expire: new Date() + 9999,
    });
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  });
};

const signout = (req, res) => {
  res.clearCookie("t");
  return res.status(200).json({
    message: "Signed Out",
  });
};

const requireSignIn = expressJwt({
  secret: config.JWT_SECRET,
  userProperty: "auth",
  algorithms: ["HS256"],
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.auth._id == req.profile._id;
  if (!authorized) {
    return res.status(401).json({ error: "Unauthorizes" });
  }
  next();
};

module.exports = { signin, signout, requireSignIn, hasAuthorization };
