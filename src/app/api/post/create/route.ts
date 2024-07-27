import { post, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import { writeFile } from "fs/promises";
import path from "path";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const content = formData.get("content");
  const author = formData.get("author");

  try {
    connectDB();
    // get author id with email
    const foundAuthor = await user.findOne({ email: author });
    const result = await post.create({
      title,
      content,
      author: new ObjectId(`${foundAuthor._id}`),
    });
    return NextResponse.json({ message: result });
  } catch (err: any) {
    console.log(err.message);
    return NextResponse.json({ message: "internal server error" });
  }
};
