const User = require("../models/user.model");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  user
    .save()
    .then((result) => {
      result.hashed_password = undefined;
      result.salt = undefined;
      res.status(200).redirect("/?isSignedup=success");
    })
    .catch((err) => {
      console.log("ERROR: ", err);
      const error = errorHandler.getErrorMessage(err);
      res.status(400).render("error.ejs", {
        title: "Couldn't make new account",
        message: error,
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

const update = (req, res) => {
  let user = req.profile;
  user.overwrite(req.body);
  user.save((err) => {
    if (err) {
      res.status(500).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
  user.hashed_password = undefined;
  user.salt = undefined;
  res.status(200).json(user);
};

const remove = (req, res) => {
  const user = req.profile;
  user.remove((err, deletedUser) => {
    if (err) {
      res.status(500).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.status(200).json(deletedUser);
  });
};

module.exports = { list, create, userByUsername, read, remove, update };
