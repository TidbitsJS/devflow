import { UserButton } from "@clerk/nextjs";

function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <p>Something</p>

      <UserButton afterSignOutUrl='/sign-in' />
    </main>
  );
}

export default Home;
