import { getTimeStamp } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "../ui/badge";

interface Question {
  _id: string;
  title: string;
  tags: {
    _id: string;
    name: string;
  }[];
  author: {
    _id: string;
    name: string;
    picture: string;
  };
  upvotes: number;
  views: number;
  answers: Array<object>;
  createdAt: Date;
}

const QuestionCard = ({
  _id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
}: Question) => {
  return (
    <div className='dark-gradient rounded-[10px] px-11 py-9 shadow-question-card-dark'>
      <Link href={`/question/${_id}`}>
        <h3 className='h3-semibold text-white'>{title}</h3>
      </Link>

      <div className='mt-3.5 flex flex-wrap gap-2'>
        {tags.map((tag) => (
          <Badge
            key={tag._id}
            className='subtle-medium px-4 py-2 uppercase text-light-500'
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      <div className='flex-between mt-6 w-full flex-wrap gap-3'>
        <div className='flex-center gap-1'>
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
        </div>

        <div className='flex-center gap-3'>
          <div className='flex-center gap-1'>
            <Image
              src='/assets/icons/like.svg'
              width={16}
              height={16}
              alt='like icon'
            />

            <p className='small-medium text-light-800'>
              {upvotes}
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
              {answers.length}
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
              {views}
              <span className='small-regular'> Views</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
