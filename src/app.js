const express = require("express");
const logger = require("morgan");
const cors = require("cors");
require("dotenv").config();

const userRouter = require("./routes/user.router");
const lessonRouter = require("./routes/lesson.router");
const messageRouter = require("./routes/message.router");
const { PORT, CORS_ORIGIN } = require("./consts");
const { catchAll, errorHandler } = require("./error-handling");

const app = express();

app.use(logger("dev")); // logs requests to the console
app.use(express.json()); // parses JSON request body
app.use(cors()); // enables CORS (Cross Origin Resource Sharing) for all requests

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.use("/users", userRouter); // use humansRouter for all routes starting with "/humans"
app.use("/lessons", lessonRouter); // use petsRouter for all routes starting with "/pets"
app.use("/", messageRouter);

// error handling middlewares should always be last
app.use(catchAll);
app.use(errorHandler);

require("./db")(); // connects to database

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
