import RenderMarkdown from "@/components/question/RenderMarkdown";
import { getQuestionById } from "@/lib/actions/question.action";

const Page = async ({ params }: { params: { id: string } }) => {
  const result = await getQuestionById({ questionId: params.id });

  console.log(result);

  return (
    <>
      <div className='markdown w-full'>
        <RenderMarkdown data={result.body} />
      </div>
    </>
  );
};

export default Page;
