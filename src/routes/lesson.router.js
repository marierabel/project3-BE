const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();

const Message = require("../models/Message.model");
const Lesson = require("../models/Lesson.model");
const { handleNotFound } = require("../utils");

router.post("/", async (req, res, next) => {
  const { title, content, professor, durationInMin, field, keyword } = req.body;
  try {
    const createdLesson = await Lesson.create({
      title,
      content,
      professor,
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
    const allLessons = await Lesson.find();
    res.json(allLessons);
  } catch (err) {
    next(err);
  }
});

router.put("/:lessonId", async (req, res, next) => {
  const { title, content, professor, durationInMin, field, keyword } = req.body;
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(lessonId, {
      title,
      content,
      professor,
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

//router.get("/:lessonId/validate");

module.exports = router;
