"use client";
import { IComment, ICommentClient, Isession } from "@/app/types/types";
import React, { useEffect, useState } from "react";
import { baseURL } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { scrollToView } from "@/utils/scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleUp,
  faComment,
  faHeart,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
    files: [],
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (message) setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
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
      const data: { message: any; data: IComment } = await res.json();
      const replies = data.data.replies;
      if (Array.isArray(replies)) {
        let length = replies.length;
        let reply = replies[length - 1];
        setTimeout(() => {
          setLoading(false);
          scrollToView(`${reply?._id}`);
        }, 2000);
      }
      setMessage(data.message);
      setComment((prev) => ({
        ...prev,
        content: "",
        files: [],
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
      <div className="utilityContainer flex justify-between  ">
        {/* like */}
        <button>
          <FontAwesomeIcon icon={faHeart} />
        </button>
        {/* comment */}
        <button onClick={() => setShowComment((prev) => !prev)}>
          {showComment ? (
            <FontAwesomeIcon icon={faAngleUp} />
          ) : (
            <FontAwesomeIcon icon={faComment} />
          )}
        </button>
        {/* delete */}
        <button>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <br />
      {showComment && <hr />}
      {showComment && (
        <div className="formContainer  mt-2 p-1 bg-[var(--bg-light)] rounded-lg border text-[var(--cl-light)]  w-[100%]">
          <form onSubmit={handleSubmit} className="flex items-center gap-2 ">
            <label htmlFor="files" title="upload photos">
              <FontAwesomeIcon icon={faImage} />
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
