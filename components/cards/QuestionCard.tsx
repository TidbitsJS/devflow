import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

import { Metric } from "../shared/Generic";
import RenderTag from "../shared/RenderTag";
import EditDeleteAction from "../shared/EditDeleteAction";

import { formatNumber, getTimeStamp } from "@/lib/utils";

export interface QuestionProps {
  clerkId?: string | null;
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
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
            {getTimeStamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>
              {title}
            </h3>
          </Link>
        </div>

        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type='Question' itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <Metric
          imgUrl={author.picture}
          alt='user avatar'
          value={author.name}
          title={` • asked ${getTimeStamp(createdAt)}`}
          href={`/profile/${author.clerkId}`}
          textStyles='body-medium text-dark400_light700'
          isAuthor
        />

        <div className='flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start'>
          <Metric
            imgUrl='/assets/icons/like.svg'
            alt='like icon'
            value={formatNumber(upvotes)}
            title=' Votes'
            textStyles='small-medium text-dark400_light800'
          />

          <Metric
            imgUrl='/assets/icons/message.svg'
            alt='message icon'
            value={formatNumber(answers.length)}
            title=' Answers'
            textStyles='small-medium text-dark400_light800'
          />

          <Metric
            imgUrl='/assets/icons/eye.svg'
            alt='eye icon'
            value={formatNumber(views)}
            title=' Views'
            textStyles='small-medium text-dark400_light800'
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
