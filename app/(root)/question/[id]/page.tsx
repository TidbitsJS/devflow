import ParseHTML from "@/components/question/ParseHTML";
import { getQuestionById } from "@/lib/actions/question.action";

const Page = async ({ params }: { params: { id: string } }) => {
  const result = await getQuestionById({ questionId: params.id });

  return (
    <>
      <div className='markdown w-full'>
        <ParseHTML data={result.body} />
      </div>
    </>
  );
};

export default Page;
