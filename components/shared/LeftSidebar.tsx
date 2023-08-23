"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";

const LeftSidebar = () => {
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className='custom-scrollbar common-background-shade sticky left-0 top-0 flex h-screen w-fit flex-col gap-6 overflow-y-auto p-6 pt-36 max-sm:hidden lg:w-[266px]'>
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;

        if (item.route === "/profile") item.route = `${item.route}/${userId}`;

        return (
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
            <p
              className={`${
                isActive ? "base-bold" : "base-medium"
              } max-lg:hidden`}
            >
              {item.label}
            </p>
          </Link>
        );
      })}
    </section>
  );
};

export default LeftSidebar;
