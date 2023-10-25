import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineHeart } from "react-icons/ai";
import { BsFillReplyAllFill } from "react-icons/bs";
import { FaRegPaperPlane } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { useSession } from "next-auth/react";
import Comment from "./Comment";
import { message } from "antd";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const Comments = ({ belongsTo, comments, comment, setComment }) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [addcomment, setAddComment] = useState("");
  const { data: session } = useSession();
  const userProfile = useAuth();

  // Function to get all comments
  const getAllComments = async () => {
    // Making a GET request to the comments API
    const res = await axios.get(`/api/comment?belongsTo=${belongsTo}`);
    // Setting the state with the received comments

    setComment(res?.data?.comments);
    // Logging the received comments
  };

  // Function to handle submission of a new comment
  const handleNewCommentSubmit = async (content) => {
    try {
      // Checking if the comment content is empty
      if (content.trim() === "") {
        message.warning("Boş yorum atılamaz !");
        return;
      }
      // Setting loading state
      setIsLoading(true);
      // Making a POST request to the comments API
      const { data } = await axios.post(`/api/comment`, {
        content,
        belongsTo: `65301cd3c11bb0f452ab3169`,
      });
      const newComment = data.comment;
      // Adding the new comment to the current comments
      if (newComment) {
        setComment((prevComments) => [...prevComments, newComment]);
      }
      setAddComment("");
    } catch (err) {
      // Logging error
      console.log(err);
    } finally {
      // Clearing loading state
      setIsLoading(false);
    }
  };

  // Function to update an edited comment
  const updateEditedComment = (newComment) => {
    if (!comment) return;
    let updatedComments = [...comment];
    if (newComment.chiefComment) {
      const index = updatedComments.findIndex(({ id }) => id === newComment.id);
      // Updating the content of the chief comment
      updatedComments[index].content = newComment.content;
    } else {
      const chiefCommentIndex = updatedComments.findIndex(
        ({ id }) => id === newComment.repliedTo
      );
      let newReplies = updatedComments[chiefCommentIndex].replies;
      newReplies = newReplies?.map((comment) => {
        // Updating the content of the reply comment
        if (comment.id === newComment.id) comment.content = newComment.content;
        return comment;
      });
      // Updating the replies of the chief comment
      updatedComments[chiefCommentIndex].replies = newReplies;
    }
    // Updating the comments
    setComment([...updatedComments]);
  };

  // Function to add a new reply comment

  const insertNewReplyComments = (reply) => {
    if (!comment) return;
    let updatedComments = [...comment];
    const chiefCommentIndex = updatedComments.findIndex(
      ({ id }) => id === reply.repliedTo
    );
    const { replies } = updatedComments[chiefCommentIndex];
    if (replies) {
      // Adding the new reply to existing replies
      updatedComments[chiefCommentIndex].replies = [...replies, reply];
    } else {
      // Adding the new reply
      updatedComments[chiefCommentIndex].replies = [reply];
    }
    // Updating the comments
    setComment([...updatedComments]);
  };

  // Function to handle submission of a reply comment
  const handleReplySubmit = async (replyComment) => {
    setIsLoading(true);
    try {
      // Making a POST request to add the reply
      const { data } = await axios.post(`/api/comment/addReply`, replyComment);
      // Inserting the new reply comment
      insertNewReplyComments(data.comment);
    } catch (err) {
      // Logging error
      console.log(err);
    }
    setIsLoading(false);
  };

  // Function to update after a comment is deleted
  const updateDeletedComments = (deletedComment) => {
    if (!comment) return;
    let newComments = [...comment];
    if (deletedComment.chiefComment) {
      // Removing the deleted chief comment
      newComments = newComments.filter(({ id }) => id !== deletedComment.id);
    } else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === deletedComment.repliedTo
      );
      const newReplies = newComments[chiefCommentIndex].replies?.filter(
        ({ id }) => id !== deletedComment.id
      );
      // Updating the replies after removing the deleted reply
      newComments[chiefCommentIndex].replies = newReplies;
    }
    // Updating the comments
    setComment([...newComments]);
  };

  // Function to handle deletion of a comment
  const handleOnDeleteClick = async (comment) => {
    setIsLoading(true);
    try {
      if (!comment) return;
      // Making a DELETE request to remove the comment
      const { data } = await axios.delete(
        `/api/comment?commentId=${comment.id}`
      );
      if (data.removed) {
        // Updating the comments after deletion
        updateDeletedComments(comment);
      }
    } catch (err) {
      // Logging error
      console.log(err);
    }
    setIsLoading(false);
  };

  // Function to handle updating a comment
  const handleUpdateSubmit = async (content, id) => {
    setIsLoading(true);
    try {
      // Making a PATCH request to update the comment
      const { data } = await axios.patch(`/api/comment?commentId=${id}`, {
        content,
      });
      // Updating the edited comment
      updateEditedComment(data.comment);
    } catch (err) {
      // Logging error
      console.log(err);
    }
    setIsLoading(false);
  };

  // Function to handle a comment being liked
  const updateLikedComments = (likedComment) => {
    if (!comment) return;
    let newComments = [...comment];
    if (likedComment.chiefComment) {
      newComments = newComments.map((comment) => {
        // Updating the liked chief comment
        if (comment.id === likedComment.id) return likedComment;
        return comment;
      });
    } else {
      const chiefCommentIndex = newComments.findIndex(
        ({ id }) => id === likedComment.repliedTo
      );
      const newReplies = newComments[chiefCommentIndex].replies?.map(
        (reply) => {
          // Updating the liked reply comment
          if (reply.id === likedComment.id) return likedComment;
          return reply;
        }
      );
      // Updating the replies after liking
      newComments[chiefCommentIndex].replies = newReplies;
    }
    // Updating the comments
    setComment([...newComments]);
  };

  // Function to handle clicking the like button
  const handleOnLikeClick = (comment) => {
    axios
      .post(`/api/comment/updateLike`, {
        commentId: comment.id,
      })
      // Updating the liked comment
      .then(({ data }) => updateLikedComments(data.comment))
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-3 container">
      <div className="bg-mainBlack2 rounded-lg :text-white  px-5 border-solid border-[1px] flex flex-col gap-5 relative border-mainGrey pb-5">
        <div className="text-xl text-white font-semibold p-3">
          Yorumlar ({comment?.length})
        </div>
        {comment?.map((comment, i) => {
          const { replies } = comment;
          return (
            <React.Fragment key={i}>
              <Comment
                comment={comment}
                showControls={userProfile?.id === comment.owner.id}
                onUpdateSubmit={(content) =>
                  handleUpdateSubmit(content, comment.id)
                }
                onReplySubmit={(content) =>
                  handleReplySubmit({ content, repliedTo: comment.id })
                }
                onDeleteClick={() => handleOnDeleteClick(comment)}
                onLikeClick={() => handleOnLikeClick(comment)}
              />
              {replies?.length ? (
                <div className="w-[93%] ml-auto space-y-3">
                  <h3 className=" text-textGray mb-3 ">Cevaplar</h3>
                  {replies.map((reply) => {
                    return (
                      <Comment
                        key={reply.id}
                        comment={reply}
                        showControls={userProfile?.id === reply.owner.id}
                        onUpdateSubmit={(content) =>
                          handleUpdateSubmit(content, reply.id)
                        }
                        onDeleteClick={() => handleOnDeleteClick(reply)}
                        onLikeClick={() => handleOnLikeClick(reply)}
                        onReplySubmit={(content) =>
                          handleReplySubmit({
                            content,
                            repliedTo: comment.id,
                          })
                        }
                        // onUpdateSubmit={(content) =>
                        //   handleUpdateSubmit(content, reply.id)
                        // }
                        //  onDeleteClick={() => handleOnDeleteClick(reply)}
                        // onLikeClick={() => handleOnLikeClick(reply)}
                      />
                    );
                  })}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
        {userProfile ? (
          <form
            className="h-[65px] w-full  p-3 text-white relative"
            onSubmit={(e) => {
              e.preventDefault();
              handleNewCommentSubmit(addcomment);
            }}
          >
            <input
              className="bg-mainBlack  text-textGray outline-none border-[1px] border-solid border-lightGrey  rounded-md w-full h-full p-1 px-3 pr-10"
              type="text"
              placeholder="Yorum yap"
              value={addcomment}
              onChange={(e) => setAddComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-transparent text-textGray dark:text-white text-xl cursor-pointer absolute right-7 top-1/2 -translate-y-1/2 border-none"
            >
              <FaRegPaperPlane />
            </button>
          </form>
        ) : (
          <div className="p-1">
            <div className="bg-[#f04a5d] py-5 rounded-md border-solid border-red-500 border-[1px] px-3 flex gap-3 items-center">
              <h3 className="text-white">
                Sadece kayıtlı üyeler yorum yapabilir. Bir kaç saniye içerisinde
                kayıt olabilirsiniz.
              </h3>
              <div className="flex gap-1 ">
                <Link
                  href={"/auth/login"}
                  className="bg-[#22c55e] border-none rounded-md h-fit py-2 px-3 cursor-pointer whitespace-nowrap  text-white text-center text-sm flex justify-center"
                >
                  Giriş Yap
                </Link>
                <Link
                  href={"/auth/register"}
                  className="bg-[#3b82f6] border-none rounded-md h-fit py-2 px-3 cursor-pointer whitespace-nowrap  text-white text-center text-sm flex  justify-center"
                >
                  Kayıt Ol
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
