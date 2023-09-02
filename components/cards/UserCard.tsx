import React from "react";
import Link from "next/link";
import Image from "next/image";

import { Badge } from "../ui/badge";
import RenderTag from "../shared/RenderTag";

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
      className='w-full max-xs:min-w-full xs:w-[260px]'
    >
      <article
        key={item._id}
        className='common-background-shade light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8 '
      >
        <Image
          src={item.picture}
          alt='user'
          width={100}
          height={100}
          className='rounded-full'
        />

        <div className='mt-4 text-center'>
          <h3 className='h3-bold heading3-color line-clamp-1'>{item.name}</h3>
          <p className='body-regular body3-color mt-2'>@{item.username}</p>
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          {interactedTags.length > 0 ? (
            interactedTags.map((tag) => (
              <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
            ))
          ) : (
            <Badge className='subtle-medium tag-background-shade tag-color border-none px-4 py-2 uppercase'>
              No tags yet
            </Badge>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
