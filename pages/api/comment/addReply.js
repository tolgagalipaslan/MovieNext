import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { message } from "antd";
import { formatComment, isUser } from "@/utils/utils";
import Comment from "@/models/Comment";
import Post from "@/models/Post";

const handle = async (req, res) => {
  try {
    await dbConnect();
    const { method, query } = req;

    if (method === "POST") {
      const user = await isUser(req, res);

      const { content, repliedTo } = req.body;

      if (!isValidObjectId(repliedTo))
        return res.status(403).json({
          message: "Not Valid",
        });

      await dbConnect();
      const chiefComment = await Comment.findOne({
        _id: repliedTo,
        chiefComment: true,
      });
      if (!chiefComment)
        return res.status(403).json({
          message: "Comment Not Found",
        });
      const replyComment = new Comment({
        owner: user._id,
        repliedTo,
        content: content,
      });

      if (chiefComment.replies)
        chiefComment.replies = [...chiefComment.replies, replyComment._id];

      await chiefComment.save();
      await replyComment.save();

      const finalComment = await replyComment.populate("owner");

      return res.status(201).json({
        comment: formatComment(finalComment, user),
      });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handle;
