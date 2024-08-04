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
    <span className="flex gap-1 justify-center items-center">
      {profilePic ? (
        <Link
          className="flex gap-2  items-center"
          href={`/naija_memes/profile/${author.message._id}`}
        >
          <Image
            alt="profile pic"
            width={30}
            height={30}
            className="rounded-full"
            src={`/profile_pic/${profilePic}`}
          />
          {author && <i> {username}</i>}
        </Link>
      ) : (
        <Link href={`/naija_memes/profile/${author._id}`}>
          {" "}
          <FontAwesomeIcon style={{ width: 30, height: 30 }} icon={faUser} />
          {author && <i> {username}</i>}
        </Link>
      )}
    </span>
  );
};
export default User;
