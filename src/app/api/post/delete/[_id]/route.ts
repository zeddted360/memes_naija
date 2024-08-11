import { IComment, IContext, IPost, IUser } from "@/app/types/types";
import { comment, post } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { deleteFile } from "@/utils/deleteFile";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, context: IContext) => {
  const { _id } = context.params;

  try {
    await connectDB();
    const res: IPost | null = await post.findByIdAndDelete(_id);
    if (res) {
      if (res.file) {
        await deleteFile(
          res.file?.map((file: string) => file) as Array<string>,
          "public/post"
        );
      }
      return NextResponse.json(
        { message: "Post successfully deleted" },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "error: Resource not find" },
      { status: 404 }
    );
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { message: "error: internal server error" },
      { status: 500}
    );
  }
};
