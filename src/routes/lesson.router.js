const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();
const protectionMiddleware = require("../middlewares/protection.middlewares");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../consts");

const User = require("../models/User.model");
const Lesson = require("../models/Lesson.model");
const Conversation = require("../models/Conversation.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);
router.post("/", async (req, res, next) => {
  const { title, content, durationInMin, field, keyword } = req.body;
  try {
    const createdLesson = await Lesson.create({
      title,
      content,
      professor: req.user.id,
      durationInMin,
      field,
      keyword,
    });

    res.status(201).json(createdLesson);
  } catch (err) {
    next(err);
  }
});
router.get("/:lessonId", async (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    const oneLesson = await Lesson.findById(lessonId);
    res.json(oneLesson);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const allLessons = await Lesson.find().populate("professor");
    res.json(allLessons);
  } catch (err) {
    next(err);
  }
});

router.put("/:lessonId", async (req, res, next) => {
  const { title, content, durationInMin, field, keyword } = req.body;
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, {
      title,
      content,
      professor: req.user.id,
      durationInMin,
      field,
      keyword,
    });
    res.json(updatedLesson);
  } catch (err) {
    next(err);
  }
});

router.delete("/:lessonId", async (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    await Lesson.findByIdAndDelete(lessonId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

router.post("/:lessonId/conversation", async (req, res, next) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  const lessonConcerned = await Lesson.find({ _id: lessonId }).populate(
    "professor"
  );
  const prof = lessonConcerned[0].professor;
  console.log(lessonConcerned, lessonConcerned[0].title, "test titre");

  try {
    const newConversation = await Conversation.create({
      title: lessonConcerned[0].title,
      student: userId,
      professorId: prof._id,
      professorPseudo: prof.pseudo,
      lesson: lessonId,
    });
    res.status(201).json(newConversation);
  } catch (err) {
    next(err);
  }
});

//router.get("/:lessonId/validate");

module.exports = router;
