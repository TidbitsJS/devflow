import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { QuestionFilters } from "@/constants/filters";
import { getSavedQuestions } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
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
      <h2 className='h2-bold text-white'>Saved Questions</h2>

      <div className='mt-11 flex items-center justify-between gap-5'>
        <Searchbar
          route='/collection'
          iconPosition='left'
          imgSrc='/assets/icons/search.svg'
          placeholder='Search amazing minds here...'
          otherClasses='flex-1 '
        />

        <Filter
          filters={QuestionFilters}
          otherClasses='min-h-[56px] max-w-[250px]'
        />
      </div>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.map((item: any) => (
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
        ))}
      </div>

      <div className='mt-10'>
        <Pagination
          path='/'
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}

export default Home;
