import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IPost, IUser } from "@/app/types/types";
import { getAuthor } from "@/utils/getAuthor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";
const Showmore = dynamic(() => import("../ui/Showmore"),{ssr:false});
interface IWord extends IPost {
  words: string[];
}

const PostCard = async ({
  _id,
  title,
  author,
  content,
  file,
  words,
}: IWord) => {
  const isWord = words.some((word) => word == undefined);
  let search = words.join(" ");
  let globalSearch = new RegExp(search, "igm");
  const markedUi = (text: string, term: string) => {
    return text.replace(globalSearch, ` <mark>${term}</mark>`);
  };

  if (`${_id}` == "no match") {
    return (
      <h1 className="text-2xl text-center font-semi-bold">
        There are no matches for this search
      </h1>
    );
  }
  const fetchedAuthor: IUser = await getAuthor(author.toString());

  return (
    <Card className="flex flex-col justify-between ">
      <CardHeader>
        <CardTitle className="text-lg text-secondary-foreground">
          {!isWord ? (
            <span
              dangerouslySetInnerHTML={{
                __html: markedUi(title, search).slice(0, 50),
              }}
            />
          ) : (
            title?.slice(0, 50)
          )}
        </CardTitle>
        <CardDescription>
          <FontAwesomeIcon icon={faUser} /> <i>{fetchedAuthor.username}</i>
        </CardDescription>
      </CardHeader>
      <CardContent className={`rounded-sm ${file && file.length > 0 && 'border'} grid gap-2 p-1`}>
        {file && file.length > 0 && (
            <Showmore file={file} />
        )}
        <div className="{styles?.detailsPage}">
          {!isWord ? (
            <p
              className="p-2"
              dangerouslySetInnerHTML={{
                __html: markedUi(content, search).slice(0, 50),
              }}
            />
          ) : (
            <p className="p-2">{content.slice(0, 50)}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href={`/naija_memes/${_id}`}>
          <Button className="mt-8">Read more...</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
