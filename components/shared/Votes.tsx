"use client";

import Image from "next/image";
import { useState } from "react";
// import { usePathname } from "next/navigation";

interface Params {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  hasupVoted: boolean;
  downvotes: number;
  hasdownVoted: boolean;
}

const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  hasupVoted,
  downvotes,
  hasdownVoted,
}: Params) => {
  // const pathname = usePathname();
  const [localUpVotes, setLocalUpVotes] = useState(upvotes);
  const [localDownVotes, setLocaDownVote] = useState(downvotes);

  const handleVote = (action: string) => {
    if (action === "upvote" && hasupVoted) return;
    if (action === "downvote" && hasdownVoted) return;

    if (action === "upvote") {
      setLocalUpVotes(upvotes + 1);
    }

    if (action === "downvote") {
      setLocaDownVote(downvotes - 1);
    }
  };

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image
            src='/assets/icons/upvote.svg'
            width={18}
            height={18}
            alt='upvote'
            className='cursor-pointer'
            onClick={() => handleVote("upvote")}
          />

          <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
            <p className='subtle-medium text-white'>{localUpVotes}</p>
          </div>
        </div>

        <div className='flex-center gap-1.5'>
          <Image
            src='/assets/icons/downvote.svg'
            width={18}
            height={18}
            alt='downvote'
            className='cursor-pointer'
            onClick={() => handleVote("downvote")}
          />

          <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
            <p className='subtle-medium text-white'>{localDownVotes}</p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src='/assets/icons/star-red.svg'
          width={18}
          height={18}
          alt='star'
        />
      )}
    </div>
  );
};

export default Votes;
