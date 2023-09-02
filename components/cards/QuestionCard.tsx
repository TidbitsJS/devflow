import Link from "next/link";
import Image from "next/image";
import { SignedIn } from "@clerk/nextjs";

import { Badge } from "../ui/badge";
import { formatNumber, getTimeStamp } from "@/lib/utils";

import EditDeleteAction from "../shared/EditDeleteAction";

export interface QuestionProps {
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
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <div className='card-wrapper rounded-[10px] px-11 py-9'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <Link href={`/question/${_id}`}>
          <h3 className='h3-semibold heading3-color line-clamp-1 flex-1'>
            {title}
          </h3>
        </Link>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type='Question' itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Link href={`/tags/${tag._id}`} key={tag._id}>
            <Badge className='subtle-medium tag-background-shade tag-color border-none px-4 py-2 uppercase'>
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

          <p className='body-medium body-color'>
            {author.name}
            <span className='small-regular ml-0.5'>
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

          <div className='flex-center gap-1'>
            <Image
              src='/assets/icons/message.svg'
              width={16}
              height={16}
              alt='message icon'
            />

            <p className='small-medium small-color'>
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

            <p className='small-medium small-color'>
              {formatNumber(views)}
              <span className='small-regular'> Views</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
