import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className='flex min-h-screen w-full items-center justify-center bg-auth-light bg-cover bg-center bg-no-repeat dark:bg-auth-dark'>
      <SignUp />
    </section>
  );
}
