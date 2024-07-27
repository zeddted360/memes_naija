"use client"

import { useEffect,useState } from "react";

export const useFetchAuthor = (url: string) => {
    const [authors, setAuthors] = useState<any>(null);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
            setAuthors(data);
            })
            .catch((err: any) => console.error(err.message));
        
    }, [url])
    
    return { authors };
}
