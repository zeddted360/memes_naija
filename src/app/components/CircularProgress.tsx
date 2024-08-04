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
        <div className="absolute z-[1] w-fit rounded-full left-5 top-2 ">
          <div className="relative w-12 h-12">
            <Progress
              value={uploadProgress}
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="absolute inset-0 hidden items-center font-bold  border justify-center">
            {uploadProgress}%
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
