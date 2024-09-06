import React from "react";
import Image from "next/image";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faCommentAlt,
  faMessage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const getprofile = async (_id: string) => {
  const res = await fetch(`http://localhost:3000/api/profile/${_id}`);
  return res.json();
};

const page = async ({ params }: { params: { _id: string } }) => {
  const { _id } = params;
  const user = await getprofile(_id);
  return (
    <div className="w-full h-screen p-2 ">
      <div className="img  p-2">
        {
          <div className="relative aspect-square border-2 rounded-full md:mx-auto overflow-hidden md:max-w-md md:max-h-md">
            {!user.message.profilePic ? (
              <FontAwesomeIcon className={`w-fit  h-fit`} icon={faUser} />
            ) : (
              <Link
                href={`/profile_pic/${
                  user.message.profilePic ? user.message.profilePic : ""
                }`}
              >
                <Image
                  className="object-cover"
                  fill
                  alt="profilepic"
                  src={`/profile_pic/${user.message.profilePic}`}
                />
              </Link>
            )}
          </div>
        }
        <div className="flex mx-2 items-center justify-between gap-2">
          <h1 className="text-2xl font-bold">{user.message.username}</h1>
          <Link href={"/naija_memes/chat/"+_id}>
            <FontAwesomeIcon className="h-6 w-6" icon={faComment} />
          </Link>
        </div>
        <hr />
        <p>
          email
          <i className="ml-2 text-xs">{user.message.email}</i>
        </p>
        <p className="text-sm">
          Joined
          <i className="ml-2 text-xs">
            {" "}
            {timeAgo(new Date(), new Date(user.message.createdAt))}
          </i>
        </p>
      </div>
    </div>
  );
};

export default page;
