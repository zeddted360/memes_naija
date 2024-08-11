import React, { Suspense } from "react";
import styles from "./home.module.css";
import Link from "next/link";
import Search from "@/app/components/Search";
import { IPost, Isession } from "@/app/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import { auth } from "../../../../auth";
import PostCardSkeleton from "@/app/ui/PostCardSkeleton";
import { CircularProgress } from "@/app/components/CircularProgress";
const PostCard = dynamic(() => import("@/app/components/PostCard"), {
  ssr: false,
});

const getPosts = async (url: String) => {
  const res = await fetch(`${url}`, {
    next: {
      revalidate: 0,
    },
  });
  return res.json();
};

const Home = async ({ searchParams }: { searchParams: any }) => {
  const { query, uploading } = searchParams;

  let href: String;
  query
    ? (href = `http://localhost:3000/api/post/getPosts?${query}`)
    : (href = "http://localhost:3000/api/post/getPosts");

  const posts = await getPosts(href);
  let words: string[] = [posts?.words] || [""];

  const session:any = await auth();

  return (
    <div className={styles.MainHome}>
      {uploading === "true" && <CircularProgress searchParams={searchParams} />}
      <div className={styles.homeHead}>
        {session && (
          <i className="text-sm font-semibold border rounded-lg p-2 mr-1">
            {  session?.user?.email?.split("@")[0].length <= 15
              ? session.user?.email?.split("@")[0]
              : session.user?.email?.split("@")[0].slice(0, 15)}
          </i>
        )}
        <Search />
        <Link
          className="flex items-center jusutify-center px-1"
          href="/naija_memes/post"
        >
          <i className="text-sm font-semibold flex items-center justify-center border rounded-lg p-2">
            <FontAwesomeIcon
              className="mr-1"
              style={{ width: 20, height: 20 }}
              icon={faPen}
            />
            Post
          </i>
        </Link>
      </div>
      <div className={styles.home}>
        {posts.message
          ? posts?.message?.map((post: IPost) => (
              <PostCard key={`${post?._id}`} {...post} words={words} />
            ))
          : "abcdefghi"
              .split(" ")
              .map((skeleton) => <PostCardSkeleton key={skeleton} />)}
      </div>
    </div>
  );
};

export default Home;
