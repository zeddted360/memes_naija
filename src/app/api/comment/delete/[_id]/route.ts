import { IComment, IContext, IPost } from "@/app/types/types";
import { comment, post } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, context: IContext) => {
  const { _id } = context.params;
  const commentId = _id.split(",")[0];
  const postId = _id.split(",")[1];
  try {
    await connectDB();
      const res: IComment | null = await comment.findByIdAndDelete(commentId);
      if (res) {
     const Post: IPost = (await post.findOneAndUpdate(
       { _id: postId },
       { $pull: { comments: res?._id } }
          )) as IPost;
    return NextResponse.json({ message: "Comment Deleted" }, { status: 200 });
      }
     
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { message: "error: internal server error" },
      { status: 301 }
    );
  }
};
