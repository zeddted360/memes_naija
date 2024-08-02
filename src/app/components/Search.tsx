'use client';
import React, { useState } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showSearch,setShowSearch] =useState(true)
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
      console.log('waited');
    } else {
      params.delete('query');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <Input
        onChange={(e) => handleSearch(e.target.value)}
        type="text"
        defaultValue={searchParams.get("query")?.toString()}
        onFocus={() => setShowSearch(false)}
        onBlur={() => setShowSearch(true)}
      />
      <div className="absolute inset-y-0 left-[5%] top-[5%] pl-3 flex items-center ">
        {showSearch && <FontAwesomeIcon icon={faSearch} />}
      </div>
    </div>
  );
};

export default Search;
