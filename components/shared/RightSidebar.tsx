import Image from "next/image";
import React from "react";

import { Badge } from "../ui/badge";
import { hotNetworkQuestion } from "@/constants";
import { getTopPopularTags } from "@/lib/actions/tag.action";
import Link from "next/link";

const RightSidebar = async () => {
  const popularTags = await getTopPopularTags();

  return (
    <section className='sticky right-0 top-0 flex h-screen w-[330px] flex-col gap-6 overflow-y-auto bg-dark-200/50 p-6 pt-36 max-xl:hidden'>
      <div>
        <h2 className='h3-bold text-white'>Hot Network</h2>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {hotNetworkQuestion.map(({ question, id }) => (
            <div
              key={id}
              className='flex cursor-pointer items-center justify-between gap-7'
            >
              <p className='body-medium text-light-700'>{question}</p>

              <Image
                src='/assets/icons/chevron-right.svg'
                alt='Chevron right icon'
                width={20}
                height={20}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-16'>
        <h2 className='h3-bold text-white'>Popular Tags</h2>
        <div className='mt-7 flex flex-col gap-4'>
          {popularTags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className='flex justify-between gap-2'
            >
              <Badge className='subtle-medium rounded-md bg-dark-300 px-4 py-2 uppercase text-light-500'>
                {tag.name}
              </Badge>

              <p className='small-medium text-light-700'>
                {tag.questions.length}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
