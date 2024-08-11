import { IComment, Ireplies } from "@/app/types/types";
import { comment } from "@/models/model";
import { NextResponse as res, NextRequest as req } from "next/server";

export interface ICommentSave extends IComment {
  save: () => Promise<void>;
}
export const PATCH = async (request: req) => {
  const { commentId, replyId } = await request.json();

  try {
    const result: ICommentSave = (await comment.findOneAndUpdate(
      {
        _id: commentId,
      },
      {
        $pull: { replies: { _id: replyId } },
      },

      { new: true }
    )) as ICommentSave;
    return res.json({ messgae: "reply deleted" }, { status: 200 });
  } catch (error: any) {
    console.log(error.message);
  }
};
