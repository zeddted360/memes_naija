import React from "react";
import Image from "next/image";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const getprofile = async (_id: string) => {
  const res = await fetch(`http://localhost:3000/api/profile/${_id}`);
  return res.json();
};
const page = async ({ params }: { params: { _id: string } }) => {
  const { _id } = params;
  const user = await getprofile(_id);
  return (
    <div className="w-full h-fit p-2">
      <div className="img  p-2">
        <Link href={`/profile_pic/${user.message.profilePic}`}>
          <Image
            className="rounded-full border-2 object-cover"
            width={400}
            height={400}
            alt="profilepic"
            src={`/profile_pic/${user.message.profilePic}`}
          />
        </Link>
        <h1 className="text-2xl font-bold">{user.message.username}</h1>
        <hr />
        <p>
          <i className="mr-2">
            <FontAwesomeIcon icon={faUser} />
          </i>
          {user.message.email}
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
