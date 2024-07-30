import React, { Suspense } from "react";
import styles from "./postcard.module.css";
import Loading from "./Loading";
import { IPost } from "@/app/types/types";
import Image from "next/image";
import { getImageMimeType } from "@/utils/getImageMimeType";
import { markCurrentScopeAsDynamic } from "next/dist/server/app-render/dynamic-rendering";
import Link from "next/link";

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
    return text.replace(
      globalSearch,
      ` <mark>${term}</mark>`
    );
  };
  if (_id.toString() == "no match")
    return (
      <h1 className="text-2xl text-center font-semi-bold">
        There are no match for this search
      </h1>
    );
  if (!(title && file)) return <Loading />;

  return (
    <div className={styles.postCard}>
      {file?.length != 0 && (
        <div className={styles.mediaContainer}>
          {file?.length !== 0 &&
            file?.map(async (item,index) => {
              // const fileType = await getImageMimeType(item)
              return (
                <div key={index} className={styles?.imgCont}>
                  <Image
                    alt="logo"
                    className={styles.img}
                    src="/images/memesLogo.jpeg"
                    fill
                  />
                  {/* {fileType?.startsWith('image') ? (
 <Image
  className={styles.img}
                      alt='file'
                      src={item}
                      fil
                    />
                   
                  ) : (
                    <video
                      src={item}
                      controls
                    />
                  )} */}
                </div>
              );
            })}
        </div>
      )}
      <div className={styles?.detailsPage}>
        {!isWord ? (
          <h3
            className="text-lg mb-2 font-bold"
            dangerouslySetInnerHTML={{
              __html: markedUi(title, search).slice(0, 50),
            }}
          ></h3>
        ) : (
          <h3 className="text-lg mb-2 font-bold">{title.slice(0, 50)}</h3>
        )}
        {!isWord ? (
          <p
            className="p-2"
            dangerouslySetInnerHTML={{
              __html: markedUi(content, search).slice(0, 50),
            }}
          ></p>
        ) : (
          <p className="p-2">{content.slice(0, 50)}</p>
        )}
        <Link className="underline text-blue-500" href={`/naija_memes/${_id}`}>read more...</Link>
      </div>
    </div>
  );
};

export default PostCard;
