const express = require("express");
const path = require("path");
const config = require("./config/config");

const app = express();

app.use(express.static(path.join(__dirname, "static")));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", { message: "hello world", title: "Twitter Clone" });
});

app.listen(config.PORT, (err) => {
  if (err) return console.log(err, " an error occured");
  console.log(`Server started on port ${config.PORT}`);
});
