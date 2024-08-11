import { user } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  const _id = context.params._id;
  console.log('the id is ',_id)
  try {
    const result = await user.findById(_id);
    if (result) {
      return NextResponse.json({ message: result }, { status: 201 });
    }
    return NextResponse.json({ message: "user not found" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
};
