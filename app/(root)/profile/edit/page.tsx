import Profile from "@/components/form/Profile";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";

const Page = async () => {
  const { userId } = auth();
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });

  return (
    <>
      <h1 className='h1-bold text-white'>Edit Profile</h1>

      <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
    </>
  );
};

export default Page;
