import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import Answer from "@/components/form/Answer";
import Votes from "@/components/shared/Votes";
import { Metric } from "@/components/shared/Generic";
import RenderTag from "@/components/shared/RenderTag";
import ParseHTML from "@/components/shared/ParseHTML";
import AllAnswers from "@/components/Answer/AllAnswers";

import { getUserById } from "@/lib/actions/user.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { getQuestionById } from "@/lib/actions/question.action";

import { ITag } from "@/mongodb";
import { URLProps } from "@/types";

const Page = async ({ params, searchParams }: URLProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
          <Link
            href={`/profile/${result.author.clerkId}`}
            className='flex items-center justify-start gap-1'
          >
            <Image
              src={result.author.picture}
              className='rounded-full'
              width={22}
              height={22}
              alt='profile picture'
            />
            <p className='paragraph-semibold paragraph-color'>
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
              hasSaved={mongoUser.saved.includes(result._id)}
            />
          </div>
        </div>
        <h2 className='h2-semibold heading2-color mt-3.5 w-full text-left'>
          {result.title}
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <Metric
          imgUrl='/assets/icons/clock.svg'
          alt='clock icon'
          value={` asked ${getTimeStamp(result.createdAt)}`}
          title=' Votes'
          textStyles='small-regular body-color'
        />

        <Metric
          imgUrl='/assets/icons/message.svg'
          alt='message icon'
          value={result.answers.length}
          title=' Answers'
          textStyles='small-medium body-color'
        />

        <Metric
          imgUrl='/assets/icons/eye.svg'
          alt='eye icon'
          value={formatNumber(result.views)}
          title=' Views'
          textStyles='small-medium body-color'
        />
      </div>

      <ParseHTML data={result.content} />

      <div className='mt-8 flex flex-wrap gap-2'>
        {result.tags.map((tag: ITag) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
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
        question={result.content}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
