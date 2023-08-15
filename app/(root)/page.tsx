import { getQuestions } from "@/lib/actions/question.action";

async function Home() {
  const questions = await getQuestions({})

  console.log("questions", questions)

  return (
    <>
      <p className='text-white'>Something</p>
    </>
  );
}

export default Home;
