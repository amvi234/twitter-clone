const express = require("express");
const path = require("path");
// const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

mongoose.Promise = global.Promise;

const config = require("./config/config");

const userRoute = require("./routes/user.routes");
const authRoute = require("./routes/auth.routes");
const chitterRoute = require("./routes/chitter.routes");

const app = express();

mongoose.connect(config.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to the databse: ${config.mongoUri}`);
});

// app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  if (req.cookies.t) {
    const decoded = jwt.verify(req.cookies.t, config.JWT_SECRET);
    if (decoded) return res.status(200).redirect("/chitter");
  }
  const message = req.query.isSignedup == "success" ? "You can Login now!" : "";
  res.status(200).render("index.ejs", { title: "Chitter", message });
});
app.use("/api", authRoute);
app.use("/users", userRoute);
app.use("/chitter", chitterRoute);
app.get("/*", (req, res) =>
  res.render("404.ejs", { title: "Ye konsi line me aa gaye aap?" })
);

app.listen(config.PORT, (err) => {
  if (err) return console.log(err, " an error occured");
  console.log(`Server started on port ${config.PORT}`);
  //   console.log("PROCESS OBJECT", process);
});
