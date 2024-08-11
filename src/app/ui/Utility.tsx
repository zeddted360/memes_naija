"use client";
import { Button } from "@/components/ui/button";
import { faComment, faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import { IPost, IUser } from "../types/types";
import mongoose from "mongoose";
import { useFetchAuthor } from "@/context/useFetchAuthor";
import { useRouter } from "next/navigation";
import { Alert } from "./Alert";


const Utility = ({ params, session }: { params: string; session: string }) => {
  const router = useRouter();
  
  const resource: { post: IPost } = useMemo(() => JSON.parse(params), [params]);
  const [likes, setLikes] = useState<mongoose.Types.ObjectId[] | undefined>();
  const { post } = resource;
  const [data, setData] = useState<IPost | undefined>();

  useEffect(() => {
    if (post) {
      setData(post);
      setLikes(post.likes);
    }
  }, [resource, post]);
  const { authors }: { authors: { message: IUser[] } } =
    useFetchAuthor(`/api/user/getUsers`);
  // find the user from the authors array with the session(email) to get it _id;
  let foundUser: any;
  if (authors) {
    foundUser = authors.message.find((user: IUser) => user.email === session);
  }
  const isLiked: () => boolean = () => {
    let isLiked = likes?.find(
      (item) => item.toString() === foundUser._id.toString()
    );
    if (!isLiked) return false;
    return true;
  };

  const handleLike = (liked: boolean) => {
    if (!foundUser) return;
    fetch(`/api/post/${liked ? "unlike" : "like"}`, {
      method: "PATCH",
      body: JSON.stringify({ id: data && data._id, user: session }),
    })
      .then((res) => res.json())
      .then((data: { message: string; data: IPost }) => {
        setLikes(data.data.likes);
      })
      .catch((err: any) => console.log(err.message));
  };

  const handleDelete = () => {
    let _id = post._id?.toString();
    if (_id) {
      fetch(`/api/post/delete/${_id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err: any) => console.log(err.message));
    }
    router.push('/naija_memes/home');
  };
  return (
    <div className="flex justify-between gap-4 mb-4">
      {post && (
        <>
          <Button
            onClick={() => handleLike(isLiked())}
            className={`flex ${
              likes?.includes(foundUser?._id) ? "text-blue-500" : ""
            } items-center gap-2`}
            variant="outline"
          >
            {likes && likes.length > 0 && <i className="text-sm">{likes.length}</i>}
            <FontAwesomeIcon icon={faHeart} />{" "}
          </Button>
          <a href="#comment-form">
            <Button variant="outline">
              <FontAwesomeIcon icon={faComment} />
            </Button>
          </a>
          <Alert handledelete={async()=>handleDelete()} title="This post will be deleted" warning="This cannot be undone once deleted"/>
        </>
      )}
    </div>
  );
};

export default Utility;
