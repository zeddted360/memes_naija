import { comment, post, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse as res } from "next/server";
import mongoose from "mongoose";
import { uploadFile } from "@/utils/uploadFile";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const username = formData.get("user");
  const postId = formData.get("postId") as string;
  const commentContent = formData.get("comment");
  const files = formData.getAll("files") as Array<File>;
  try {
    connectDB();
    let foundUser = await user.findOne({
      $or: [{ email: username }, { username }],
    });
    if (files.length === 0) {
      const newComment = new comment({
        content: commentContent,
        post: new mongoose.Types.ObjectId(postId),
        author: foundUser._id,
      });
    const comm =  await newComment.save();

      await post.findOneAndUpdate(
        { _id: postId?.toString() },
        {
          $push: { comments: comm._id },
        },
        { new: true }
      );
      return res.json({ message: "Comment uploaded" }, { status: 200 });
    } else {
      // write files to the public folder
      const media = await uploadFile(files, "comment");

      const newComment = new comment({
        content: commentContent,
        post: new mongoose.Types.ObjectId(postId),
        author: foundUser._id,
        file: media,
      });
      const comm = await newComment.save();

      await post.findOneAndUpdate(
        { _id: postId?.toString() },
        {
          $push: { comments: comm._id },
        },
        { new: true }
      );
      return res.json({ message: "Comment uploaded" }, { status: 200 });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.json({ message: "internal server error" }, { status: 200 });
  }
};
