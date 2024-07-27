import { baseURL, IComment, IPost, Isession } from "@/app/types/types";
import React from "react";
import Author from "../Author";
import LikeDel from "./LikeDel/LikeDel";

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
    <div className="comment container ">
      {Comments.message.map((item: IComment) => {
        return (
          <div className="rounded-lg border m-2 p-2" key={`${item._id}`}>
            <Author
              createdAt={new Date(`${item.createdAt}`)}
              author={item.author.toString()}
            />
            <p className="p-2">{item.content}</p>
            <LikeDel
              author={item.author.toString()}
              commentId={`${item._id}`}
              postId={postId}
              comments={JSON.stringify(Comments)}
            />
          </div>
        );
      })}
    </div>
  );
};
export default Comments;
