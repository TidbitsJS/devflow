import Image from "next/image";
import Link from "next/link";

import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Props {
  clerkId?: string;
  _id: string;
  question: {
    _id: string;
    title: string;
  };
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  createdAt: Date;
}

const AnswerCard = ({
  clerkId,
  _id,
  question,
  author,
  upvotes,
  createdAt,
}: Props) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <Link
      href={`/question/${question._id}/#${_id}`}
      className='card-wrapper rounded-[10px] px-11 py-9'
    >
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <h3 className='h3-semibold heading3-color line-clamp-1 flex-1'>
          {question.title}
        </h3>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type='Answer' itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Link href={`/profile/${author.clerkId}`} className='flex-center gap-1'>
          <Image
            src={author.picture}
            className='rounded-full'
            width={18}
            height={18}
            alt='user avatar'
          />

          <p className='body-medium body-color'>
            {author.name}
            <span className='small-regular'>
              • asked {getTimeStamp(createdAt)}
            </span>
          </p>
        </Link>

        <div className='flex-center gap-3'>
          <div className='flex-center gap-1'>
            <Image
              src='/assets/icons/like.svg'
              width={16}
              height={16}
              alt='like icon'
            />

            <p className='small-medium small-color'>
              {formatNumber(upvotes)}
              <span className='small-regular'> Votes</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AnswerCard;
