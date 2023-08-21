"use client";

import { formUrlQuery } from "@/lib/utils";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";

interface Props {
  pageNumber: number;
  isNext: boolean;
  path: string;
}

function Pagination({ pageNumber, isNext, path }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (type: string) => {
    let nextPageNumber = pageNumber;

    if (type === "prev") {
      nextPageNumber = Math.max(1, pageNumber - 1);
    } else if (type === "next") {
      nextPageNumber = pageNumber + 1;
    }

    if (nextPageNumber > 1) {
      // router.push(`/${path}?page=${nextPageNumber}`);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: nextPageNumber.toString(),
      });

      router.push(newUrl);
    } else {
      // router.push(`/${path}`);

      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: null,
      });

      router.push(newUrl);
    }
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className='flex-between w-full items-center gap-1'>
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className='flex min-h-[36px] items-center justify-center gap-2 border border-dark-400 bg-dark-300'
      >
        <Image
          src='/assets/icons/arrow-left.svg'
          alt='arrow left'
          width={20}
          height={20}
          className='object-contain'
        />

        <p className='body-medium text-light-800'>Previous</p>
      </Button>

      <div className='primary-gradient flex min-w-[40px] items-center justify-center rounded-lg p-3'>
        <p className='body-semibold text-dark-400'>{pageNumber}</p>
      </div>

      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className='flex min-h-[36px] items-center justify-center gap-2 border border-dark-400 bg-dark-300'
      >
        <p className='body-medium text-light-800'>Next</p>

        <Image
          src='/assets/icons/arrow-right.svg'
          alt='arrow left'
          width={20}
          height={20}
          className='object-contain'
        />
      </Button>
    </div>
  );
}

export default Pagination;
