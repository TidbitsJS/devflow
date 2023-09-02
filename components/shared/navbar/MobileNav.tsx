"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedOut, useAuth } from "@clerk/nextjs";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";

const NavContent = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

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
                isActive
                  ? "primary-gradient rounded-lg text-light-900"
                  : "base-color"
              }  flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${isActive ? "" : "white-black-invert"}`}
              />
              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
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
        className='white-black-invert sm:hidden'
      />
    </SheetTrigger>

    <SheetContent side='left' className='common-background-shade border-none'>
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
                <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3'>
                  <span className='primary-text-gradient'>Log In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href='/sign-up'>
                <Button className='small-medium light-border-2 btn-tertiary subtle-color min-h-[41px] w-full rounded-lg border px-4 py-3'>
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
