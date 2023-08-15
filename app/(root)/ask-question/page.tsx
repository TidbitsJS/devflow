import Question from "@/components/form/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const mongUser = await getUserById({ userId });

  return (
    <>
      <h1 className='h1-bold text-white'>Ask a question</h1>

      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongUser._id)} />
      </div>
    </>
  );
};

export default Page;
