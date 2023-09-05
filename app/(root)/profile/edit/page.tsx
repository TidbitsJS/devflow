import { auth } from "@clerk/nextjs";

import Profile from "@/components/form/Profile";
import { getUserById } from "@/lib/actions/user.action";

const Page = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className='h1-bold text-dark100_light900'>Edit Profile</h1>

      <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
    </>
  );
};

export default Page;
