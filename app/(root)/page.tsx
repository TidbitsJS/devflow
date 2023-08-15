import QuestionCard from "@/components/cards/QuestionCard";
import { getQuestions } from "@/lib/actions/question.action";

async function Home() {
  const result = await getQuestions({});

  return (
    <>
      <h2 className='h2-bold text-white'>All Questions</h2>

      <div className='mt-10 flex w-full flex-col gap-6'>
        {result.questions.map((item: any) => (
          <QuestionCard
            key={item._id}
            _id={item._id}
            title={item.title}
            tags={item.tags}
            author={item.author}
            upvotes={item.upvotes}
            views={item.views}
            answers={item.answers}
            createdAt={item.createdAt}
          />
        ))}
      </div>
    </>
  );
}

export default Home;
