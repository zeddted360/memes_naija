import React, { Suspense } from "react";
import styles from "./home.module.css";
import Link from "next/link";
import Search from "@/app/components/Search";
import { IPost } from "@/app/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
import { auth } from "../../../../auth";
import PostCardSkeleton from "@/app/ui/PostCardSkeleton";
import { post } from "@/models/model";
const PostCard = dynamic(() => import("@/app/components/PostCard"), {
  ssr: true,
});

const getPosts = async (url: String) => {
  const res = await fetch(`${url}`, {
    next: {
      revalidate: 0,
    },
  });
  return res.json();
};

const Home = async ({ searchParams }: { searchParams: { query: String } }) => {
  const { query } = searchParams;
  let href: String;
  query
    ? (href = `http://localhost:3000/api/post/getPosts?${query}`)
    : (href = "http://localhost:3000/api/post/getPosts");


  const posts = await getPosts(href);
  let words: string[] = [posts?.words] || [""];

  const session = await auth();

  return (
    <div className={styles.MainHome}>
      <div className={styles.homeHead}>
        {session && (
          <i className="text-sm font-semibold border rounded-lg p-2">
            {session.user?.email}
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
          :
          "abcdefghi".split(" ").map((skeleton) => <PostCardSkeleton key={skeleton} />)
        }
      </div>
    </div>
  );
};

export default Home;
