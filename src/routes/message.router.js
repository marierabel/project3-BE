const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();
const protectionMiddleware = require("../middlewares/protection.middlewares");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../consts");

const Message = require("../models/Message.model");
const Conversation = require("../models/Conversation.model");
const Lesson = require("../models/Lesson.model");
const { handleNotFound } = require("../utils");

router.use(protectionMiddleware);

router.post(
  "/conversations/:conversationId/messages",
  async (req, res, next) => {
    const { content } = req.body;
    const { conversationId } = req.params;
    const userId = req.user.id;

    if (!mongoose.isValidObjectId(conversationId)) {
      handleNotFound(res);
      return;
    }

    try {
      const newMessage = await Message.create({
        content,
        author: userId,
        conversation: conversationId,
        readAt: null,
      });
      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/conversations/:conversationId/messages",
  async (req, res, next) => {
    const { conversationId } = req.params;

    if (!mongoose.isValidObjectId(conversationId)) {
      handleNotFound(res);
      return;
    }

    try {
      const messagesPerConv = await Message.find({
        conversation: conversationId,
      });
      console.log(messagesPerConv);
      res.json(messagesPerConv);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/me/conversations", async (req, res, next) => {
  const userId = req.user.id;
  const { messageType } = req.query;
  let conversations;
  try {
    if (messageType === "professor") {
      conversations = await Conversation.find({ professorId: userId });
      // const lessons = await Lesson.aggregate([
      //   {
      //     $match: {
      //       professor: userId,
      //     },
      //   },
      //   {
      //     $lookup: {
      //       from: "conversations",
      //       localField: "_id",
      //       foreignField: "lesson",
      //       as: "conversations",
      //     },
      //   },
      //   {
      //     $unwind: "$conversations",
      //   },
      //   {
      //     $lookup: {
      //       from: "users",
      //       localField: "conversations.student",
      //       foreignField: "_id",
      //       as: "student",
      //     },
      //   },
      //   {
      //     $unwind: "$student",
      //   },
      //   {
      //     $unset: "student.password",
      //   },
      // ]);
    } else if (messageType === "student") {
      console.log(userId);
      conversations = await Conversation.find({ student: userId }).populate({
        path: "lesson",
        populate: { path: "professor" },
      });
      //   conversations = await Conversation.aggregate([
      //     {
      //       $match: {
      //         student: userId,
      //       },
      //     },
      //     {
      //       $lookup: {
      //         from: "lessons",
      //         localField: "lesson",
      //         foreignField: "_id",
      //         as: "lesson",
      //       },
      //     },
      //     {
      //       $unwind: "$lesson",
      //     },
      //     {
      //       $lookup: {
      //         from: "users",
      //         localField: "lesson.professor",
      //         foreignField: "_id",
      //         as: "professor",
      //       },
      //     },
      //     {
      //       $unwind: "$professor",
      //     },
      //     {
      //       $unset: "professor.password",
      //     },
      //   ]);
    }
    console.log(conversations);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// router.get("/me/messages", async (req, res, next) => {
//   const userId = req.user.id;
//   const { messageType } = req.query;
//   let messages;
//   try {
//     if (messageType === "professor") {
//       const lessons = await Lesson.aggregate([
//         {
//           $match: {
//             professor: userId,
//           },
//         },
//         {
//           $lookup: {
//             from: "messages",
//             localField: "_id",
//             foreignField: "lesson",
//             as: "messages",
//           },
//         },
//       ]);
//       messages = lessons.map((lesson) => {
//         return lesson.messages;
//       });
//     } else if (messageType === "student") {
//       messages = await Message.find({ student: userId });
//     }
//     res.json(messages);
//   } catch (error) {
//     next(error);
//   }
// });

//router.put("/:messageId");

//router.delete("/:messageId");

module.exports = router;
