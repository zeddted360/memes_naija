import { IContext, IPost } from "@/app/types/types";
import { comment, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, context: IContext) => {
  const { _id } = context.params;
  const { author } = await req.json();
  try {
    await connectDB();
    const foundAuthor = await user.findOne({ _id: author });
    if (foundAuthor) {
      const res = await comment.findOneAndUpdate(
        { _id },
        {
          $addToSet: { likes: foundAuthor._id },
        },
        { new: true }
      );
      return NextResponse.json({ message: res }, { status: 200 });
    }
    throw new Error("error: Please login to continue");
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { message: "error: internal server error" },
      { status: 301 }
    );
  }
};
