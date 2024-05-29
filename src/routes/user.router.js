const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();

const User = require("../models/User.model");
const Lesson = require("../models/Lesson.model");
const Message = require("../models/Message.model");
const { handleNotFound } = require("../utils");

router.post("/signup", async (req, res, next) => {
  const { email, password, name, pseudo, bio, tickets, lessonMarked } =
    req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const createdUser = await User.create({
      email,
      password: hashedPassword,
      name,
      pseudo,
      bio,
      tickets,
      lessonMarked,
    });

    // `createdUser` is readonly, the actual data is stored in `createdUser._doc`
    // directly mutating `._doc` is not particularly good practice, so use with caution
    delete createdUser._doc.password; // 👈 remove password from response

    res.status(201).json(createdUser);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    /*
      unlike encryption, hashing is a one-way process, meaning we can't decrypt. so to check if the password is correct, we need to hash the password we received from the client and compare it to the hashed password stored in the database
    
      that's what `bcrypt.compare` does
      */
    const isCorrectCredentials =
      user != null && (await bcrypt.compare(password, user.password));

    if (!isCorrectCredentials) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const authToken = jwt.sign({ email }, TOKEN_SECRET, {
      algorithm: "HS256",
      issuer: "proj3IH",
      expiresIn: "2d",
    });

    res.json({ authToken });
  } catch (err) {
    next(err);
  }
});

router.get("/:userId", (req, res) => {
  res.json(req.user);
});

router.delete("/:userId", async (req, res) => {
  await User.deleteOne(req.user);
  res.sendStatus(204);
});

router.get("/:userId/lessons", async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    handleNotFound(res);
    return;
  }

  try {
    const userLessons = await Lesson.find({ professor: userId });
    res.json(userLessons);
  } catch (error) {
    next(error);
  }
});

router.get(":/userId/messages", async (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.isValidObjectId(userId)) {
    handleNotFound(res);
    return;
  }
  try {
    const profMessage = Message.populate("lesson").professor;
    const userMessages = await Message.find(
      { student: userId } || { profMessage: userId }
    );
    res.json(userMessages);
  } catch (error) {
    next(error);
  }
});

// router.put("/:userId");

module.exports = router;
