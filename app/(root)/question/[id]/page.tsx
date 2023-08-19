import Image from "next/image";
import Link from "next/link";

import ParseHTML from "@/components/shared/ParseHTML";
import { Badge } from "@/components/ui/badge";
import { getQuestionById } from "@/lib/actions/question.action";
import { getTimeStamp } from "@/lib/utils";
import Answer from "@/components/form/Answer";
import Votes from "@/components/shared/Votes";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";

const Page = async ({ params }: { params: { id: string } }) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  const result = await getQuestionById({ questionId: params.id });
  console.log({ result });

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
          <Votes
            type='Question'
            itemId={JSON.stringify(result._id)}
            userId={JSON.stringify(mongoUser._id)}
            upvotes={result.upvotes}
          />
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

      <Answer
        question={result.body}
        questionId={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongoUser._id)}
      />
    </>
  );
};

export default Page;
