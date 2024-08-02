import { IPost } from "@/app/types/types";
import { post } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    await connectDB();
    const resource: Array<IPost> = await post.find({});
    if (resource.length > 0) {
      return NextResponse.json({ message: resource }, { status: 200 });
    } else {
      const fillArray = ["", "", "", ""];
      return NextResponse.json(
        { message: fillArray.fill("No resource found") },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.log("error: ", error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
};
