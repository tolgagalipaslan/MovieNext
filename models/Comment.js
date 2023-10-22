import { model, models, Schema } from "mongoose";

const CommentSchema = new Schema(
  {
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    chiefComment: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = models?.Comment || model("Comment", CommentSchema);

export default Comment;
