if (!process.env.NODE_ENV) {
  const dotenv = require("dotenv");
  dotenv.config();
}
module.exports = {
  PORT: process.env.PORT || 8000,
  MONGO_URI:
    process.env.MONGODB_URI ||
    `mongodb://${process.env.IP || "localhost"}:${
      process.env.MONGO_PORT || "27017"
    }/chitter`,
  JWT_SECRET: "chitter",
};
