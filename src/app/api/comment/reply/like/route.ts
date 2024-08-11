import { IUser } from "@/app/types/types";
import { comment, user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { commentId, session, replyId } = await req.json();
  try {
    await connectDB();
    const foundUser: IUser = (await user.findOne({
      email: session.user.email,
    })) as IUser;

    if (!foundUser) {
      return NextResponse.json(
        { message: "error: internal server error" },
        { status: 400 }
      );
    }

    const updatedComment = await comment.findOneAndUpdate(
      {
        _id: commentId,
        "replies._id": replyId,
      },
      {
        $addToSet: {
          "replies.$.likes": foundUser._id,
        },
      },
      { new: true }
    );
    if (!updatedComment) {
      return NextResponse.json(
        { message: "Comment or reply not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: updatedComment }, { status: 200 });
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { message: "error: internal server error" },
      { status: 500 }
    );
  }
};
