"use client";

import { SignedOut } from "@clerk/nextjs";
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

const NavContent = () => {
  const pathname = usePathname();

  return (
    <section className='flex h-full flex-col gap-[10px] pt-16 md:px-[25px]'>
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.route;

        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              key={item.label}
              className={`paragraph-regular flex items-center gap-4 px-4 py-[14px]
            ${isActive ? "rounded-full text-white" : "text-black"}`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={18}
                height={18}
              />
              <p>{item.label}</p>
            </Link>
          </SheetClose>
        );
      })}

      {pathname !== "/" && pathname !== "/create-question" && (
        <SheetClose asChild>
          <Link
            href='/create-question'
            className='mt-5 w-full rounded-[40px] bg-primary-500 p-3 text-center text-white'
          >
            Ask a Question
          </Link>
        </SheetClose>
      )}
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
        className='cursor-pointer bg-black md:hidden'
      />
    </SheetTrigger>

    <SheetContent side='left' className='border-none bg-dark-200/50'>
      <div className='flex h-full flex-col'>
        <SheetClose asChild>
          <NavContent />
        </SheetClose>

        <SignedOut>
          <div className='flex flex-col gap-[10px]'>
            <SheetClose asChild>
              <Link href='/sign-in' className='rounded-[20px] text-center'>
                Log in
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href='/sign-up' className='rounded-[20px] text-center'>
                Sign up
              </Link>
            </SheetClose>
          </div>
        </SignedOut>
      </div>
    </SheetContent>
  </Sheet>
);

export default MobileNav;
