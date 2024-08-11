import { IComment, Ireplies, Isession, IUser } from "@/app/types/types";
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
  console.log("its comming here", replyId);
  try {
    if (isFile) {
      //when there is a file
      console.log("there is a file");
      const upload = await uploadFile(files, "comment/reply");
      if (replyId) {
        console.log("when there are both reply id's and a file");
        //when there is a file and replyId
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
          const res:IComment = await comment.findOneAndUpdate(
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
          ) as IComment;
          return NextResponse.json({ message:"reply received",data:res });
        }
      } else {
        console.log("when there is no reply id but there is a file");
        // when there is no reply Id but there is a file
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
      // when there is reply Id and no file
      console.log("when there is reply id and no file");
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

       let res =  await comment.findOneAndUpdate(
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
         return NextResponse.json({ message: "reply received", data: res });
      }
    } else {
      // when there is no file and reply id
      console.log("no file and reply id");
      let res=await comment.findOneAndUpdate(
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
       return NextResponse.json({ message: "reply received", data: res });
    }

    return NextResponse.json({ message: "reply received" });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: "error: internal server error" });
  }
};
