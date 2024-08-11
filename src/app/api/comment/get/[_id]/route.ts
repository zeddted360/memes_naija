import { IContext } from "@/app/types/types";
import { comment } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: IContext) => {
  const { _id } = context.params;
  console.log(_id);
  try {
    await connectDB();
    const res = await comment
      .find({ $or: [{ post: _id }, {_id: _id }] })
      .sort({ createdAt: -1 });
    return NextResponse.json({ message: res }, { status: 200 });
  } catch (error: any) {
    console.log("error: ", error.message);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
};
