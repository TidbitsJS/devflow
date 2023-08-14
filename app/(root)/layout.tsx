import React from "react";

import Navbar from "@/components/shared/navbar/Navbar";
import LeftSidebar from "@/components/shared/LeftSidebar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-screen bg-black'>
      <Navbar />
      <div className='flex pt-24'>
        <LeftSidebar />

        <section className='flex min-h-screen flex-1 flex-col px-6 py-10 max-md:pb-32 sm:px-10'>
          {children}
        </section>
      </div>
    </main>
  );
}

export default Layout;
