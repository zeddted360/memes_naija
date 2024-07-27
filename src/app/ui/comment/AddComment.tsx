"use client";
import { ICommentClient, Isession } from "@/app/types/types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AddComment = ({
  session,
  postId,
}: {
  session: Isession;
  postId: number;
}) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [comment, setComment] = useState<ICommentClient>({
    content: "",
    files: null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (message) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 2000);
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    if (!session.user) {
      return;
    }
    const form = e.target as HTMLFormElement;

    const formData = new FormData(form);
    formData.append("user", `${session?.user.email}`);
    formData.append("postId", `${postId}`);
    formData.append("comment", comment.content);
    try {
      const res = await fetch(`/api/comment/add`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      form.reset();
      router.refresh();
      setMessage(data.message);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
      setError("error: something went wrong");

      setError("");
    }
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    let acceptedFiles = e.target.accept.split(",");
    let files = e.target.files as FileList;
    let isInvalidType: Boolean = Array.from(files).some((file: File) => {
      let mimetype = file.type.split("/")[1];
      return acceptedFiles.includes(mimetype);
    });
    if (!isInvalidType) {
      setError("File format not supported");
      return;
    }
    setComment((prev: ICommentClient) => ({
      ...prev,
      files: files,
    }));
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment((prev) => ({ ...prev, content: value }));
  };
  return (
    <div className="addComment">
      {showMessage && (
        <div
          className={`message absolute p-2 shadow-lg top-[10%] left-[50%] translate-x-[-50%] px-4 rounded-lg text-center  ${
            message.includes("error")
              ? "bg-red-200 text-red-800"
              : "text-lg bg-green-200  text-green-800"
          }`}
        >
        { !message.includes('error') && <input type="checkbox" readOnly defaultChecked={true} />}
          <span className="m-1">{message}</span>
        </div>
      )}
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-between items-center gap-2 w-3/4 p-4"
      >
        <label htmlFor="files" title="upload photos">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
        <input
          multiple
          type="file"
          name="files"
          className="hidden"
          id="files"
          accept="png,jpeg,jpg,webp,3gp,mp4"
          onChange={handleFile}
        />
        <input
          className="border-2 rounded-lg h-[2.5rem] indent-1"
          required
          type="text"
          name="content"
          onChange={handleText}
        />
        <button
          disabled={comment.content === "" || loading}
          className={
            comment.content && `bg-[--bg-light] rounded-lg px-1 text-white`
          }
          type="submit"
        >
          {loading ? "Submitting... " : "Submit"}
        </button>
      </form>
      {error && (
        <div className="bg-red-200 rounded-lg text-red-700 text-sm border text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddComment;
