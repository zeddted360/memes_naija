import { comment, post, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse, NextResponse as res } from "next/server";
import mongoose from "mongoose";
import { uploadFile } from "@/utils/uploadFile";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const { user: User, postId, comment: Comment } = Object.fromEntries(formData);
  const files = formData.getAll("files") as Array<File>;
  try {
    connectDB();
    let foundUser = await user.findOne({
      $or: [{ email: User }, { User }],
    });
    if (files.length === 0) {
      const newComment = new comment({
        content: Comment,
        post: new mongoose.Types.ObjectId(postId.toString()),
        author: foundUser._id,
      });
      let res = await newComment.save();

      await post.findOneAndUpdate(
        { _id: postId?.toString() },
        {
          $push: { comments: res._id },
        },
        { new: true }
      );
      return NextResponse.json(
        { message: "Comment uploaded", data: res },
        { status: 200 }
      );
    } else {
      // write files to the public folder
      const media = await uploadFile(files, "comment");

      const newComment = new comment({
        content: Comment,
        post: new mongoose.Types.ObjectId(postId.toString()),
        author: foundUser._id,
        file: media,
      });
      let res = await newComment.save();

      await post.findOneAndUpdate(
        { _id: postId?.toString() },
        {
          $push: { comments: res._id },
        },
        { new: true }
      );
      return NextResponse.json(
        { message: "Comment uploaded", data: res },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log("error : ", error.message);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 200 }
    );
  }
};
