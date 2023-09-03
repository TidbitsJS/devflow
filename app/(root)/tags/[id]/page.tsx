import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { getQuestionsByTagId } from "@/lib/actions/tag.action";

import { URLProps } from "@/types";

async function Page({ params, searchParams }: URLProps) {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold heading1-color'>{result.tagTitle}</h1>

      <div className='mt-11 flex flex-wrap items-center justify-between gap-5'>
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search tag questions...'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.length > 0 ? (
          result.questions.map((item: any) => (
            <QuestionCard
              key={item._id}
              _id={item._id}
              title={item.title}
              tags={item.tags}
              author={item.author}
              upvotes={item.upvotes.length}
              views={item.views}
              answers={item.answers}
              createdAt={item.createdAt}
            />
          ))
        ) : (
          <NoResult
            title='No Questions Found for the tag'
            description="😔 Oops! It seems there are no questions related to [Tag Name] at the moment. Don't let that discourage you! Be the first to start a discussion about this tag by asking a question. 🚀"
            link='/ask-question'
            linkTitle='Ask a Question'
          />
        )}
      </div>

      <div className='mt-10'>
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}

export default Page;
