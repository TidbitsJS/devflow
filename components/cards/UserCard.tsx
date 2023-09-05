import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

import { truncateTag } from "@/lib/utils";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface Props {
  item: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({ item }: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: item._id });

  return (
    <Link
      href={`/profile/${item.clerkId}`}
      className='shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]'
    >
      <article
        key={item._id}
        className='background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 '
      >
        <Image
          src={item.picture}
          alt='user'
          width={100}
          height={100}
          className='rounded-full'
        />

        <div className='mt-4 text-center'>
          <h3 className='h3-bold text-dark200_light900 line-clamp-1'>
            {item.name}
          </h3>
          <p className='body-regular text-dark500_light500 mt-2'>
            @{item.username}
          </p>
        </div>

        <div className='mt-5'>
          {interactedTags.length > 0 ? (
            <div className='flex items-center gap-2'>
              {interactedTags.map((tag) => (
                <RenderTag
                  key={tag._id}
                  _id={tag._id}
                  name={truncateTag({
                    name: tag.name,
                    total: interactedTags.length,
                  })}
                />
              ))}
            </div>
          ) : (
            <Badge className='subtle-medium background-light800_dark300 text-light400_light500 border-none px-4 py-2 uppercase'>
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
