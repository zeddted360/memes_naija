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
import LikeDelReply from "../reply/LikeDel";
import { scrollToView } from "@/utils/scroll";
import Image from "next/image";

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
  const [likes, setLikes] = useState<number | undefined>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [openReply, setOpenReply] = useState(false);
  const [toggleReplies, setToggleReplies] = useState(false);
  const [replies, setReplies] = useState<any>([]);
  const router = useRouter();
  const Comments: { message: Array<IComment> } = useMemo(
    () => JSON.parse(comments),
    [comments]
  );
  useEffect(() => {
    const currentComment = Comments.message.find(
      (comment) => comment._id.toString() === commentId
    );
    if (currentComment) {
      setIsLiked(currentComment.likes?.includes(author) || false);
      setLikes(currentComment.likes?.length);
      setReplies(currentComment?.replies);
    }
  }, [Comments.message, author, commentId]);

  const handleDelete = async () => {
    const confirmDelete = confirm("This Comment will be deleted?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `${baseURL}/api/comment/delete/${commentId + "," + postId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      console.log(data);
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(
        `${baseURL}/api/comment/${isLiked ? "unlike" : "like"}/${commentId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ session }),
        }
      );
      const data: { message: IComment } = await res.json();
      setLikes(data.message.likes?.length);
      setIsLiked(!isLiked);
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
    }
  };
  const { authors }: { authors: { message: Array<IUser> } } = useFetchAuthor(
    `${baseURL}/api/user/getUsers`
  );
  return (
    <>
      {" "}
      <div className="rounded-lg flex justify-evenly items-center p-2">
        {/* Like button */}
        <button
          className="flex gap-1 items-center justify-between"
          onClick={handleLike}
        >
          {likes !== undefined && likes > 0 && (
            <i className="text-sm">{likes}</i>
          )}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "var(--bg-light)" : "currentColor"}
            className="size-6"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </button>
        {/* reply button */}
        {!openReply ? (
          <button
            onClick={() => {
              setOpenReply((prev) => !prev);
              scrollToView("reply");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ) : (
          <button onClick={() => setOpenReply((prev) => !prev)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        {/* Delete button */}
        <button onClick={handleDelete}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        {replies &&
          toggleReplies &&
          replies.map((item: any, index: number) => {
            const foundAuthor = authors?.message.find(
              (author) => author._id?.toString() === item.author.toString()
            );
            const username = foundAuthor?.username;
            const usernameLength = username?.length || 0;
            return (
              <div
                className="p-2 m-2 rounded-lg shadow-md hover:bg-[var(--dark-gray)] w-[50%]"
                key={index}
              >
                <div className="authors flex justify-between items-center">
                  <i className=" text-sm">{foundAuthor?.username}</i>
                  <i className=" text-sm">
                    {timeAgo(new Date(), new Date(item.createdAt))}
                  </i>
                </div>
                <div className="p-2 relative">
                  {item.reply.includes(`@${username}`) ? (
                    <p>
                      <i className="text-[var(--bg-light)] text-[1rem]">
                        {item.reply.slice(0, usernameLength + 1)}
                      </i>
                      <span>{item.reply.slice(usernameLength + 1)}</span>
                    </p>
                  ) : (
                    <p>
                      {item.file.some((file: string) => file) &&
                        item.file.map((file: string) => {
                          return (
                            <div key={file} className="absolute w-[50%] h-[100%] mb-1">
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
                <LikeDelReply
                  commentId={commentId}
                  session={session}
                  openReply={openReply}
                  replyId={item._id.toString()}
                />
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
