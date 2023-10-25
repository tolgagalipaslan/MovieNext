import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/Comment";
import { isValidObjectId } from "mongoose";

import { formatComment, isUser } from "@/utils/utils";
// Update like method
export default async function POST(req, res) {
  return await updateLike(req, res);
}

// Function to update likes on a comment
const updateLike = async (req, res) => {
  // Getting the body from the request
  const { commentId } = req.body;

  // Checking if user is valid
  const user = await isUser(req, res);

  // Connecting to the database
  await dbConnect();

  // Checking if user is valid
  if (!user) return res.status(405).json({ error: "Unhotirazed request!" });

  // Checking if commentId is valid
  if (!commentId || !isValidObjectId(commentId))
    return res.status(422).json({ error: "Invalid request!" });

  // Fetching the comment from the database
  const comment = await Comment.findById(commentId)
    .populate({
      path: "owner",
      select: "name avatar",
    })
    .populate({
      path: "replies",
      populate: {
        path: "owner",
        select: "name avatar",
      },
    });

  // Checking if the comment exists
  if (!comment) return res.status(404).json({ error: "Comments not found!" });

  // Fetching likes of the comment
  const oldLikes = comment.likes || [];
  const likedBy = user.id;

  // Check if user has already liked the comment, if yes then unlike, else like
  if (oldLikes.includes(likedBy)) {
    // User has already liked the comment, so unlike it
    comment.likes = oldLikes.filter(
      (like) => like.toString() !== likedBy.toString()
    );
  } else {
    // User hasn't liked the comment, so like it
    comment.likes = [...oldLikes, likedBy];
  }

  // Saving the comment after updating likes
  await comment.save();

  // Returning the updated comment
  return res.status(202).json({
    comment: {
      ...formatComment(comment, user),
      replies: comment.replies?.map((reply) => formatComment(reply, user)),
    },
  });
};
