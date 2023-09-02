"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import GlobalFilters from "./GlobalFilters";
import { globalSearch } from "@/lib/actions/general.action";

const GlobalResult = () => {
  const searchParams = useSearchParams();
  const [result, setResult] = useState([]);

  const global = searchParams.get("global");
  const type = searchParams.get("type");

  useEffect(() => {
    const fetchResult = async () => {
      setResult([]);

      try {
        const res = await globalSearch({
          // @ts-ignore
          query: global,
          type,
        });

        setResult(JSON.parse(res));
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    if (global) {
      fetchResult();
    }
  }, [global, type]);

  const renderLink = (type: string, id: string) => {
    switch (type) {
      case "question":
        return `/question/${id}`;
      case "answer":
        return `/question/${id}`;
      case "user":
        return `/profile/${id}`;
      case "tag":
        return `/tags/${id}`;
      default:
        return "/";
    }
  };

  return (
    <div className='absolute top-full z-10 mt-3 w-full rounded-xl bg-light-800 py-5 shadow-sm dark:bg-dark-400'>
      <GlobalFilters />
      <div className='my-5 h-[1px] bg-light-700/50 dark:bg-dark-500/50' />

      <div className='space-y-5'>
        <p className='subtle-color paragraph-semibold px-5'>Top Match</p>

        <div className='flex flex-col gap-2'>
          {result.length > 0 &&
            result.map((item: any, index: number) => (
              <Link
                href={renderLink(item.type, item.id)}
                key={item.type + item.id + index}
                className='flex w-full cursor-pointer items-start gap-3 px-5 py-2.5 hover:bg-light-700/50 dark:hover:bg-dark-500/50'
              >
                <Image
                  src='/assets/icons/tag.svg'
                  alt='tags'
                  width={18}
                  height={18}
                  className='white-black-invert mt-1 object-contain'
                />

                <div className='flex flex-col'>
                  <p className='body-medium text-dl-28 line-clamp-1'>
                    {item.title}
                  </p>
                  <p className='small4-color small-medium mt-1 font-bold capitalize'>
                    {item.type}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default GlobalResult;
