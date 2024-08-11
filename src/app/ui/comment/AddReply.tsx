import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile, faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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
    if (comment.content) return false;
    return true;
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
        return;
      }
      const data: { message: any; data: IComment } = await res.json();
      const replies = data.data.replies;
      if (Array.isArray(replies)) {
        let length = replies.length;
        let reply = replies[length - 1];
        if(reply._id) scrollToView(reply?._id.toString());
        console.log("scrolled");
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
        className="flex  justify-between items-center gap-2 w-3/4 p-4 m-2"
      >
        <label htmlFor="files" title="upload photos">
          <FontAwesomeIcon className="h-10 w-10" icon={faImage} />
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
          disabled={isFormValid()}
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
            <FontAwesomeIcon className="h-10 w-10" icon={faPaperPlane} />
          )}
        </button>
      </form>
    </div>
  );
};

export default AddReply;
