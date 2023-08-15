"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "next/navigation";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  classname?: string;
}

const Searchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  classname,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/${route}?q=` + search);
      } else {
        router.push(`${pathname}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, route]);

  return (
    <div
      className={`dark-gradient flex min-h-[56px] max-w-[600px] grow items-center gap-4 rounded-[10px] px-4 ${classname}`}
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
