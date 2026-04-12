'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

export default function Root() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    // Basic routing logic: if not logged in, go to login. 
    // If logged in, go to home.
    if (user) {
      router.push('/home');
    } else {
      router.push('/auth/login');
    }
  }, [user, router]);

  // Render an empty page or a simple spinner while deciding
  return (
    <div className="h-screen w-full flex items-center justify-center bg-black">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
