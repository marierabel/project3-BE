const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/user.router");
const lessonRouter = require("./routes/lesson.router");
const messageRouter = require("./routes/message.router");
const { PORT, CORS_ORIGIN } = require("./consts");
const { catchAll, errorHandler } = require("./error-handling");

const app = express();

app.use(logger("dev")); // logs requests to the console
app.use(express.json()); // parses JSON request body
app.use(cors({ origin: CORS_ORIGIN })); // enables CORS (Cross Origin Resource Sharing) for all requests

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
app.use("/user", userRouter); // use humansRouter for all routes starting with "/humans"
app.use("/lesson", lessonRouter); // use petsRouter for all routes starting with "/pets"
app.use("/message", messageRouter);

// error handling middlewares should always be last
app.use(catchAll);
app.use(errorHandler);

require("./db")(); // connects to database

app.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});
