"use client";

import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

const filters = ["newest", "recommended", "frequent", "unanswered"];

const HomeFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filterParams = searchParams.get("filter");

  const [active, setActive] = useState(filterParams || "");

  const handleTypeClick = (item: string) => {
    let newUrl = "";

    if (active === item) {
      setActive("");

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className='mt-10 flex flex-wrap gap-3'>
      {filters.map((item) => (
        <Button
          key={item}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          onClick={() => handleTypeClick(item)}
        >
          {item}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
