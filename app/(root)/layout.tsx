import React from "react";

import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='bg-black'>
      <Navbar />
      <div className='flex'>
        <LeftSidebar />

        <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14'>
          <div className='mx-auto w-full max-w-5xl'>{children}</div>
        </section>

        <RightSidebar />
      </div>
    </main>
  );
}

export default Layout;
