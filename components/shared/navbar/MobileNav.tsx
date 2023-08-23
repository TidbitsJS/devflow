"use client";

import { SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";

const NavContent = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className='flex h-full flex-col gap-6 pt-16'>
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") item.route = `${item.route}/${userId}`;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              key={item.label}
              className={`${
                isActive ? "primary-gradient rounded-lg text-white" : ""
              } flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
              />
              <p
                className={`${
                  isActive ? "base-bold" : "base-medium"
                } text-white`}
              >
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
};

const MobileNav = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Image
        src='/assets/icons/hamburger.svg'
        width={36}
        height={36}
        alt='hamburger icon'
        className='sm:hidden'
      />
    </SheetTrigger>

    <SheetContent side='left' className='border-none bg-dark-200'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/assets/images/site-logo.svg'
          width={23}
          height={23}
          alt='Dev Overflow Logo'
        />

        <p className='h2-bold font-spaceGrotesk text-white'>
          Dev<span className='text-primary-500'>Overflow</span>
        </p>
      </Link>

      <div className='flex min-h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto'>
        <SheetClose asChild>
          <NavContent />
        </SheetClose>

        <SignedOut>
          <div className='flex flex-col gap-3'>
            <SheetClose asChild>
              <Link href='/sign-in'>
                <Button className='small-medium min-h-[41px] w-full rounded-lg bg-dark-400 px-4 py-3'>
                  <span className='primary-text-gradient'>Log In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href='/sign-up'>
                <Button className='small-medium min-h-[41px] w-full rounded-lg border border-dark-400 bg-dark-300 px-4 py-3'>
                  Sign up
                </Button>
              </Link>
            </SheetClose>
          </div>
        </SignedOut>
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileNav;
