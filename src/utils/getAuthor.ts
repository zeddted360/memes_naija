// author for server
import { user } from "@/models/model";
import { connectDB } from "./connectDB";

export const getAuthor = async (_id: string) => {
  try {
    await connectDB();
    const author = await user.findOne({ _id });
    return author;
  } catch (error: any) {
    console.log(error.message);
  }
};
