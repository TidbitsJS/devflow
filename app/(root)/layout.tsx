import React from "react";

import Navbar from "@/components/shared/navbar/Navbar";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='min-h-screen bg-black'>
      <Navbar />
      <div className='pt-28'>{children}</div>
    </main>
  );
}

export default Layout;
