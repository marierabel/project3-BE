require("dotenv").config(); // loads environment variables from a .env file into process.env

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teav-mongoose";
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || `http://127.0.0.1:${PORT}`;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = { MONGO_URI, PORT, CORS_ORIGIN, TOKEN_SECRET };
