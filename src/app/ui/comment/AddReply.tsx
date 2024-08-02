import React, { useEffect, useState } from "react";
import {
  baseURL,
  IComment,
  ICommentClient,
  Ireplies,
  Isession,
} from "@/app/types/types";
import { useRouter } from "next/navigation";
import { scrollToView } from "@/utils/scroll";
import { sendFile } from "@/utils/sendFile";
const AddReply = ({
  commentId,
  session,
  setToggleReplies,
  openReply,
}: {
  commentId: string;
  session: Isession;
  setToggleReplies: React.Dispatch<React.SetStateAction<boolean>>;
  openReply: Boolean;
}) => {
  // scrollveiw for form
  useEffect(() => {
    if (openReply) scrollToView("reply");
  }, [openReply]);

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [comment, setComment] = useState<ICommentClient>({
    content: "",
    files: [],
  });
  const [showMessage, setShowMessage] = useState(false);
  let isFormValid = () => {
    if (comment.content) return true;
    return false;
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData();
    formData.append("commentId", commentId);
    formData.append("session", JSON.stringify(session));
    formData.append("content", comment.content);
    sendFile(comment.files, formData);
    try {
      const res = await fetch(`${baseURL}/api/comment/reply/add`, {
        method: "POST",
        body: formData,
      });
      if (!res) {
        throw new Error("something went wrong");
      }
      const data: { message: any; data: IComment } = await res.json();
      const replies = data.data.replies;
      if (Array.isArray(replies)) {
        let length = replies.length;
        let reply = replies[length - 1];
        scrollToView(reply?._id.toString());
        console.log('scrolled')
      }
      setMessage(data.message);
      setLoading(false);
      setComment((prev) => ({
        ...prev,
        content: "",
        files: [],
      }));
      form.reset();
      router.refresh();
      setToggleReplies(true);
    } catch (error: any) {
      console.error("error: ", error.message);
      setLoading(false);
    }
  };

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setComment((prev) => ({ ...prev, content: value }));
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

  return (
    <div className="flex justify-center border rounded-lg ">
      {showMessage && (
        <div
          className={`message absolute p-2 shadow-lg top-[10%] left-[50%] translate-x-[-50%] px-4 rounded-lg text-center  ${
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
      <form
        id="reply"
        onSubmit={handleSubmit}
        className="flex justify-between items-center gap-2 w-3/4 p-4 m-2"
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
          className="border-2 rounded-lg h-[2.5rem] indent-1 text-black"
          required
          type="text"
          name="content"
          value={comment.content}
          onChange={handleText}
          placeholder="Leave a reply"
          autoFocus={openReply ? true : false}
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
              className="size-6 text-[var(--cl-light)]"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
};

export default AddReply;
