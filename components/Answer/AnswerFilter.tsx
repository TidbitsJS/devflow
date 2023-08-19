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
import { usePathname, useRouter } from "next/navigation";

const filters = [
  { name: "Highest Upvotes", value: "highestUpvotes" },
  { name: "Lowest Upvotes", value: "lowestUpvotes" },
  { name: "Most Recent", value: "recent" },
  { name: "Oldest", value: "old" },
];

interface Params {
  route?: string;
}

function AnswerFilter({ route }: Params) {
  const router = useRouter();
  const pathname = usePathname();

  const handleUpdateParams = (value: string) => {
    console.log(value);
    router.push(`${pathname}/?filter=${value}`);
  };

  return (
    <div className='relative'>
      <Select>
        <SelectTrigger className='small-regular border border-dark-300 bg-dark-300 px-5 py-2.5 text-light-700'>
          <SelectValue
            placeholder='Select a Filter'
            defaultValue={filters[0].value}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Filters</SelectLabel>
            {filters.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                onSelect={() => handleUpdateParams(item.value)}
              >
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
