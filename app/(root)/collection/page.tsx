import { auth } from "@clerk/nextjs";

import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import QuestionCard from "@/components/cards/QuestionCard";
import LocalSearchbar from "@/components/shared/search/LocalSearchbar";

import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";

import { SearchParamsProps } from "@/types";

async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  if (!userId) return null;

  const result = await getSavedQuestions({
    clerkId: userId,
    page: searchParams.page ? +searchParams.page : 1,
    filter: searchParams.filter,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>

      <div className='mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center'>
        <LocalSearchbar
          route='/collection'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search amazing minds here...'
          otherClasses='flex-1'
        />

        <Filter
          filters={QuestionFilters}
          otherClasses='min-h-[56px] sm:min-w-[170px]'
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
            title='No Saved Questions Found'
            description='It appears that there are no saved questions in your collection at the moment 😔.Start exploring and saving questions that pique your interest 🌟'
            link='/'
            linkTitle='Explore Questions'
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

export default Home;
