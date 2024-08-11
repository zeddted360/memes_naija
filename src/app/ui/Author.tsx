import { user } from "@/models/model";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { IUser } from "../types/types";
import Image from "next/image";
const getAuthor = async (author: string) => {
  return await user.findOne({ _id: author });
};
const Author = async ({
  author,
  createdAt,
}: {
  author: string;
  createdAt: any;
}) => {
  const Author: IUser = await getAuthor(author);
  return (
    <div className="flex justify-between gap-2 text-sm">
      <Link
        className="flex gap-x-2"
        href={`/naija_memes/profile/${Author._id}`}
      >
        <div className="flex  border-2 justify-center items-center  relative aspect-square  w-8 h-8 overflow-hidden rounded-full">
          {Author.profilePic ? (
            <Image
              className="object-cover"
              alt="imageProfile"
              src={`/profile_pic/${Author.profilePic}`}
              fill
            />
          ) : (
            <FontAwesomeIcon  icon={faUser} />
          )}
        </div>
        <i>{Author.username}</i>
      </Link>
      <i>{timeAgo(new Date(), createdAt)}</i>
    </div>
  );
};

export default Author;
