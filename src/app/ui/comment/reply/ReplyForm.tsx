"use client";
import {
  IComment,
  ICommentClient,
  Ireplies,
  Isession,
} from "@/app/types/types";
import React, { useState, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { scrollToView } from "@/utils/scroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AlertErr } from "../../AlertErr";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

const ReplyForm = ({
  commentId,
  session,
  replyId,
  setMessage,
  setShowMessage,
  handleToggleReply,
}: {
  commentId: string;
  session: Isession;
  replyId: string;
  setMessage: Dispatch<SetStateAction<string>>;
  setShowMessage: Dispatch<SetStateAction<Boolean>>;
  handleToggleReply: (_id: string) => void;
}) => {
  const [loading, setLoading] = useState<Boolean>(false);
  const [comment, setComment] = useState<ICommentClient>({
    content: "",
    files: [],
  });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const router = useRouter();

  // fecth the comment with the id

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
  let isFormValid = () => {
    if (comment.content) return true;
    return false;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("content", values.content);
    formData.append("commentId", commentId);
    formData.append("replyId", replyId);
    formData.append("session", JSON.stringify(session));

    if (session.user?.email) {
      formData.append("author", session.user?.email);
    } else {
      router.push("/api/auth/signin");
      return;
    }
    if (values.files) {
      for (let i = 0; i < values.files?.length; i++) {
        formData.append("files", values.files[i]);
      }
    }
    try {
      const res = await fetch("/api/comment/reply/add", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
        return;
      }

      const data: { message: any; data: IComment } = await res.json();
      setComment((prev) => ({
        ...prev,
        content: "",
        files: [],
      }));
      form.reset();
      handleToggleReply(replyId);
      setShowMessage(true);
      setMessage("Reply added successfully");
      router.refresh();
      setTimeout(() => {
        setLoading(false);
        setShowMessage(false);
        const replies: Ireplies[] | undefined = data.data.replies;
        if (replies) {
          let length = replies.length;
          let reply = replies[length - 1];
          if (reply._id) scrollToView(reply._id.toString());
        }
      }, 1000);
    } catch (error: any) {
      console.error("error :", error.message);
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="likedel  flex flex-col justify-center p-2">
      <hr />
      <div className="formContainer  mt-2 p-1 bg-[var(--bg-light)] rounded-lg border text-[var(--cl-light)]  w-[100%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full h-full flex flex-col justify-between p-4 rounded-lg"
          >
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Leave a reply" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    htmlFor="files"
                    className="flex justify-center items-center"
                  >
                    <FontAwesomeIcon className="w-1/2 h-8" icon={faImage} />
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="hidden"
                      id="files"
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          field.onChange(Array.from(files));
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    You can upload multiple files.
                    {error && <AlertErr title={error} />}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={progress > 0} type="submit">
              {loading || progress > 0 ? "Sending..." : "Send"}
            </Button>

            {progress > 0 && (
              <div className="m-2 w-[100%]">
                <Progress value={progress} className="w-full h-1" />
              </div>
            )}
          </form>
        </Form>
      </div>
      {error && (
        <div className="bg-red-200 text-[crimson] border text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default ReplyForm;
