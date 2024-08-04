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
} from "@fortawesome/free-solid-svg-icons";

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
        <Button
          variant={"outline"}
          className="flex gap-1 items-center justify-between"
          onClick={handleLike}
        >
          {likes !== undefined && likes > 0 && (
            <i className="text-sm">{likes}</i>
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
          handledelete={handleDelete}
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
            <FontAwesomeIcon icon={faAngleDown} />
          ) : (
            <FontAwesomeIcon icon={faAngleUp} />
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
                id={`${item._id}`}
                className="p-2 m-2 rounded-lg shadow-md hover:bg-[var(--dark-gray)] w-[50%]"
                key={index}
              >
                <div className="authors flex justify-between items-center">
                  <Link href={`/naija_memes/profile/${foundAuthor?._id}`}>
                    {" "}
                    <i className=" text-sm">{foundAuthor?.username}</i>
                  </Link>
                  <i className=" text-sm">
                    {timeAgo(new Date(), new Date(item.createdAt))}
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
