"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";
import { viewQuestion } from "@/lib/actions/interaction.action";
import { formatNumber } from "@/lib/utils";

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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: JSON.parse(userId),
    });

    router.refresh();
  }, [itemId, userId, pathname, router]);

  const handleVote = async (action: string) => {
    if (action === "upvote" && hasupVoted) {
      return toast({
        title: "Already upvoted",
        description: `You have already upvoted this ${type}`,
      });
    }

    if (action === "downvote" && hasdownVoted) {
      return toast({
        title: "Already downvoted",
        description: `You have already downvoted this ${type}`,
      });
    }

    if (action === "upvote") {
      if (type === "Question") {
        return await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path: pathname,
        });
      } else if (type === "Answer") {
        return await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path: pathname,
        });
      }
    }

    if (action === "downvote") {
      if (type === "Question") {
        return await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path: pathname,
        });
      } else if (type === "Answer") {
        return await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          path: pathname,
        });
      }
    }
  };

  return (
    <div className='flex gap-5'>
      <div className='flex-center gap-2.5'>
        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            width={18}
            height={18}
            alt='upvote'
            className='cursor-pointer'
            onClick={() => handleVote("upvote")}
          />

          <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
            <p className='subtle-medium text-white'>{formatNumber(upvotes)}</p>
          </div>
        </div>

        <div className='flex-center gap-1.5'>
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            width={18}
            height={18}
            alt='downvote'
            className='cursor-pointer'
            onClick={() => handleVote("downvote")}
          />

          <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
            <p className='subtle-medium text-white'>
              {formatNumber(downvotes)}
            </p>
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
