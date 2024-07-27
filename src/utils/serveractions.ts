"use server";
import { IComment } from "@/app/types/types";
import { comment, user } from "@/models/model";
import { connectDB } from "./connectDB";
import mongoose from "mongoose";

export const DeleteComment = async (formData: FormData) => {
  const commentId = formData.get("commentId");
  try {
    await connectDB();
    await comment.deleteOne({ _id: commentId });
  } catch (error: any) {
    console.log(error.message);
  }
};

export const LikeComment = async (formData: FormData) => {
  const params = formData.get("commentId") as string;
  const commentId = params.split("/")[0];
  const userId = params.split("/")[1];
  try {
    await connectDB();
    let res = await comment.updateOne(
      { _id: commentId },
      {
        $addToSet: {
          likes: new mongoose.Types.ObjectId(userId),
        },
      },
      { new: true }
    );
    console.log(res);
  } catch (error: any) {
    console.log("error: ", error.message);
  }
  // console.log(commentId, userId);
};
