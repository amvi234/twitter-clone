const Chitter = require("../models/chitter.model");
const User = require("../models/user.model");
const errorHandler = require("../helpers/dbErrorHandler");

const create = (req, res) => {
  const userId = req.auth.id;
  const username = req.auth.username;
  const body = {
    userId,
    chitter: req.body.chitter,
    username,
  };
  const newChitter = new Chitter(body);
  newChitter
    .save()
    .then((chitter) => {
      res.status(200).redirect("/");
    })
    .catch((err) => {
      res.status(500).json({
        error: errorHandler.getErrorMessage(err),
      });
    });
};

const list = (req, res) => {
  Chitter.find()
    .sort({ created: "desc" })
    .exec((err, chitter) => {
      if (err) {
        res.status(500).json({
          error: "Couldn't get chitters.",
        });
      }
      res
        .status(200)
        .render("chitters.ejs", {
          chitters: chitter,
          title: "Chitters",
          user: req.auth,
        });
    });
};

const findById = (req, res, next, id) => {
  Chitter.findById(id).exec((err, chitter) => {
    if (err || !chitter) {
      res.status(404).json({
        error: "No Chitter Found",
      });
    }
    req.chitter = chitter;
    next();
  });
};

const read = (req, res) => {
  return res.status(200).render("chitter.ejs", {
    chitter: req.chitter,
    title: `Chitter | ${req.chitter.chitter}`,
    user: req.auth,
  });
};

const newComment = (req, res) => {
  let chitter = req.chitter;
  const existingComment = chitter.comments;
  console.log(req.auth);
  let userId = req.auth.id;
  let username = req.auth.username;
  let comment = req.body.comment;
  const newComment = {
    userId,
    username,
    comment,
  };
  existingComment.push(newComment);
  chitter.updateOne({ comments: existingComment }, (err) => {
    if (err) {
      res.status(500).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
  res.status(200).redirect(`/chitter/${chitter._id}`);
};

module.exports = { create, list, findById, read, newComment };
