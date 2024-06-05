const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();
const protectionMiddleware = require("../middlewares/protection.middlewares");
const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../consts");

const Message = require("../models/Message.model");
const Conversation = require("../models/Conversation.model");
const Validation = require("../models/Validation.model");
const User = require("../models/User.model");
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
      const convValidation = await Validation.find({ conversationId }).sort(
        "-createdAt"
      );
      const messagesPerConv = await Message.find({
        conversation: conversationId,
      });
      res.json({ messages: messagesPerConv, validations: convValidation });
    } catch (err) {
      next(err);
    }
  }
);

router.get("/conversations/:conversationId", async (req, res, next) => {
  const { conversationId } = req.params;

  if (!mongoose.isValidObjectId(conversationId)) {
    handleNotFound(res);
    return;
  }

  try {
    const oneConversation = await Conversation.findById(conversationId);

    res.json(oneConversation);
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
      conversations = await Conversation.find({ student: userId }).populate({
        path: "lesson",
        populate: { path: "professor" },
      });
    }
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.post("/:conversationId/appointment", async (req, res, next) => {
  const { conversationId } = req.params;

  if (!mongoose.isValidObjectId(conversationId)) {
    handleNotFound(res);
    return;
  }

  try {
    const newAppointment = await Validation.create({
      conversationId: conversationId,
      profValidation: false,
      studValidation: false,
    });
    res.status(201).json(newAppointment);
  } catch (err) {
    next(err);
  }
});

router.put("/:conversationId/appointment", async (req, res, next) => {
  const { conversationId } = req.params;
  const { profValidation, studValidation } = req.body;

  if (!mongoose.isValidObjectId(conversationId)) {
    handleNotFound(res);
    return;
  }

  try {
    const appointment = await Validation.findOne({
      conversationId: conversationId,
    }).populate("conversationId");
    const appointmentId = appointment._id;
    if (appointment.profValidation && appointment.studValidation) {
      return res.sendStatus(204);
    }

    const updatedAppointment = await Validation.findByIdAndUpdate(
      appointmentId,
      {
        profValidation,
        studValidation,
      },
      { new: true }
    );

    if (
      updatedAppointment.profValidation &&
      updatedAppointment.studValidation
    ) {
      await User.findByIdAndUpdate(appointment.conversationId.student, {
        $inc: { tickets: -1 },
      });
      console.log(appointment.conversationId.student);
      await User.findByIdAndUpdate(appointment.conversationId.professorId, {
        $inc: { tickets: 1 },
      });
    }
    res.status(201).json(updatedAppointment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:conversationId/appointment", async (req, res, next) => {
  const { conversationId } = req.params;

  if (!mongoose.isValidObjectId(conversationId)) {
    handleNotFound(res);
    return;
  }

  const appointment = await Validation.findOne({
    conservationId: conversationId,
  });
  console.log(appointment);
  const appointmentId = appointment._id;

  try {
    await Validation.findByIdAndDelete(appointmentId);
    res.sendStatus(204);
  } catch (err) {
    next(err);
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
