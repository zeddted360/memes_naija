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
import { IComment, Isession } from "@/app/types/types";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { scrollToView } from "@/utils/scroll";

const formSchema = z.object({
  content: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

export function CommentForm({
  session,
  postId,
}: {
  session: Isession;
  postId: number;
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

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
    formData.append("postId", postId.toString());
    formData.append("comment", values.content.trim());
    if (session.user?.email) {
      formData.append("user", session.user?.email);
    } else {
      router.push("/api/auth/signin");
      return;
    }
    if (values.files) {
      for (let i = 0; i < values.files?.length; i++) {
        formData.append("files", values.files[i]);
      }
    }
    // Here you would typically send the data to your server
    try {
      const res = await fetch(`/api/comment/add`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data: { message: string; data: IComment } = await res.json();
      router.refresh();
      //  file upload to firebase

      //   if (values.files) {
      //   let mediaUrls: string[] = [];
      //   await uploadMedia(values.files, mediaUrls, data.message?._id);
      // }

      // Simulating file upload with progress
      const totalSteps = 10;
      for (let i = 1; i <= totalSteps; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
        setProgress((i / totalSteps) * 100);
      }
      // Reset progress after completion
      setTimeout(() => {
        setProgress(0);
        scrollToView(data.data._id.toString());
      }, 1000);
      setLoading(false);
      form.reset();
    } catch (error: any) {
      setLoading(false);
      console.error("error :", error.message);
    }
  }

  return (
    <div className="rounded-lg p-4 border  w-[90%] h-[90%]">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4  w-full h-full flex flex-col  justify-between p-4 rounded-lg"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel></FormLabel>
                <FormControl>
                  <Textarea placeholder="Leave a comment" {...field} />
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
                  <FontAwesomeIcon className="w-1/2 h-4" icon={faImage} />
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
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={progress > 0 || loading} type="submit">
            {loading || progress > 0 ? (
              "Submitting..."
            ) : (
              'Submit'
            )}
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
