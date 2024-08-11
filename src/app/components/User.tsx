import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import Link from "next/link";

export const fetchAuthor = async (authorId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(
    `http://localhost:3000/api/user/getUser?author=${authorId}`
  );

  return res.json();
};

const User = async ({ authorId }: { authorId: string }) => {
  const author = await fetchAuthor(authorId);
  const { profilePic, username } = author.message;

  return (
    <div className="flex gap-1  aspect-square  justify-center items-center">
      {profilePic && (
        <Link
          className="flex rounded-full gap-2 pr-2  items-center"
          href={`/naija_memes/profile/${author.message._id}`}
        >
          <div className="relative overflow-hidden p-4 border-3 rounded-full ">
            <Image alt="profile pic" fill src={`/profile_pic/${profilePic}`} />
          </div>
          {author && <i> {username}</i>}
        </Link>
      )}
      {!profilePic && (
        <Link href={`/naija_memes/profile/${author.message._id}`}>
          {" "}
          <FontAwesomeIcon style={{ width: 30, height: 30 }} icon={faUser} />
          {author && <i> {username}</i>}
        </Link>
      )}
    </div>
  );
};
export default User;
