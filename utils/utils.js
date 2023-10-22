import { getServerSession } from "next-auth/next";

import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const getLikedByOwner = (likes, user) => likes.includes(user.id);

export const formatComment = (comment, user) => {
  const owner = comment.owner;
  return {
    id: comment._id.toString(),
    content: comment.content,
    likes: comment.likes.length,
    likedBy: comment.likes,
    chiefComment: comment?.chiefComment || false,
    createdAt: comment?.createdAt,
    owner: {
      id: owner._id,
      // name: owner.name,
      avatar: owner.avatar,
      username: owner.username,
    },
    repliedTo: comment?.repliedTo?.toString(),
    likedByOwner: user ? getLikedByOwner(comment.likes, user) : false,
  };
};

export const formatCommentFirst = (comment) => {
  const owner = comment.owner;
  return {
    id: comment._id.toString(),
    content: comment.content,
    likes: comment.likes.length,
    chiefComment: comment?.chiefComment || false,
    createdAt: comment?.createdAt,
    owner: {
      id: owner._id,
      //  name: owner.name,
      avatar: owner.avatar,
      username: owner.username,
    },
    repliedTo: comment?.repliedTo?.toString(),
    likedByOwner: false,
    likedBy: comment.likes,
  };
};

export const formatPosts = (posts) => {
  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    createdAt: post.createdAt.toString(),
    thumbnail: post.thumbnail?.url || "",
    meta: post.meta,
    tags: post.tags,
    category: post.category.toString(),
  }));
};
export async function isUser(req, res) {
  const session = await getServerSession(req, res, authOptions);

  const user = session?.user;
  if (user) {
    await dbConnect();
    const { email } = user;
    const rawUsers = await User.findOne({ email });
    return rawUsers;
  }

  res.status(403).json({ message: "Unauthorized!" });
}
