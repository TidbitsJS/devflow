import Image from "next/image";
import Link from "next/link";

import { Badge } from "../ui/badge";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Question {
  clerkId?: string;
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    clerkId: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  clerkId,
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Question) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <Link
      href={`/question/${_id}`}
      className='dark-gradient rounded-[10px] px-11 py-9 shadow-question-card-dark'
    >
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <h3 className='h3-semibold flex-1 text-white'>{title}</h3>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type='Question' itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Link href={`/tags/${tag._id}`} key={tag._id}>
            <Badge className='subtle-medium bg-dark-300 px-4 py-2 uppercase text-light-500'>
              {tag.name}
            </Badge>
          </Link>
        ))}
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

          <p className='body-medium text-light-700'>
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

            <p className='small-medium text-light-800'>
              {formatNumber(upvotes)}
              <span className='small-regular'> Votes</span>
            </p>
          </div>

          <div className='flex-center gap-1'>
            <Image
              src='/assets/icons/message.svg'
              width={16}
              height={16}
              alt='message icon'
            />

            <p className='small-medium text-light-800'>
              {formatNumber(answers.length)}
              <span className='small-regular'> Answers</span>
            </p>
          </div>

          <div className='flex-center gap-1'>
            <Image
              src='/assets/icons/eye.svg'
              width={16}
              height={16}
              alt='eye icon'
            />

            <p className='small-medium text-light-800'>
              {formatNumber(views)}
              <span className='small-regular'> Views</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default QuestionCard;
