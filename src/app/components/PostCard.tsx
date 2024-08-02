import React from "react";
import Image from "next/image";
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
import styles from "./postcard.module.css";
import { IPost, IUser } from "@/app/types/types";
import { getAuthor } from "@/utils/getAuthor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
  const fetchedAuthor:IUser = await getAuthor(author.toString());

  return (
    <Card className="flex flex-col justify-between ">
      <CardHeader>
        <CardTitle className="text-lg">
          {!isWord ? (
            <span
              dangerouslySetInnerHTML={{
                __html: markedUi(title, search).slice(0, 50),
              }}
            />
          ) : (
            title.slice(0, 50)
          )}
        </CardTitle>
        <CardDescription>
          <FontAwesomeIcon icon={faUser} /> <i>{fetchedAuthor.username}</i>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-md" >
        {file?.length !== 0 && (
          <div className={styles.mediaContainer}>
            {file?.map((item, index) => (
              <div key={index}>
                <Image
                  alt="logo"
                  className='{styles.img}'
                  src="/images/memesLogo.jpeg"
                  fill
                />
              </div>
            ))}
          </div>
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
          <Button>Read more...</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
