import React from "react";
import styles from "@/app/ui/create.module.css";
import { auth } from "@/../../auth";
import { redirect } from "next/navigation";
import { BlogUploadForm } from "@/app/ui/form/BlogUploadForm";
import { Isession } from "@/app/types/types";

export const metadata = {
  title: "Add Post",
  description: "Naija_memes Create Post",
};

export default async function Create() {
  const session:Isession = await auth() as Isession;
  if (!session) redirect("/api/auth/signin");

  return (
    <div className={'h-screen flex justify-center items-center '}>
      <BlogUploadForm session={session} />
    </div>
  );
}
