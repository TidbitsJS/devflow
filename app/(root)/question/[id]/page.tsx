import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import Answer from "@/components/form/Answer";
import { Badge } from "@/components/ui/badge";
import Votes from "@/components/shared/Votes";
import ParseHTML from "@/components/shared/ParseHTML";
import AllAnswers from "@/components/Answer/AllAnswers";

import { getTimeStamp } from "@/lib/utils";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";

interface Params {
  params: {
    id: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}

const Page = async ({ params, searchParams }: Params) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
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
          <div className='flex justify-end'>
            <Votes
              type='Question'
              itemId={JSON.stringify(result._id)}
              userId={JSON.stringify(mongoUser._id)}
              upvotes={result.upvotes.length}
              hasupVoted={result.upvotes.includes(mongoUser._id)}
              downvotes={result.downvotes.length}
              hasdownVoted={result.downvotes.includes(mongoUser._id)}
            />
          </div>
        </div>
        <h2 className='h2-semibold mt-3.5 w-full text-left text-white'>
          {result.title}
        </h2>
      </div>

      <div className='mt-5 flex flex-wrap gap-4'>
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

      <ParseHTML data={result.content} />

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

      {/* @ts-ignore */}
      <AllAnswers
        questionId={result._id}
        userId={mongoUser._id}
        totalAnswers={result.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />

      <Answer
        question={result.body}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
