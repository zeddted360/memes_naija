import { baseURL, IComment, IPost } from "@/app/types/types";
import React, { useEffect, useState } from "react";

const useFetch = (url: string) => {
  const [resource, setResource] = useState<IPost | IComment | null>(null);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data: IPost | IComment | null) => setResource(data))
      .catch((err: any) => console.log(err.message));
  }, [url]);
  return { resource, setResource };
};

export default useFetch;
