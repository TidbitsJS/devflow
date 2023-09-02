"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { formUrlQuery } from "@/lib/utils";

const filters = ["question", "answer", "user", "tag"];

const GlobalFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const typeParams = searchParams.get("type");

  const [active, setActive] = useState(typeParams || "");

  const handleTypeClick = (item: string) => {
    let newUrl = "";

    if (active === item) {
      setActive("");

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className='flex items-center gap-5 px-5'>
      <p className='subtle-color body-medium'>Type:</p>
      <div className='flex gap-3'>
        {filters.map((item) => (
          <button
            type='button'
            key={item}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize ${
              active === item
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
            }`}
            onClick={() => handleTypeClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
