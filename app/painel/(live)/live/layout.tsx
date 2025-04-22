import { Metadata } from 'next';
import { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'indecent.top',
  description: '',
};

const RootLayout = ({ children }: Readonly<{children: ReactNode}>) => {
  return (
    <main className="relative">
      <div className="flex">
        {/*<Sidebar />*/}
             <section className="flex min-h-screen flex-1 flex-col px-0 pb-0 pt-6 max-md:pb-0 sm:px-0">
          <div className="w-full">{children}</div>
        </section>
      </div>
    </main>
  );
};

export default RootLayout;
