'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/axios';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      router.push('/login');
      return;
    }

    // If we have a token but no user data (e.g. after refresh), fetch user profile
    if (!user && storedToken) {
      api
        .get('/auth/me')
        .then((res) => {
          if (res.data.success) {
            setAuth(res.data.data, storedToken);
          } else {
            logout();
            router.push('/login');
          }
        })
        .catch(() => {
          logout();
          router.push('/login');
        });
    }
  }, [user, token, router, setAuth, logout]);

  if (!token && !localStorage.getItem('token')) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Admin</h1>
          <div className="text-sm">
            {user?.nama} <span className="text-gray-500">({user?.role})</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

