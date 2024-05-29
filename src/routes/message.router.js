const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();

const Message = require("../models/Message.model");
const Lesson = require("../models/Lesson.model");

router.post("/lessons/:lessonId/message", async (req, res, next) => {
  const { title, content, envoy, student, readAt } = req.body;
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    const newMessage = await Message.create({
      title,
      content,
      envoy,
      student,
      lesson: lessonId,
      readAt,
    });
    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
});

router.get("/lessons/:lessonId/messages", async (req, res, next) => {
  const { lessonId } = req.params;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  try {
    const messagesPerLesson = Message.find({ lesson: lessonId });
    res.json(messagesPerLesson);
  } catch (err) {
    next(err);
  }
});

router.get("/me/messages", async (req, res, next) => {
  const userId = req.user.id;
  const { messageType } = req.query;
  let messages;
  try {
    if (messageType === "professor") {
      messages = await Message.find({ lesson: { professor: userId } });
    } else if (messageType === "student") {
      messages = await Message.find({ student: userId });
    }
    res.json(messages);
  } catch (error) {
    next(error);
  }
});

//router.put("/:messageId");

//router.delete("/:messageId");

module.exports = router;
