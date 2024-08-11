import User from "@/app/components/User";
import React, { Suspense } from "react";
import { timeAgo } from "@/utils/timeAgo";
import AuthorLoading from "@/app/ui/AuthorLoading";
import { auth } from "@/../../auth";
import { baseURL, IPost, Isession } from "@/app/types/types";
import Comments from "@/app/ui/comment/Comments";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommentForm } from "@/app/ui/form/CommentForm";
import Showmore from "@/app/ui/Showmore";
import Utility from "@/app/ui/Utility";
const fetchPost = async (_id: number) => {
  const res = await fetch(`${baseURL}/api/post/getPost/${_id}`, {
    next: {
      revalidate: 60,
    },
  });
  return res.json();
};

export const generateStaticParams = async () => {
  const res = await fetch(`${baseURL}/api/post/getPostsForParams`);
  const data = await res.json();
  return data.message.map((post: any) => ({ _id: post._id }));
};

export default async function Post({ params }: { params: { _id: number } }) {
  const { _id } = params;
  const post: { message: IPost } = await fetchPost(_id);
  const { file } = post.message;
  const session: Isession = (await auth()) as Isession;
  return (
    <Card className="w-full h-full md:w-3/4 my-2 mx-auto p-2  border">
      <div className="border rounded-md">
        <CardHeader className="p-2 ml-4">
          <div className="flex justify-between items-center mb-4">
            <Suspense fallback={<AuthorLoading />}>
              <User authorId={`${post.message.author}`} />
            </Suspense>
            <CardDescription>
              {timeAgo(new Date(), new Date(`${post.message.createdAt}`))}
            </CardDescription>
          </div>
          <CardTitle className="">{post.message.title}</CardTitle>
        </CardHeader>
        <CardContent className="w-full mx-auto">
          {file && file.length > 0 && <Showmore file={file} />}
          <p className="leading-relaxed mb-6">{post.message.content}</p>
          <div className="mt-8">
            <Utility
              session={ session && session.user.email}
              params={JSON.stringify({ post: post.message })}
            />
            <Comments postId={`${_id}`} session={session} />
          </div>
        </CardContent>
      </div>
      <CardFooter
        id="comment-form"
        className="flex justify-center mt-4 flex-col gap-2"
      >
        <CommentForm postId={_id} session={session} />
      </CardFooter>
    </Card>
  );
}
