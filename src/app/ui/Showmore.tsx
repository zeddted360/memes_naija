"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Showmore = ({ file }: { file: string[] }) => {
  const [files, setFiles] = useState<string[]>(
    file?.length > 4 ? file.slice(0, 4) : file
  );

  const handleShow = () => {
    setFiles((prev) => (prev.length === 4 ? file : file.slice(0, 4)));
  };
const router = useRouter()
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-2">
        {files?.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className={`aspect-square relative overflow-hidden rounded-sm ${
              files.length === 1 ? "col-span-2" : ""
            }`}
          >
            {item.split(".")[1] === "mp4" ? (
              <video
                className="absolute  inset-0 w-full h-full object-cover"
                controls
                src={"/post/" + item}
              ></video>
            ) : (
                <Image
                  onClick={() => router.push("/post/" + item)}
                  alt="post"
                  src={"/post/" + item}
                  className="object-cover cursor-pointer"
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
            )}
          </div>
        ))}
      </div>
      {files.length >= 4 && file.length > 4 && (
        <Button className="mt-2 w-full" variant="outline" onClick={handleShow}>
          {files.length === 4 ? (
            <FontAwesomeIcon icon={faAngleDown} />
          ) : (
            <FontAwesomeIcon icon={faAngleUp} />
          )}{" "}
        </Button>
      )}
    </div>
  );
};

export default Showmore;
