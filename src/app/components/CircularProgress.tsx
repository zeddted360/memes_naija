"use client";
import { Progress } from "@/components/ui/progress";
import React, { useEffect, useState } from "react";

export function CircularProgress({
  searchParams,
}: {
  searchParams: {
    query: string;
    uploading: string;
    uploadComplete: string;
    error: string;
  };
}) {
  const [isUploading, setIsUploading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const { uploading, uploadComplete, error } = searchParams;
  console.log(uploading, uploadComplete);
  useEffect(() => {
    if (uploading === "true") {
      setIsUploading(true);
      const interval = setInterval(() => {
        setUploadProgress((prevProgress: number) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 500);

      return () => clearInterval(interval);
    }

    if (uploadComplete === "true") {
      setIsUploading(false);
      setUploadProgress(100);
    }

    if (error) {
      setIsUploading(false);
      setErrorMessage(decodeURIComponent(error));
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [error, uploadComplete, uploading]);

  return (
    <>
      {
        <div className=" absolute  z-[1] w-full left-0 top-0 ">
          <div className="w-full">
            <Progress className="h-1.5 border" value={uploadProgress} />
          </div>
        </div>
      }
      {errorMessage && (
        <div className="fixed inset-x-0 top-0 p-4 bg-red-500 text-white">
          Error: {errorMessage}
        </div>
      )}
    </>
  );
}
