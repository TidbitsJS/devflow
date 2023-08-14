"use client";

import { UserButton, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Searchbar from "../Searchbar";
import Theme from "./Theme";
import MobileNav from "./MobileNav";

const Navbar = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  return (
    <nav className='flex-between fixed top-0 z-20 w-full gap-5 border-b border-b-dark-500 bg-dark-200/50 p-6 sm:px-12'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/images/site-logo.svg'
          width={23}
          height={23}
          alt='Dev Overflow Logo'
        />

        <p className='heading4-semibold font-spaceGrotesk text-white max-sm:hidden'>
          Dev<span className='text-primary-500'>Overflow</span>
        </p>
      </Link>

      <Searchbar
        iconPosition='left'
        imgSrc='/assets/icons/search.svg'
        placeholder='Search for Questions Here...'
        classname='max-lg:hidden'
      />

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
          <div className='flex-between gap-5'>
            {pathname !== "/" && pathname !== "/create-question" && (
              <Link
                className='rounded-[40px] bg-primary-500 px-4 py-3 text-white max-md:hidden'
                href='/create-question'
              >
                Ask a Question
              </Link>
            )}

            <UserButton
              userProfileMode='navigation'
              userProfileUrl={`/profile/${userId}`}
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
          </div>
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
