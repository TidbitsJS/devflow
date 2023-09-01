"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import GlobalResult from "./GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(false);

  // query after 0.3s of no input
  //   useEffect(() => {
  //     const delayDebounceFn = setTimeout(() => {
  //       if (search) {
  //         const newUrl = formUrlQuery({
  //           params: searchParams.toString(),
  //           key: "gloabl",
  //           value: search,
  //         });

  //         router.push(newUrl, { scroll: false });
  //       } else {
  //         // do something
  //       }
  //     }, 300);

  //     return () => clearTimeout(delayDebounceFn);
  //   }, [search, pathname, router, searchParams, query]);

  return (
    <div className='relative w-full max-w-[600px] max-lg:hidden'>
      <div className='search-background-shade relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4'>
        <Image
          src='/assets/icons/search.svg'
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer'
        />

        <Input
          type='text'
          placeholder='Search anything globally...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className='paragraph-regular no-focus placeholder input-color border-none shadow-none outline-none'
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
