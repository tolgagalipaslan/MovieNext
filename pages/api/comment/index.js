import mongoose, { isValidObjectId } from "mongoose";
import dbConnect from "@/lib/dbConnect";
import {
  formatComment,
  formatCommentFirst,
  isUser,
} from "../../../utils/utils";
import Comment from "@/models/Comment";
import Movie from "@/models/Movie";

const handle = async (req, res) => {
  try {
    await dbConnect();
    const { method, query } = req;

    if (method === "GET") {
      //  const user = await isUser(req, res);
      // console.log(user);
      // Getting belongsTo from query
      const { belongsTo } = query;

      // Fetching comments from the database
      const comments = await Comment.find({ belongsTo })
        .populate({
          path: "owner",
          select: "name avatar username",
        })
        .populate({
          path: "replies",
          populate: {
            path: "owner",
            select: "name avatar username",
          },
        });

      // Formatting the comments
      const formattedComment = comments.map((comment) => ({
        ...formatCommentFirst(comment),
        replies: comment.replies?.map((c) => formatCommentFirst(c)),
      }));

      // Returning the formatted comments
      return res.status(200).json({ comments: formattedComment });
    }

    if (method === "POST") {
      // Checking if user is valid
      const user = await isUser(req, res);
      if (!user)
        return res.status(403).json({
          message: "User doesn't exist",
        });

      // Getting body from request
      const { belongsTo, content } = req.body;

      // Fetching the post from the database
      const movie = await Movie.findById(belongsTo);
      if (!movie)
        return res.status(403).json({
          message: "Movie doesn't exist",
        });

      // Creating a new comment
      const comment = new Comment({
        content,
        belongsTo,
        owner: user._id,
        chiefComment: true,
      });
      // Saving the comment
      await comment.save();
      const commentWithOwner = await comment.populate("owner");

      // Returning the new comment
      return res.json({ comment: formatComment(commentWithOwner, user) });
    }

    if (method === "DELETE") {
      // Getting commentId from params
      const { commentId } = req.query;

      // Checking if user is valid
      const user = await isUser(req, res);

      // Checking if user is valid
      if (!user)
        return res.status(403).json({ error: "Unauthorized request!" });

      // Checking if commentId is valid
      if (!commentId || !isValidObjectId(commentId))
        return res.status(422).json({ error: "Invalid request!" });

      // Fetching the comment from the database
      const comment = await Comment.findOne({
        _id: commentId,
        owner: user._id,
      });

      // Checking if the comment exists
      if (!comment)
        return res.status(404).json({ error: "Comment not found!" });

      // Checking if the comment is a chiefComment and deleting replies if it is
      if (comment.chiefComment)
        await Comment.deleteMany({ repliedTo: commentId });
      else {
        const chiefComment = await Comment.findById(comment.repliedTo);
        if (chiefComment?.replies?.includes(commentId)) {
          chiefComment.replies = chiefComment.replies.filter(
            (cId) => cId.toString() !== commentId
          );

          // Saving the chiefComment after updating replies
          await chiefComment.save();
        }
      }

      // Deleting the comment
      await Comment.findByIdAndDelete(commentId);

      // Returning a message indicating the comment has been deleted
      return res.json({ removed: true });
    }

    if (method === "PATCH") {
      // Getting commentId from params
      const { commentId } = req.query;

      // Getting body from request
      const { content } = req.body;

      // Checking if user is valid
      const user = await isUser(req, res);

      // Checking if user is valid
      if (!user)
        return res.status(403).json({ error: "Unauthorized request!" });

      // Checking if commentId is valid
      if (!commentId || !isValidObjectId(commentId))
        return res.status(422).json({ error: "Invalid request!" });

      // Fetching the comment from the database
      const comment = await Comment.findOne({
        _id: commentId,
        owner: user._id,
      }).populate("owner");

      // Checking if the comment exists
      if (!comment)
        return res.status(404).json({ error: "Comment not found!" });

      // Updating the content of the comment
      comment.content = content;
      // Saving the comment
      await comment.save();

      // Returning the updated comment
      return res.json({ comment: formatComment(comment) });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default handle;
