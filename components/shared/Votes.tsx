"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface Params {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
}

const Votes = ({ type, itemId, userId, upvotes }: Params) => {
  const pathname = usePathname();
  const [localUpvotes, setLocalUpvotes] = useState(upvotes);
  const [voted, setVoted] = useState<"upvote" | "downvote" | null>(null);

  useEffect(() => {
    const debouncedVote = setTimeout(async () => {
      if (voted === "upvote") {
        if (type === "Question") {
          await upvoteQuestion({
            itemId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
          });
        } else if (type === "Answer") {
          await upvoteAnswer({
            itemId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
          });
        }
      } else if (voted === "downvote") {
        if (type === "Question") {
          await downvoteQuestion({
            itemId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
          });
        } else if (type === "Answer") {
          await downvoteAnswer({
            itemId: JSON.parse(itemId),
            userId: JSON.parse(userId),
            path: pathname,
          });
        }
      }
    }, 2000); // Debounce time: 2000 milliseconds

    return () => clearTimeout(debouncedVote);
  }, [voted, itemId, pathname, type, userId]);

  const handleVote = (action: "upvote" | "downvote") => {
    if (!voted || voted !== action) {
      setVoted(action);
      setLocalUpvotes(localUpvotes + (action === "upvote" ? 1 : -1));
    }
  };

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <Image
          src='/assets/icons/upvote.svg'
          width={18}
          height={18}
          alt='upvote'
          className={`cursor-pointer`}
          onClick={() => handleVote("upvote")}
        />

        <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
          <p className='subtle-medium text-white'>{localUpvotes}</p>
        </div>

        <Image
          src='/assets/icons/downvote.svg'
          width={18}
          height={18}
          alt='downvote'
          className={`cursor-pointer`}
          onClick={() => handleVote("downvote")}
        />
      </div>
      <Image
        src='/assets/icons/star-red.svg'
        width={18}
        height={18}
        alt='star'
      />
    </div>
  );
};

export default Votes;
