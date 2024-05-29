const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();

const Message = require("../models/Message.model");
const Lesson = require("../models/Lesson.model");

router.post("/:lessonId/message", async (req, res, next) => {
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

//router.put("/:messageId");

//router.delete("/:messageId");

module.exports = router;
