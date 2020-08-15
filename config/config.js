module.exports = {
  PORT: process.env.PORT || 4000,
  MONGO_URI:
    process.env.MONGODB_URI ||
    `mongodb://${process.env.IP || "localhost"}:${
      process.env.MONGO_PORT || "27017"
    }/chitter`,
  JWT_SECRET: "chitter",
};
