"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <section className='flex min-w-[266px] flex-col gap-6 bg-dark-200/50 p-6'>
      {sidebarLinks.map((item) => {
        const isActive = pathname === item.route;

        return (
          <Link
            href={item.route}
            key={item.label}
            className={`${
              isActive ? "primary-gradient rounded-lg text-white" : ""
            } flex items-center justify-start gap-4 bg-transparent p-4`}
          >
            <Image src={item.imgURL} alt={item.label} width={20} height={20} />
            <p
              className={`${isActive ? "base-bold" : "base-medium"} text-white`}
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
