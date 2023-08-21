import Image from "next/image";

import Votes from "../shared/Votes";
import AnswerFilter from "./AnswerFilter";
import ParseHTML from "../shared/ParseHTML";

import { formatDate } from "@/lib/utils";
import { getAnswers } from "@/lib/actions/answer.action";
import Pagination from "../shared/Pagination";

interface Params {
  questionId: string;
  userId: string;
  totalAnswers: number;
  page: string | undefined;
  filter: string | undefined;
}

const AllAnswers = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}: Params) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    pageSize: 5,
    sortBy: filter,
  });

  return (
    <div className='mt-11'>
      <div className='flex items-center justify-between'>
        <h3 className='primary-text-gradient'>{totalAnswers} Answers</h3>

        <AnswerFilter />
      </div>

      <div className='mt-10'>
        {result.answers.map((answer) => (
          <article key={answer._id}>
            <div className='flex items-center justify-between'>
              <div className='flex flex-1 items-center gap-1'>
                <Image
                  src={answer.author.picture}
                  alt='user picture'
                  width={18}
                  height={18}
                  className='rounded-full object-cover'
                />
                <p className='small-medium text-light-700'>
                  {answer.author.name}
                </p>

                <p className='subtle-medium text-light-500'>
                  • answered {formatDate(answer.createdAt)}
                </p>
              </div>
              <Votes
                type='Answer'
                itemId={JSON.stringify(answer._id)}
                userId={JSON.stringify(userId)}
                upvotes={answer.upvotes.length}
                hasupVoted={answer.upvotes.includes(userId)}
                downvotes={answer.downvotes.length}
                hasdownVoted={answer.downvotes.includes(userId)}
              />
            </div>

            <div className='markdown mt-6 w-full'>
              <ParseHTML data={answer.body} />
            </div>

            <div className='my-10 h-0.5 w-full bg-dark-300' />
          </article>
        ))}
      </div>

      <div className='my-10 w-full'>
        <Pagination
          path={`question/${questionId}`}
          pageNumber={page ? +page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  );
};

export default AllAnswers;
