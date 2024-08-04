import { post, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextResponse, NextRequest } from "next/server";
import mongoose from "mongoose";
import { uploadFile } from "@/utils/uploadFile";
const { ObjectId } = mongoose.Types;

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const { title, content, author } = Object.fromEntries(formData);
  const files = formData.getAll("files") as File[];

  const acceptedTypes = ["png", "jpeg", "jpg", "webp", "mp4"];

  if (files.length > 0) {
    for (const file of files) {
      const fileExtension = file.name.split(".").pop()?.toLowerCase() as string;
      if (!acceptedTypes.includes(fileExtension)) {
        return NextResponse.json({
          message: "Error: File format not accepted",
        });
      }
    }

    // If all files are accepted, upload them
    try {
      const fileArr = await uploadFile(files, "/post");
      const foundAuthor = await user.findOne({ email: author });
      if (!foundAuthor) {
        return NextResponse.json(
          { message: "Error: Author not found" },
          { status: 404 }
        );
      }
      const result = await post.create({
        title,
        content,
        author: new ObjectId(foundAuthor._id),
        file: fileArr,
      });
      return NextResponse.json({
        message: "Post created successfully",
        post: result,
      });
    } catch (error) {
      console.error("File upload error:", error);
      return NextResponse.json(
        { message: "Error: File upload failed" },
        { status: 500 }
      );
    }
  }

  try {
    await connectDB();
    // get author id with email
    const foundAuthor = await user.findOne({ email: author });
    if (!foundAuthor) {
      return NextResponse.json(
        { message: "Error: Author not found" },
        { status: 404 }
      );
    }

    const result = await post.create({
      title,
      content,
      author: new ObjectId(foundAuthor._id),
    });

    return NextResponse.json({
      message: "Post created successfully",
      post: result,
    });
  } catch (err: any) {
    console.error("Error creating post:", err.message);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
