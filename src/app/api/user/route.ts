import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { connectDB } from "@/utils/connectDB";
import { user } from "@/models/model";
import { auth } from "../../../../auth";
import { upLoadProfilePic } from "@/utils/uploadProfilePic";

export const POST = auth(async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password") as string;

  const file: File | null = formData.get("profilePic") as File;

  if (file) {
    const profilePic = await upLoadProfilePic(file);
    try {
      connectDB();
      const existUser = await user.findOne({ $or: [{ username }, { email }] });
      if (existUser) {
        return NextResponse.json({ message: "User already exist" });
      }
      const result = await user.create({
        username,
        email,
        password,
        profilePic: profilePic,
      });
      return NextResponse.json({ message: "User created" });
    } catch (err: any) {
      console.log(err.message);
      return NextResponse.json({ message: " internal server error" });
    }
  } else {
    try {
      connectDB();
      const existUser = await user.findOne({ $or: [{ username }, { email }] });
      if (existUser) {
        return NextResponse.json({ message: "User already exist" });
      }
      const result = await user.create({
        username,
        email,
        password,
      });
      return NextResponse.json({ message: "User created" });
    } catch (err: any) {
      console.log(err.message);
      return NextResponse.json({ message: " internal server error" });
    }
  }

});
