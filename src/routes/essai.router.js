const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();
const protectionMiddleware = require("../middlewares/protection.middlewares");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../consts");

const User = require("../models/User.model");
const Lesson = require("../models/Lesson.model");
const Conversation = require("../models/Conversation.model");

router.use(protectionMiddleware);

router.post("/conversation/:conversationId", async (req, res, next) => {
  const { conversationId } = req.params;

  if (!mongoose.isValidObjectId(conversationId)) {
    handleNotFound(res);
    return;
  }
});

router.post("/lessons/:lessonId/conversation", async (req, res, next) => {
  const { lessonId } = req.params;
  const userId = req.user.id;

  if (!mongoose.isValidObjectId(lessonId)) {
    handleNotFound(res);
    return;
  }

  const user = await User.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
  ]);

  try {
    const newConversation = await Conversation.create({
      title: `from ${user.pseudo} for`,
      student: userId,
      lesson: lessonId,
    });
    res.status(201).json(newConversation);
  } catch (err) {
    next(err);
  }
});

router.get("/me/conversations", async (req, res, next) => {
  const userId = req.user.id;
  const { messageType } = req.query;
  let conversations;
  try {
    if (messageType === "professor") {
      const lessons = await Lesson.aggregate([
        {
          $match: {
            professor: userId,
          },
        },
        {
          $lookup: {
            from: "conversations",
            localField: "_id",
            foreignField: "lesson",
            as: "conversations",
          },
        },
      ]);
      conversations = lessons.map((lesson) => {
        return lesson.conversations;
      });
    } else if (messageType === "student") {
      conversations = await Conversation.find({ student: userId });
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
