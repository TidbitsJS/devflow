"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

interface Props {
  pageNumber: number;
  isNext: boolean;
}

function Pagination({ pageNumber, isNext }: Props) {
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
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "page",
        value: nextPageNumber.toString(),
      });

      router.push(newUrl);
    } else {
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
    <div className='flex w-full items-center justify-center gap-2'>
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
      >
        <p className='body-medium text-dl-28'>Prev</p>
      </Button>

      <div className='flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold text-light-900'>{pageNumber}</p>
      </div>

      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className='light-border-2 btn flex min-h-[36px] items-center justify-center gap-2 border'
      >
        <p className='body-medium text-dl-28'>Next</p>
      </Button>
    </div>
  );
}

export default Pagination;
