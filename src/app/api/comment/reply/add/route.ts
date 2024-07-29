
import { Ireplies, Isession, IUser } from "@/app/types/types";
import { comment, user } from "@/models/model";
import { uploadFile } from "@/utils/uploadFile";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const { commentId, session, content, replyId } = Object.fromEntries(formData);
  const Session: Isession = JSON.parse(session as any);
  const files = formData.getAll("files") as Array<File>;
  const isFile = files.some((file: File) => file.name !== "");
  const foundAuthor = await user.findOne({ email: Session.user.email });

  try {
    if (isFile) {
      const upload = await uploadFile(files, "comment/replies");
      if (replyId) {
        const findReply = await comment
          .findOne({ _id: commentId })
          .select("replies");
        const replyAuthor: Ireplies = findReply.replies.find(
          (reply: Ireplies) => reply.author
        );
        if (replyAuthor) {
          const author: IUser = (await user.findOne({
            _id: replyAuthor.author,
          })) as IUser;
          await comment.updateOne(
            { _id: commentId },
            {
              $push: {
                replies: {
                  author: foundAuthor._id,
                  reply: `@${author.username} ${content}`,
                  file: upload,
                },
              },
            },
            { new: true }
          );
        }
      } else {
        await comment.updateOne(
          { _id: commentId },
          {
            $push: {
              replies: {
                author: foundAuthor._id,
                reply: content,
                file: upload,
              },
            },
          },
          { new: true }
        );
      }
    } else if (replyId) {
      const findReply = await comment
        .findOne({ _id: commentId })
        .select("replies");
      const replyAuthor: Ireplies = findReply.replies.find(
        (reply: Ireplies) => reply.author
      );
      if (replyAuthor) {
        const author: IUser = (await user.findOne({
          _id: replyAuthor.author,
        })) as IUser;
        await comment.updateOne(
          { _id: commentId },
          {
            $push: {
              replies: {
                author: foundAuthor._id,
                reply: `@${author.username} ${content}`,
              },
            },
          },
          { new: true }
        );
      }
    } else {
      await comment.updateOne(
        { _id: commentId },
        {
          $push: {
            replies: {
              author: foundAuthor._id,
              reply: content,
            },
          },
        },
        { new: true }
      );
    }

    return NextResponse.json({ message: "reply received" });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: "error: internal server error" });
  }
};
