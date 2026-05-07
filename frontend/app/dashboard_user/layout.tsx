'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import {
  User,
  LayoutDashboard,
  ImageIcon,
  Box,
  Calendar,

  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, logout } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!token) {
    // localStorage only exists in browser; guard for SSR
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      // token exists in localStorage but not in store yet
    } else {
      return null;
    }
  }

  // Redirect legacy/invalid routes (avoids blank/404 when user clicks old links)
  // NOTE: jangan redirect ke `/dashboard_user` untuk route yang valid seperti `/dashboard_user/showcase`.
  if (
    pathname === '/dashboard_user/users' ||
    pathname === '/user-home' ||
    pathname === '/user-homedan'
  ) {
    router.replace('/dashboard_user');
  }









  const menuItems = [
    { name: 'Home', href: '/dashboard_user', icon: LayoutDashboard },
    { name: 'Showcase', href: '/dashboard_user/showcase', icon: ImageIcon },
    { name: 'Inventaris', href: '/dashboard_user/inventaris', icon: Box },
    { name: 'Event', href: '/dashboard_user/event', icon: Calendar },
    { name: 'Profil', href: '/dashboard_user/profil', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#F9F9F7]">
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-[#1C1C1C] text-white flex flex-col transition-all duration-300 lg:static ${
          isMobileOpen
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0'
        } ${isSidebarOpen ? 'lg:w-72 p-6' : 'lg:w-20 p-4'}`}
      >
        <div
          className={`flex items-center mb-10 ${
            isSidebarOpen ? 'justify-between' : 'justify-center'
          }`}
        >
          {isSidebarOpen ? (
            <div className="overflow-hidden whitespace-nowrap">
              <h1 className="text-xl font-bold tracking-tight">
                Central Creative Hub
              </h1>
              <p className="text-gray-500 text-[10px] mt-1 uppercase font-bold tracking-widest">
                User panel
              </p>
            </div>
          ) : (
            <div className="h-10 w-10 bg-[#EF6145] rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
              C
            </div>
          )}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              title={!isSidebarOpen ? item.name : ''}
              className={`flex items-center transition-all duration-200 rounded-xl ${
                isSidebarOpen
                  ? 'gap-4 px-4 py-3'
                  : 'justify-center p-3'
              } ${
                pathname === item.href
                  ? 'bg-[#EF6145] text-white shadow-lg'
                  : 'text-gray-400 hover:bg-[#EF6145]/10 hover:text-[#EF6145]'
              }`}
            >
              <item.icon size={22} className="shrink-0" />
              {isSidebarOpen && (
                <span className="font-semibold text-sm whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex mt-auto items-center justify-center h-10 w-full bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white"
        >
          {isSidebarOpen ? (
            <ChevronLeft size={20} />
          ) : (
            <ChevronRight size={20} />
          )}
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white/80 backdrop-blur-md px-4 lg:px-8 py-4 flex justify-between items-center sticky top-0 z-30 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg lg:text-xl font-bold text-gray-800 tracking-tight">
              {isSidebarOpen ? 'User Control Panel' : 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-[#CC2525] hover:bg-red-50 rounded-lg transition-all duration-200 group"
              title="Keluar Aplikasi"
            >
              <LogOut
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-xs font-bold hidden md:block">Logout</span>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 hidden md:block"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-gray-900 leading-tight">
                  {user?.nama || 'User'}
                </div>
                <div className="text-[10px] text-gray-400 font-medium tracking-tight">
                  FTI UNTAR
                </div>
              </div>
              <div className="h-10 w-10 bg-[#EF6145] rounded-full flex items-center justify-center text-white shadow-md ring-2 ring-white hover:scale-105 transition-transform cursor-pointer">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

