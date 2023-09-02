import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";

import { Metric } from "../shared/Generic";
import RenderTag from "../shared/RenderTag";
import EditDeleteAction from "../shared/EditDeleteAction";

import { formatNumber, getTimeStamp } from "@/lib/utils";

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
          textStyles='body-medium body-color'
        />

        <div className='flex-center gap-3'>
          <Metric
            imgUrl='/assets/icons/like.svg'
            alt='like icon'
            value={formatNumber(upvotes)}
            title=' Votes'
            textStyles='small-medium small-color'
          />

          <Metric
            imgUrl='/assets/icons/message.svg'
            alt='message icon'
            value={formatNumber(answers.length)}
            title=' Answers'
            textStyles='small-medium small-color'
          />

          <Metric
            imgUrl='/assets/icons/eye.svg'
            alt='eye icon'
            value={formatNumber(views)}
            title=' Views'
            textStyles='small-medium small-color'
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
