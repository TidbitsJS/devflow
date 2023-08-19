import Image from "next/image";
import Link from "next/link";

import ParseHTML from "@/components/question/ParseHTML";
import { Badge } from "@/components/ui/badge";
import { getQuestionById } from "@/lib/actions/question.action";
import { getTimeStamp } from "@/lib/utils";
import Answer from "@/components/form/Answer";

const Page = async ({ params }: { params: { id: string } }) => {
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex-between w-full'>
          <Link
            href={`/profile/${result.author._id}`}
            className='flex items-center justify-start gap-1'
          >
            <Image
              src={result.author.picture}
              className='rounded-full'
              width={22}
              height={22}
              alt='profile picture'
            />
            <p className='paragraph-semibold text-light-500'>
              {result.author.name}
            </p>
          </Link>
          <div className='flex gap-5'>
            <div className='flex-center gap-2.5'>
              <Image
                src='/assets/icons/upvote.svg'
                width={18}
                height={18}
                alt='upvote'
              />

              <div className='flex-center min-w-[18px] rounded-sm bg-dark-400 p-1'>
                <p className='subtle-medium text-white'>{result.upvotes}</p>
              </div>

              <Image
                src='/assets/icons/downvote.svg'
                width={18}
                height={18}
                alt='downvote'
              />
            </div>
            <Image
              src='/assets/icons/star-red.svg'
              width={18}
              height={18}
              alt='star'
            />
          </div>
        </div>
        <h2 className='h2-semibold mt-3.5 w-full text-left text-white'>
          {result.title}
        </h2>
      </div>

      <div className='mt-5 flex gap-4'>
        <div className='flex-center gap-1'>
          <Image
            src='/assets/icons/clock.svg'
            className='rounded-full'
            width={18}
            height={18}
            alt='user avatar'
          />

          <p className='body-medium text-light-700'>
            asked {getTimeStamp(result.createdAt)}
          </p>
        </div>

        <div className='flex-center gap-1'>
          <Image
            src='/assets/icons/message.svg'
            width={18}
            height={18}
            alt='message icon'
          />

          <p className='small-medium text-light-800'>
            {result.answers.length}
            <span className='small-regular'> Answers</span>
          </p>
        </div>

        <div className='flex-center gap-1'>
          <Image
            src='/assets/icons/eye.svg'
            width={18}
            height={18}
            alt='eye icon'
          />

          <p className='small-medium text-light-800'>
            {result.views}
            <span className='small-regular'> Views</span>
          </p>
        </div>
      </div>

      <div className='markdown mt-8 w-full'>
        <ParseHTML data={result.body} />
      </div>

      <div className='mt-8 flex flex-wrap gap-2'>
        {result.tags.map((tag: any) => (
          <Badge
            key={tag._id}
            className='subtle-medium rounded-md px-4 py-2 uppercase text-light-500'
          >
            {tag.name}
          </Badge>
        ))}
      </div>

      {/* Answers */}
      <div className='mt-11'>
        <h3 className='primary-text-gradient'>
          {result.answers.length} Answers
        </h3>
      </div>

      <div className='my-10 h-0.5 w-full bg-dark-300' />

      <Answer question={result.body} />
    </>
  );
};

export default Page;
