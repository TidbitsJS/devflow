"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { HomePageFilters } from "@/constants/filters";

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
    <div className='mt-10 hidden flex-wrap gap-3 md:flex'>
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
            active === item.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          }`}
          onClick={() => handleTypeClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilters;
