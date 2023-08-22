import React from "react";
import Image from "next/image";

import { Badge } from "../ui/badge";
import { getTopInteractedTags } from "@/lib/actions/tag.action";
import Link from "next/link";

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
    <Link href={`/profile/${item.clerkId}`}>
      <article
        key={item._id}
        className='flex w-fit flex-col items-center justify-center rounded-2xl border border-dark-300 bg-dark-200 p-8'
      >
        <Image
          src={item.picture}
          alt='user'
          width={100}
          height={100}
          className='rounded-full'
        />

        <div className='mt-4 text-center'>
          <h3 className='h3-bold text-white'>{item.name}</h3>
          <p className='body-regular mt-2 text-light-500'>@{item.username}</p>
        </div>

        <div className='mt-5 flex flex-wrap gap-2'>
          {interactedTags.map((tag) => (
            <Link key={tag._id} href={`/tags/${tag._id}`}>
              <Badge className='subtle-medium px-4 py-2 uppercase text-light-500 bg-dark-300'>
                {tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
