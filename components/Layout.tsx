import { ReactNode } from 'react';
import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
  user: any;
  onSignOut: () => void;
}

export default function Layout({ children, user, onSignOut }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#0e1629] text-white">
      <Header user={user} onSignOut={onSignOut} />
      <main className="p-2 sm:p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}