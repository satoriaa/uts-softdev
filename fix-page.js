const fs = require('fs');
const content = `'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-pulse text-blue-600 font-semibold">Redirecting...</div>
  );
}
`;
fs.writeFileSync('c:/Users/HYPE AMD/uts-softdev/frontend/app/page.tsx', content);
console.log('page.tsx fixed!');
