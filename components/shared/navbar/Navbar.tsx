import Link from "next/link";
import Image from "next/image";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import Theme from "./Theme";
import MobileNav from "./MobileNav";
import GlobalSearch from "../search/GlobalSearch";

const Navbar = () => {
  return (
    <nav className='flex-between background-light900_dark200 fixed z-50 w-full gap-5  p-6 shadow-light-300 dark:shadow-none sm:px-12'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/images/site-logo.svg'
          width={23}
          height={23}
          alt='Dev Overflow Logo'
        />

        <p className='h2-bold font-spaceGrotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Dev<span className='text-primary-500'>Overflow</span>
        </p>
      </Link>

      <GlobalSearch />

      <div className='flex-between gap-5'>
        <Theme />

        <SignedOut>
          <div className='flex-center gap-5 max-md:hidden'>
            <Link href='/sign-in' className='rounded-lg'>
              Log in
            </Link>

            <Link href='/sign-up' className='rounded-lg'>
              Sign up
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          <UserButton
            afterSignOutUrl='/'
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
              variables: {
                colorPrimary: "#FF7000",
              },
            }}
          />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
