import { user } from "@/models/model";
import { timeAgo } from "@/utils/timeAgo";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
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
  const Author = await getAuthor(author);
  return (
    <div className="flex justify-between gap-2 text-sm">
      <Link
        className="flex gap-x-2"
        href={`/naija_memes/profile/${Author._id}`}
      >
        <FontAwesomeIcon icon={faUser} />
        <i>{Author.username}</i>
      </Link>
      <i>{timeAgo(new Date(), createdAt)}</i>
    </div>
  );
};

export default Author;
