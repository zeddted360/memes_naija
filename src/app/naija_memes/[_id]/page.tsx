
import User from "@/app/components/User";
import React, { Suspense } from "react";
import Image from "next/image";
import { timeAgo } from "@/utils/timeAgo";
import AuthorLoading from "@/app/ui/AuthorLoading";
import { auth } from "@/../../auth";
import { baseURL, IPost, Isession } from "@/app/types/types";
import AddComment from "@/app/ui/comment/AddComment";
import Comments from "@/app/ui/comment/Comments";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
  const session: Isession = (await auth()) as Isession;

  return (
    <Card className="w-full max-w-4xl mx-auto my-8 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <Suspense fallback={<AuthorLoading />}>
            <User authorId={`${post.message.author}`} />
          </Suspense>
          <CardDescription>
            {timeAgo(new Date(), new Date(`${post.message.createdAt}`))}
          </CardDescription>
        </div>
        <CardTitle className="text-2xl font-bold">
          {post.message.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {post.message.file && post.message.file.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            {post.message.file.map((item, index) => (
              <Image
                key={index}
                width={300}
                height={200}
                alt={`Post image ${index + 1}`}
                src={item}
                className="rounded-lg object-cover"
              />
            ))}
          </div>
        )}
        <p className="text-gray-700 leading-relaxed mb-6">
          {post.message.content}
        </p>
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>
          <Comments postId={`${_id}`} session={session} />
        </div>
      </CardContent>
      <CardFooter>
        <AddComment postId={_id} session={session} />
      </CardFooter>
    </Card>
  );
}