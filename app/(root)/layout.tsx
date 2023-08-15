import React from "react";

import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='bg-black'>
      <Navbar />
      <div className='flex'>
        <LeftSidebar />

        <section className='flex min-h-screen flex-1 flex-col px-6 pb-10 pt-28 max-md:pb-32 sm:px-10'>
          <div className='w-full max-w-4xl'>{children}</div>
        </section>
      </div>
    </main>
  );
}

export default Layout;
