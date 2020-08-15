const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

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

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoute);
app.use("/users", userRoute);
app.use("/chitter", chitterRoute);

app.listen(config.PORT, (err) => {
  if (err) return console.log(err, " an error occured");
  console.log(`Server started on port ${config.PORT}`);
  //   console.log("PROCESS OBJECT", process);
});
