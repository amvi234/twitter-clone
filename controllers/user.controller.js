const User = require("../models/user.model");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    });
};

const list = (req, res) => {
  User.find((err, user) => {
    if (err) {
      return res.status(500).json({
        error: "Couldn't get the users",
      });
    }
    return res.status(200).json(user);
  });
};

const userByUsername = (req, res, next, username) => {
  //   console.log("USERNAME: ", username);
  User.findOne({ username }, (err, user) => {
    // console.log("user: ", user);
    if (err || !user) {
      return res
        .status(404)
        .json({ error: `No user of username: ${username}` });
    }
    req.profile = user;
    next();
  });
};

const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).json(req.profile);
};

module.exports = { list, create, userByUsername, read };
