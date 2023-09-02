import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Question from "@/components/form/Question";

import { getUserById } from "@/lib/actions/user.action";

const Page = async () => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const mongUser = await getUserById({ userId });

  return (
    <>
      <h1 className='h1-bold heading1-color'>Ask a question</h1>

      <div className='mt-9'>
        <Question mongoUserId={JSON.stringify(mongUser._id)} />
      </div>
    </>
  );
};

export default Page;
