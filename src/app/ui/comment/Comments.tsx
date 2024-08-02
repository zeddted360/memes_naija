import { baseURL, IComment, IPost, Isession } from "@/app/types/types";
import React from "react";
import Author from "../Author";
import LikeDel from "./LikeDel/LikeDel";
import Image from "next/image";
import Images from "../images/Images";

const getComments = async (post_id: string) => {
  const res = await fetch(`${baseURL}/api/comment/get/${post_id}`);
  return res.json();
};

const Comments = async ({
  postId,
  session,
}: {
  postId: string;
  session: Isession;
}) => {
  const Comments: { message: Array<IComment> } = await getComments(postId);
  return (
    <div className="comment container min-w-[70%] md:w-full">
      {Comments.message.map((item: IComment) => {
        return (
          <div
            id={item._id.toString()}
            className="rounded-lg border m-2 p-2"
            key={`${item._id}`}
          >
            <Author
              createdAt={new Date(`${item.createdAt}`)}
              author={item.author.toString()}
            />
            <p className="p-2">{item.content}</p>
            <Images item={item} />
            <LikeDel
              author={item.author.toString()}
              commentId={`${item._id}`}
              postId={postId}
              comments={JSON.stringify(Comments)}
              session={session}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Comments;
