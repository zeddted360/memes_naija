"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { IPost, Isession } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { AlertErr } from "../AlertErr";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

export function BlogUploadForm({ session }: { session: Isession }) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("content", values.content);
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
      // Start the upload
      const uploadPromise = fetch("/api/post/create", {
        method: "POST",
        body: formData,
      });

      // Navigate to home page immediately
      router.push("/naija_memes/home?uploading=true");

      // Continue with the upload in the background
      const res = await uploadPromise;

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data: { message: string; data?: IPost } = await res.json();
      console.log(data);

      if (data.message.includes("Error:")) {
        // Handle error on the home page
        router.push(
          "/naija_memes/home?error=" + encodeURIComponent(data.message)
        );
      } else {
        // Upload complete, update the home page
        router.push("/naija_memes/home?uploadComplete=true");
      }
    } catch (error: any) {
      console.error("error :", error.message);
      // Handle error on the home page
      router.push(
        "/naija_memes/home?error=" + encodeURIComponent(error.message)
      );
    }
  }

  return (
    <div className="relative rounded-lg p-4 shadow-2xl w-[70%] h-[80%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full h-full flex flex-col justify-between p-4 rounded-lg"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter blog title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your blog content here"
                    {...field}
                  />
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

          <Button disabled={progress > 0 || loading} type="submit">
            {loading || progress > 0 ? "Uploading..." : "Upload"}
          </Button>

          {progress > 0 && (
            <div className="m-2 w-[100%]">
              <Progress value={progress} className="w-full h-1" />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
