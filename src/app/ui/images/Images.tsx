"use client";
import { IComment } from "@/app/types/types";
import React, { useState } from "react";
// import Image from "next/image";

const Images = ({ item }: { item: IComment }) => {
  const [showMore, setShowMore] = useState(false);

  const hasFile = item.file?.some((file) => file !== null);

  const visibleFiles = showMore ? item.file : item.file?.slice(0, 2);
  return (
    <div
      style={{
        display: !item.file?.some((file) => file !== null) ? "none" : "flex",
      }}
      className="image md:flex-nowrap flex-wrap w-[100%] border p-1  justify-center items-center gap-1 rounded-lg"
    >
      {hasFile &&
        visibleFiles?.map((file: string) => {
          return (
            <div
              className="imgContainer  p-1 overflow-hidden rounded-lg w-full h-[9em] relative"
              key={file}
            >
              {/* <Image fill alt="img comments" src={`/comment/${file}`} /> */}
              <p>images here</p>
            </div>
          );
        })}
      {item.file && item.file.length > 4 && (
        <button
          className="mt-2 px-2 py-1 bg-[var(--bg-light)] font-sm text-white rounded-lg"
          onClick={() => setShowMore((prev) => !prev)}
        >
          {showMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export default Images;
