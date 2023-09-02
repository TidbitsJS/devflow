import { auth } from "@clerk/nextjs";

import Question from "@/components/form/Question";

import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";

import { ParamsProps } from "@/types";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });

  if (userId !== result.author.clerkId) {
    return (
      <p className='base-bold text-light-700'>
        You&apos;re not the right person to edit this content
      </p>
    );
  }

  return (
    <>
      <h1 className='h1-bold heading1-color'>Edit Question</h1>

      <div className='mt-9'>
        <Question
          type='edit'
          mongoUserId={JSON.stringify(mongoUser._id)}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
