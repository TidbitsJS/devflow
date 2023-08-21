"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const Searchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("q");

  const [search, setSearch] = useState(query || "");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "q",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = formUrlQuery({
            params: searchParams.toString(),
            key: "q",
            value: null,
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route, pathname, router, searchParams, query]);

  return (
    <div
      className={`dark-gradient flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          alt='search'
          width={24}
          height={24}
          className='cursor-pointer'
        />
      )}

      <Input
        type='text'
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='paragraph-regular no-focus border-none text-light-700 outline-none placeholder:text-light-500'
      />

      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          alt='search'
          width={15}
          height={15}
          className='cursor-pointer'
        />
      )}
    </div>
  );
};

export default Searchbar;
