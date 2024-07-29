"use client";
import { ICommentClient, Isession } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import { baseURL } from "@/app/types/types";
import { useRouter } from "next/navigation";

const LikeDelReply = ({
  openReply,
  commentId,
  session,
  replyId,
}: {
  openReply: Boolean;
  commentId: string;
  session: Isession;
  replyId: string;
}) => {
  const [showComment, setShowComment] = useState<Boolean>(false);
  const [showMessage, setShowMessage] = useState<Boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [comment, setComment] = useState<ICommentClient>({
    content: "",
    files: null,
  });
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (message) setShowMessage(true);
  }, [message]);

  const [error, setError] = useState("");
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment((prev) => ({ ...prev, content: value }));
  };
  const router = useRouter();
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
  let isFormValid = () => {
    if (comment.content) return true;
    return false;
  };
  const handleDelete = async () => {};

  const handleLike = async () => {};

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    formData.append("commentId", commentId);
    formData.append("session", JSON.stringify(session));
    formData.append("replyId", replyId);
    try {
      const res = await fetch(`${baseURL}/api/comment/reply/add`, {
        method: "POST",
        body: formData,
      });
      if (!res) {
        throw new Error("something went wrong");
      }
      const data: { message: string } = await res.json();
      setMessage(data.message);
      setLoading(false);
      setComment((prev) => ({
        ...prev,
        content: "",
        files: null,
      }));
      form.reset();
      router.refresh();
    } catch (error: any) {
      console.error("error: ", error.message);
      setLoading(false);
    }
  };

  return (
    <div className="likedel flex flex-col justify-center  p-2">
      {showMessage && (
        <div
          className={`message absolute p-2 shadow-lg top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] px-4 rounded-lg text-center  ${
            message.includes("error")
              ? "bg-red-200 text-red-800"
              : "text-lg bg-green-200  text-green-800"
          }`}
        >
          {!message.includes("error") && (
            <input type="checkbox" readOnly defaultChecked={true} />
          )}
          <span className="m-1">{message}</span>
        </div>
      )}
      <div className="utilityContainer flex justify-between ">
        {" "}
        {/* like */}
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
          </svg>
        </button>
        {/* comment */}
        <button onClick={() => setShowComment((prev) => !prev)}>
          {showComment ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M5.337 21.718a6.707 6.707 0 0 1-.533-.074.75.75 0 0 1-.44-1.223 3.73 3.73 0 0 0 .814-1.686c.023-.115-.022-.317-.254-.543C3.274 16.587 2.25 14.41 2.25 12c0-5.03 4.428-9 9.75-9s9.75 3.97 9.75 9c0 5.03-4.428 9-9.75 9-.833 0-1.643-.097-2.417-.279a6.721 6.721 0 0 1-4.246.997Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        {/* delete */}
        <button>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <br />
      {showComment && <hr />}
      {showComment && (
        <div className="formContainer  mt-2 p-1 bg-[var(--bg-light)] rounded-lg border text-[var(--cl-light)]  w-[100%]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 ">
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
              className="text-black rounded-lg h-[2rem] w-[90%] indent-1  "
              required
              type="text"
              name="content"
              value={comment.content}
              onChange={handleText}
              placeholder="reply"
              autoFocus={showComment ? true : false}
            />
            <button
              disabled={!isFormValid()}
              className={
                isFormValid()
                  ? `bg-[--bg-light] rounded-lg px-1 text-white`
                  : " rounded-lg px-1 text-slate-500"
              }
              type="submit"
            >
              {loading ? (
                "Submitting... "
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6  text-[var(--cl-light)]"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
      {error && (
        <div className="bg-red-200 text-[crimson] border text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default LikeDelReply;
