import React, { useEffect, useState } from "react";

const RepliedAuthors = ({
  replyData,
   authorId,
}: {
  replyData: Array<object>;
   authorId: string;
}) => {
  const [authors, setAuthors] = useState([]);
  console.log(authors);
  useEffect(() => {
    async function getAuthor() {
      const getAllRepliedAuthors = await Promise.all(
        replyData.map(async (item: any) => {
          const authorIds = item.author;
          const res = await fetch(`http://localhost:3000/api/repliedusers`, {
            next: {
              revalidate: 0,
            },
          });
          const data = await res.json();
          setAuthors(data);
        })
      );
    }
    getAuthor();
  }, [replyData]);

  console.log("where", authors);
  return (
    <div>
      {authors  &&
        authors.map((item: any) => (
          <div key={item._id}>
            {item._id.toString() ===  authorId.toString() && (
              <i>{item.author}</i>
            )}
          </div>
        ))}
    </div>
  );
};

export default RepliedAuthors;
