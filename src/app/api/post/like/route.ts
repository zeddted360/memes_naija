import { IUser } from "@/app/types/types";
import { post,user } from "@/models/model";
import { connectDB } from "@/utils/connectDB";
import { NextRequest, NextResponse as res } from "next/server";

export const PATCH = async (req: NextRequest) => {
  const { id, user:User } = await req.json();
  try {
    await connectDB();
    const foundUser:IUser | null = await user.findOne({ email: User });
    if (!foundUser) {
       return res.json(
         { message: "Error: Ineternal server error" },
         { status: 404 }
       );
    }
    // console.log(foundUser)
      const response = await post.findOneAndUpdate(
        { _id: id },
        { $addToSet: { likes: foundUser._id } },
        { new: true }
      )
  return res.json({ message:"success", data:response }, { status: 200 });

  } catch (error: any) {
      console.log("error: ", error.mnessgae);
  return res.json({ message: "Error: Ineternal server error", }, { status: 500 });
      
  }

};
