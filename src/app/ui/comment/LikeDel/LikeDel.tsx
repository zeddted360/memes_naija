"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { baseURL, IComment } from "@/app/types/types";

const LikeDel = ({
  commentId,
  author,
  comments,
  postId,
}: {
  commentId: string;
  author: string;
  comments: string;
  postId: string;
  }) => {
  
  const router = useRouter();
  const Comments: { message: Array<IComment> } = useMemo(
    () => JSON.parse(comments),
    [comments]
  );

  const [likes, setLikes] = useState<number | undefined>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
 
  useEffect(() => {
    const currentComment = Comments.message.find(
      (comment) => comment._id.toString() === commentId
    );
    if (currentComment) {
      setIsLiked(currentComment.likes?.includes(author) || false);
      setLikes(currentComment.likes?.length);
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
      const res = await fetch( `${baseURL}/api/comment/${
        isLiked ? "unlike" : "like"
      }/${commentId}`, {
        method: "PATCH",
        body: JSON.stringify({ author }),
      });
      const data: { message: IComment } = await res.json();
      setLikes(data.message.likes?.length);
      setIsLiked(!isLiked);
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
    }
  };

  return (
    <div className=" border rounded-lg flex justify-between items-center p-2">
      {/* Like button */}
      <button
        className="flex gap-1 items-center justify-center"
        onClick={handleLike}
      >
        {likes !== undefined && <i>{likes}</i>}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isLiked ? "var(--bg-light)" : "currentColor"}
          className="size-6"
        >
          <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
        </svg>
      </button>
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
  );
};

export default LikeDel;
