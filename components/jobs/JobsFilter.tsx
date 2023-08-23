"use client";

import { formUrlQuery } from "@/lib/utils";
import { Country } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Searchbar from "../shared/Searchbar";

interface JobsFilterProps {
  countriesList: Country[];
}

const JobsFilter = ({ countriesList }: JobsFilterProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "location",
      value,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className='relative mt-11 flex w-full gap-5 sm:items-center'>
      <Searchbar
        route={pathname}
        iconPosition='left'
        imgSrc='/assets/icons/job-search.svg'
        placeholder='Job Title, Company, or Keywords'
        otherClasses='flex-1'
      />

      <Select onValueChange={(value) => handleUpdateParams(value)}>
        <SelectTrigger className='paragraph-regular light-border tag-background-shade body2-color min-h-[56px] max-w-[250px] border p-4'>
          <div className='flex items-center gap-3'>
            <Image
              src='/assets/icons/carbon-location.svg'
              alt='location'
              width={18}
              height={18}
            />

            <SelectValue placeholder='Select Location' />
          </div>
        </SelectTrigger>

        <SelectContent className='body-semibold max-h-[350px] max-w-[250px]'>
          <SelectGroup>
            {countriesList ? (
              countriesList.map((country: Country) => (
                <SelectItem
                  key={country.name.common}
                  value={country.name.common}
                  className='px-4 py-3'
                >
                  {country.name.common}
                </SelectItem>
              ))
            ) : (
              <SelectItem value='No results found'>No results found</SelectItem>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobsFilter;
