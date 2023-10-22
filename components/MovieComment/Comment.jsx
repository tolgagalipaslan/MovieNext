import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillEdit, AiOutlineHeart } from "react-icons/ai";
import { BsFillReplyAllFill } from "react-icons/bs";
import { FaRegPaperPlane } from "react-icons/fa";
import { ImBin } from "react-icons/im";
import { message, Avatar, Modal } from "antd";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const Comment = ({
  comment,
  onReplySubmit,
  onDeleteClick,
  onUpdateSubmit,
  onLikeClick,
  showControls,
}) => {
  const [replayDropdown, setReplayDropdown] = useState(false);
  const [replayComment, setReplayComment] = useState("");
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [editComment, setEditComment] = useState(comment?.content);
  const [editDropdown, setEditDropdown] = useState(false);
  const { owner, createdAt, content, likedByOwner, likes, likedBy } = comment;
  const userProfile = useAuth();
  const handleCommentSubmit = (comment, e) => {
    e.preventDefault();

    if (comment.trim() === "") {
      message.warning("Boş yorum atılamaz !");
      return;
    }

    onReplySubmit && onReplySubmit(comment);
    setReplayComment("");
    setReplayDropdown(false);
  };

  const handleCommentEditSubmit = (comment) => {
    if (comment.trim() === "") {
      message.warning("Boş yorum atılamaz !");
      return;
    }

    onUpdateSubmit && onUpdateSubmit(comment);
    setEditComment(comment);
    setEditDropdown(false);
  };
  console.log(comment?.owner);
  const getLikedByOwner = (likedBy, userProfile) =>
    likedBy.includes(userProfile);
  return (
    <div className="flex items-start gap-2  border-solid border-0 border-b-[1px] p-3 border-lightGrey text-white">
      <div>
        <Avatar
          className="avatar-border"
          size={56}
          src={comment?.owner?.avatar?.url}
        />
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-col gap-1">
          <div className="font-semibold">{comment?.owner?.username}</div>
          <div className="text-sm text-white/60">
            {comment?.createdAt?.slice(0, 10)}
          </div>
        </div>
        <p className="text-sm">{comment?.content}</p>
        <div className="flex items-center gap-4">
          <div className="hover:text-[#b92727] cursor-pointer flex items-center gap-1">
            {/* {userProfile ? (
              <LikeHeart
                liked={getLikedByOwner(likedBy, userProfile.id)}
                label={likes + " likes"}
                onClick={onLikeClick}
              />
            ) : (
              <LikeHeart
                liked={likedByOwner}
                label={likes + " likes"}
                onClick={onLikeClick}
                noAuth
              />
            )} */}
          </div>
          {userProfile ? (
            <div
              onClick={() => {
                setReplayDropdown(!replayDropdown);
                setEditDropdown(false);
              }}
              className="cursor-pointer flex items-center gap-1"
            >
              <BsFillReplyAllFill /> Yanıtla
            </div>
          ) : (
            <div
              onClick={() => {
                message.error("Yorumu yanıtlamak için giriş yapın !");
              }}
              className="cursor-pointer flex items-center gap-1"
            >
              <BsFillReplyAllFill /> Yanıtla
            </div>
          )}
          {showControls && (
            <>
              <div
                onClick={() => {
                  setEditDropdown(!editDropdown);
                  setReplayDropdown(false);
                }}
                className=" cursor-pointer flex items-center gap-1"
              >
                <AiFillEdit />
                Düzenle
              </div>
              <div
                onClick={() => setDeleteAlert(!deleteAlert)}
                className="cursor-pointer flex items-center gap-1 hover:text-[#b92727]"
              >
                <ImBin /> Sil
              </div>
            </>
          )}
        </div>
        <div
          className={`${
            editDropdown ? "h-[60px] py-2" : "h-0 py-0"
          } overflow-y-hidden duration-300 w-full max-w-[90%] ms-auto px-2`}
        >
          <form
            className="w-full relative h-full flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleCommentEditSubmit(editComment);
            }}
          >
            <input
              className="bg-mainGrey  text-textGray outline-none border-[1px] border-solid border-lightGrey  rounded-md w-full h-full p-1 px-3 pr-14"
              type="text"
              placeholder="Yorum yap"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-transparent text-white text-xl cursor-pointer absolute right-5 top-1/2 -translate-y-1/2 border-none"
            >
              <FaRegPaperPlane />
            </button>
          </form>
        </div>
        <div
          className={`${
            replayDropdown ? "h-[60px] py-2" : "h-0 py-0"
          } overflow-y-hidden duration-300 w-full max-w-[90%] ms-auto px-2`}
        >
          <form
            className="w-full relative h-full flex"
            onSubmit={(e) => {
              handleCommentSubmit(replayComment, e);
            }}
          >
            <input
              className="dark:bg-mainGrey bg-mainWhite text-textGray outline-none border-[1px] border-solid dark:border-lightGrey border-mainWhiteBorder rounded-md w-full h-full p-1 px-3 pr-14"
              type="text"
              placeholder="Yorum yap"
              value={replayComment}
              onChange={(e) => setReplayComment(e.target.value)}
            />
            <button
              type="submit"
              className="bg-transparent text-textGray dark:text-white text-xl cursor-pointer absolute right-5 top-1/2 -translate-y-1/2 border-none"
            >
              <FaRegPaperPlane />
            </button>
          </form>
        </div>
      </div>

      <Modal
        bodyStyle={{
          padding: 0,
          backgroundColor: "#232626",
        }}
        closeIcon={null}
        className="text-white  p-0"
        centered
        footer={null}
        open={deleteAlert}
        onCancel={() => {
          setDeleteAlert(false);
        }}
      >
        <div className="flex flex-col gap-4 p-5">
          <div className="font-semibold text-xl">Emin misin?</div>
          <div>Bu işlem, bu yorumu kaldıracak!</div>
          <div className="flex gap-3 items-center ">
            <button
              onClick={() => setDeleteAlert(false)}
              className="border-none cursor-pointer rounded-md bg-red-500 py-2 px-4 text-white font-semibold"
            >
              Vazgeç
            </button>
            <button
              onClick={() => {
                setDeleteAlert(false);
                onDeleteClick();
              }}
              className="border-none cursor-pointer rounded-md bg-green-500 py-2 px-4 text-white font-semibold"
            >
              Sil
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Comment;
