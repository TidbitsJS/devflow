"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const filters = [
  { name: "Highest Upvotes", value: "highestUpvotes" },
  { name: "Lowest Upvotes", value: "lowestUpvotes" },
  { name: "Most Recent", value: "recent" },
  { name: "Oldest", value: "old" },
];

function AnswerFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramsFilter = searchParams.get("filter");
  const paramsPage = searchParams.get("page");

  const handleUpdateParams = (value: string) => {
    router.push(`${pathname}/?page=${paramsPage || 1}&filter=${value}`, {
      scroll: false,
    });
  };

  return (
    <div className='relative'>
      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={paramsFilter || filters[0].value}
      >
        <SelectTrigger className='small-regular border border-dark-300 bg-dark-300 px-5 py-2.5 text-light-700'>
          <SelectValue placeholder='Select a Filter' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filters</SelectLabel>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default AnswerFilter;
