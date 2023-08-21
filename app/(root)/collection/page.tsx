import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/shared/Pagination";
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
    pageSize: 2,
    searchQuery: searchParams.q,
  });

  return (
    <>
      <h2 className='h2-bold text-white'>Saved Questions</h2>

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
