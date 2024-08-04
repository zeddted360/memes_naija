"use client";
import { IComment, ICommentClient, Isession } from "@/app/types/types";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendFile } from "@/utils/sendFile";
import { scrollToView } from "@/utils/scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

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
    files: [],
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!session.user) {
      setError("User session not found. Please log in.");
      setLoading(false);
      return;
    }

    if (!comment.content.trim()) {
      setError("Comment cannot be empty.");
      setLoading(false);
      return;
    }

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData();
    formData.append("user", session.user.email);
    formData.append("postId", postId.toString());
    formData.append("comment", comment.content.trim());

    try {
      sendFile(comment.files, formData);

      const res = await fetch(`/api/comment/add`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: { message: string; data: IComment } = await res.json();

      if (!data.data || !data.data._id) {
        throw new Error("Invalid response data");
      }

      const commentId = data.data._id.toString();
      setMessage("Comment added successfully!");

      // Reset form and refresh
      setComment(prev => ({
        ...prev,
        content: "", files: []
      }));
      form.reset();
      router.refresh();

      // Scroll to new comment after a short delay
      setTimeout(() => {
        scrollToView(commentId);
      }, 2000);
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      setError(
        error.message || "An error occurred while submitting the comment."
      );
    } finally {
      setLoading(false);
    }
  };
 

  return (
    <div className="addComment bg-red-500">
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
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-between items-center gap-2 w-3/4 p-4"
      >
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
          className="border-2 rounded-lg h-[2.5rem] indent-1"
          required
          type="text"
          name="content"
          value={comment.content}
          onChange={handleText}
          placeholder="Leave a comment"
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
