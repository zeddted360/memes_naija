"use client";
import React, { useState } from "react";
import { IMetaData, IPost } from "../types/types";
import { useRouter } from "next/navigation";
import UploadPost from "../components/UploadPost";
import UploadFile from "../components/UploadFile";
import { uploadMedia } from "@/utils/uploadMedia";
import CircularLoading from "./CircularLoading";
import { revalidatePath } from "next/cache";

export const metadata: IMetaData = {
  title: "Create Post",
};

export default function CreatePost({
  styles,
  session,
}: {
  styles: any;
  session: any;
}) {
  console.log("session is ", session);

  const router = useRouter();
  const [post, setPost] = useState<IPost>({
    title: "",
    content: "",
    author: session?.user?.email,
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);

  const validateInput: () => boolean = () => {
    if (!post.title || !post.content) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStartTime(performance.now());

    const form = event.target as HTMLFormElement;
    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("author", `${post.author}`);

    try {
      const res = await fetch(`/api/post/create`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        setLoading(false);
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      if (selectedFiles) {
        let mediaUrls: string[] = [];
        await uploadMedia(selectedFiles, mediaUrls, data.message?._id);
      }

      setEndTime(performance.now());
      setLoading(false);
      form.reset();
      router.push("/naija_memes/home");
      revalidatePath("/naija_memes/home");
    } catch (error: any) {
      setLoading(false);
      console.error(error.message);
    }
  };

  return (
    <div className={styles.create_container}>
      {!loading && <h2 className="text-lg text-center mb-2">Create Meme</h2>}
      {loading && (
        <CircularLoading
          loading={loading}
          startTime={startTime}
          endTime={endTime}
        />
      )}
      <form onSubmit={handleSubmit}>
        <UploadPost post={post} setPost={setPost} />
        <UploadFile
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
        <button
          disabled={validateInput()}
          className={validateInput() ? styles.disabled : styles.nonDisabled}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
