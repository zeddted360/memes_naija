import * as React from "react";
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
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { scrollToView } from "@/utils/scroll";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const formSchema = z.object({
  content: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  files: z.array(z.instanceof(File)).optional(),
});

export function FormDrawer({
  session,
  postId,
  commentId,
}: {
  commentId: string;
  session: Isession;
  postId: string;
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
    formData.append("commentId", commentId);
    formData.append("content", values.content);
    if (session.user?.email) {
      formData.append("session", JSON.stringify(session));
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
      const res = await fetch(`/api/comment/reply/add`, {
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
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay
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
    <div className=" md:hidden">
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline">
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
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[50%]">
          <div className="mx-auto w-full max-w-sm">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4  w-full h-[100%] flex flex-col justify-between pt-8 rounded-lg"
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Textarea
                          cols={5}
                          rows={1}
                          placeholder="Leave a comment"
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
                      <FormDescription className="text-center">
                        you can upload multple Images or videos
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={progress > 0 || loading} type="submit">
                  {loading || progress > 0 ? "Submitting..." : "Submit"}
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                {progress > 0 && (
                  <div className="m-2 w-[100%]">
                    <Progress value={progress} className="w-full h-1" />
                  </div>
                )}
              </form>
            </Form>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
