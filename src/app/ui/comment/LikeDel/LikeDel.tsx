"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  baseURL,
  IComment,
  Ireplies,
  Isession,
  IUser,
} from "@/app/types/types";
import AddReply from "../AddReply";
import { useFetchAuthor } from "@/context/useFetchAuthor";
import { timeAgo } from "@/utils/timeAgo";
import { scrollToView } from "@/utils/scroll";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "../../Alert";
import { Button } from "@/components/ui/button";
import { FormDrawer } from "../../FormDrawer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faComment,
  faHeart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import mongoose from "mongoose";
import ReplyForm from "../reply/ReplyForm";

const LikeDel = ({
  commentId,
  author,
  comments,
  postId,
  session,
}: {
  commentId: string;
  author: string;
  comments: string;
  postId: string;
  session: Isession;
}) => {
  const [likes, setLikes] = useState<
    (mongoose.Types.ObjectId | string)[] | undefined
  >();
  const [likeReply, setLikesReply] = useState<any>();
  // console.log(likeReply);
  const [openReply, setOpenReply] = useState(false);
  const [toggleReplies, setToggleReplies] = useState(false);
  const [replies, setReplies] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState<Boolean>(false);

  const router = useRouter();
  const [showComment, setShowComment] = useState<{ [key: string]: boolean }>(
    {}
  );

  const Comments: { message: Array<IComment> } = useMemo(
    () => JSON.parse(comments),
    [comments]
  );
  useEffect(() => {
    const currentComment: IComment | undefined = Comments.message.find(
      (comment) => comment._id.toString() === commentId
    );
    if (currentComment) {
      setLikes(currentComment.likes);
      setReplies(currentComment?.replies);
    }
    if (message) setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  }, [Comments.message, message, author, commentId]);

  const handleDeleteComment = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/comment/delete/${commentId + "," + postId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const res = await fetch(`/api/comment/reply/delete`, {
        method: "PATCH",
        body: JSON.stringify({ replyId, commentId }),
      });
      if (!res.ok) {
        throw new Error("something wemt wrong");
        return;
      }
      const data: { message: string } = await res.json();
      console.log(data.message);
      router.refresh();
    } catch (error: any) {
      console.error(error.message);
    }
  };
  // fetch all authors to handle likes
  const { authors }: { authors: { message: IUser[] } } =
    useFetchAuthor(`/api/user/getUsers`);
  let foundAuthor: any;
  if (authors) {
    foundAuthor = authors.message.find(
      (user: IUser) => user.email === session?.user.email
    );
  }

  let isLiked: () => boolean = () => {
    if (foundAuthor) {
      if (likes?.includes(foundAuthor._id.toString())) return true;
      return false;
    }
    return false;
  };

  let isLikedReply: (replyId: string) => boolean |undefined = (replyId: string) => {
    if (foundAuthor) {
      const foundReply: Ireplies = replies.find(
        (element: Ireplies) => element._id?.toString() === replyId
      );
      if (foundReply.likes && Array.isArray(foundReply.likes)) {
        let liked = foundReply.likes.some(
          (element: string) => element.toString() === foundAuthor._id.toString()
        );
        if (liked) return liked;
        return false;
      }
    }
  };

  const handleLikeComment = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/comment/${isLiked() ? "unlike" : "like"}/${commentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ session }),
        }
      );
      const data: { message: IComment } = await res.json();
      setLikes(data.message.likes);
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
    }
  };

  const handleLikeReply = async (replyId: string) => {
    try {
      const response = await fetch(
        `${baseURL}/api/comment/reply/${
          isLikedReply(replyId) ? "unlike" : "like"
        }`,
        {
          method: "PATCH",
          body: JSON.stringify({ commentId, session, replyId }),
        }
      );
      if (!response.ok) {
        throw new Error("something went wrong");
        return;
      }
      const data = await response.json();
      router.refresh();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleToggleReply = (_id: string) => {
    setShowComment((prev) => ({
      ...prev,
      [_id]: !prev[_id],
    }));
  };

  return (
    <>
      {" "}
      <div className=" rounded-lg flex justify-evenly items-center p-2">
        {showMessage && (
          <div
            className={`message absolute p-2 z-11 shadow-lg top-[50%] translate-y-[-50%] left-[50vh] translate-x-[-50%] px-4 rounded-lg text-center  ${
              message.includes("error")
                ? "bg-red-200 text-red-800"
                : "text-lg bg-green-200  text-green-800"
            }`}
          >
            {!message.includes("error") && (
              <input type="checkbox" readOnly defaultChecked={true} />
            )}
            <span className="m-1">{message}</span>
          </div>
        )}
        {/* Like button */}
        <Button
          variant={"outline"}
          className={`flex gap-1 items-center justify-between ${
            likes?.includes(foundAuthor?._id.toString()) ? "text-blue-500" : ""
          }`}
          onClick={handleLikeComment}
        >
          {likes && likes?.length > 0 && (
            <i className="text-sm">{likes?.length}</i>
          )}
          <FontAwesomeIcon icon={faHeart} />
        </Button>
        {/* reply button */}
        <FormDrawer commentId={commentId} session={session} postId={postId} />
        {!openReply ? (
          <Button
            className="hidden md:inline-block"
            variant={"outline"}
            onClick={() => {
              setOpenReply((prev) => !prev);
              scrollToView("reply");
            }}
          >
            <FontAwesomeIcon icon={faComment} />
          </Button>
        ) : (
          <Button
            variant={"outline"}
            onClick={() => setOpenReply((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faAngleUp} />
          </Button>
        )}

        {/* Delete button */}
        <Alert
          title="This comment will be deleted"
          warning="This cannot be undone once deleted"
          handledelete={handleDeleteComment}
        />
      </div>
      {/* form for replies to comment */}
      <div
        style={{ display: replies.length > 0 ? "block" : "none" }}
        className="allReplies p-2 border rounded-lg mt-2"
      >
        <button
          onClick={() => {
            setToggleReplies((prev) => !prev);
          }}
        >
          {toggleReplies ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faAngleDown} />
          )}
        </button>
        {replies &&
          toggleReplies &&
          replies.map((item: any, index: number) => {
            const foundAuthor = authors?.message.find(
              (author) => author._id?.toString() === item?.author?.toString()
            );
            const username = foundAuthor?.username;
            const usernameLength = username?.length || 0;
            return (
              <div
                id={`${item._id}`}
                className="p-2  m-2 rounded-lg shadow-md"
                key={index}
              >
                <div className="authors flex justify-between items-center ">
                  {foundAuthor?.profilePic ? (
                    <div
                      onClick={() => {
                        router.push(`/naija_memes/profile/${foundAuthor?._id}`);
                      }}
                      className="user-image cursor-pointer flex gap-x-1"
                    >
                      <div className="image-container border-1 relative p-4 aspect-square overflow-hidden rounded-full">
                        <Image
                          alt="profileImage"
                          fill
                          className="object-cover"
                          src={`/profile_pic/${foundAuthor?.profilePic}`}
                        />
                      </div>
                      <i className=" text-sm">{foundAuthor?.username}</i>
                    </div>
                  ) : (
                    <div className="user-image flex gap-x-1 ">
                      <FontAwesomeIcon
                        className="border rounded-full p-2"
                        icon={faUser}
                      />
                      <i className=" text-sm">{foundAuthor?.username}</i>
                    </div>
                  )}
                  <i className=" text-sm">
                    {timeAgo(new Date(), new Date(item?.createdAt))}
                  </i>
                </div>

                <div className="p-2 relative">
                  {item.reply.includes(`@${username}`) ? (
                    <p>
                      <i className="text-[var(--bg-light)] text-[1rem]">
                        <Link href={`/naija_memes/profile/${foundAuthor?._id}`}>
                          {item.reply.slice(0, usernameLength + 1)}
                        </Link>
                      </i>
                      <span>{item.reply.slice(usernameLength + 1)}</span>
                    </p>
                  ) : (
                    <p>
                      {item.file.some((file: string) => file) &&
                        item.file.map((file: string) => {
                          return (
                            <div
                              key={file}
                              className="absolute w-[50%] h-[100%] mb-1"
                            >
                              <Image
                                className="rounded-lg"
                                alt="images"
                                fill
                                src={`/comment/replies/${file}`}
                              />
                            </div>
                          );
                        })}
                      <span>{item.reply}</span>
                    </p>
                  )}
                </div>
                {/* like reply and delete section */}
                <div className="utilityContainer flex justify-between  ">
                  {/* like */}
                  <Button
                    onClick={() => handleLikeReply(item._id.toString())}
                    className={`flex gap-x-1 ${
                      isLikedReply(item._id.toString()) ? "text-blue-500" : ""
                    }`}
                    variant={"outline"}
                  >
                    {item.likes.length > 0 && <i>{item.likes.length}</i>}
                    <FontAwesomeIcon icon={faHeart} />
                  </Button>
                  {/* comment */}
                  <Button
                    variant={"outline"}
                    onClick={() => handleToggleReply(`${item._id}`)}
                  >
                    {showComment[item._id.toString()] ? (
                      <FontAwesomeIcon icon={faAngleUp} />
                    ) : (
                      <FontAwesomeIcon icon={faComment} />
                    )}
                  </Button>
                  {/* delete */}
                  <Alert
                    title="You are about to delete this comment"
                    warning="it cannot be undone once deleted"
                    handledelete={async () =>
                      handleDeleteReply(item._id.toString())
                    }
                  />
                </div>
                {showComment[item._id.toString()] && (
                  <ReplyForm
                    handleToggleReply={() => handleToggleReply(`${item._id}`)}
                    commentId={commentId}
                    session={session}
                    replyId={`${item._id}`}
                    setShowMessage={setShowMessage}
                    setMessage={setMessage}
                  />
                )}
              </div>
            );
          })}
      </div>
      {openReply && (
        <AddReply
          openReply={openReply}
          setToggleReplies={setToggleReplies}
          commentId={commentId}
          session={session}
        />
      )}
    </>
  );
};

export default LikeDel;
