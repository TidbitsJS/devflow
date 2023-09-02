import QuestionCard from "@/components/cards/QuestionCard";
import HomeFilters from "@/components/Home/HomeFilters";
import Pagination from "@/components/shared/Pagination";
import { Button } from "@/components/ui/button";
import { getRecommendedQuestions } from "@/lib/actions/general.action";
import { getQuestions } from "@/lib/actions/question.action";
import { auth } from "@clerk/nextjs";
import Link from "next/link";

async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { userId } = auth();
  let result;

  if (searchParams?.filter === "recommended" && userId) {
    result = await getRecommendedQuestions({
      userId,
      page: searchParams.page ? +searchParams.page : 1,
    });
  } else {
    result = await getQuestions({
      page: searchParams.page ? +searchParams.page : 1,
      searchQuery: searchParams.q,
      filter: searchParams.filter,
    });
  }

  return (
    <>
      <div className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold heading1-color'>All Questions</h1>

        <Link href='/ask-question' className='flex justify-end max-sm:w-full'>
          <Button className='primary-gradient min-h-[46px] px-4 py-3 !text-light-900'>
            Ask a Question
          </Button>
        </Link>
      </div>

      <HomeFilters />

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
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
}

export default Home;
