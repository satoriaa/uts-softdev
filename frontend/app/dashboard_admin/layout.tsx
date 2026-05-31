'use client';

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import {
  User, 
  LayoutDashboard, 
  ImageIcon, 
  Box, 
  Calendar, 
  CheckSquare,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Trophy,
  BookOpen,
  Settings,
  
} from 'lucide-react';
import NotificationBell from '@/app/components/NotificationBell';
import Footer from '@/app/components/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useAuthStore();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/login/user');
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!stored) {
        router.replace('/login/admin');
        return;
      }

      // hydrate if needed
      if (!user) {
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const res = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          });
          if (cancelled) return;
          if (res.ok) {
            const json = await res.json();
            const setAuth = useAuthStore.getState().setAuth;
            if (json?.data) setAuth(json.data, stored);
          }
        } catch (e) {
          // ignore
        }
      }

      // validate role after hydration attempt
      if (cancelled) return;
      const hydratedUser = useAuthStore.getState().user;
      if (hydratedUser && hydratedUser.role !== 'admin') {
        router.replace('/login/admin');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user, router]);


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!user || user.role !== 'admin') return;
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const stored = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!stored) return;
        const res = await fetch(`${base.replace(/\/$/, '')}/api/pinjaman`, {
          headers: { Authorization: `Bearer ${stored}` },
        });
        if (!mounted) return;
        if (res.ok) {
          const json = await res.json();
          setPendingCount(json.data?.filter((p: any) => p.status === 'pending').length || 0);
        }
        // socket for live pending updates
        try {
          if (typeof window !== 'undefined') {
            const socket = io(base.replace(/\/$/, ''), { transports: ['websocket'], auth: { token: stored } });
            socketRef.current = socket;
            // new booking -> increment
            socket.on('pinjaman:created', () => {
              setPendingCount((c) => c + 1);
            });
            // update -> if becomes non-pending, decrement (guard min 0)
            socket.on('pinjaman:updated', (payload: any) => {
              try {
                if (payload && payload.status && payload.status !== 'pending') {
                  setPendingCount((c) => Math.max(0, c - 1));
                }
              } catch (e) {}
            });
          }
        } catch (e) {
          // ignore socket errors
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; if (socketRef.current) { try { socketRef.current.disconnect(); } catch(e){} } };
  }, [user]);

  // Avoid early return based on client-only state (localStorage) to prevent hydration errors.
  // The layout will render on the server; client-side redirects happen inside useEffect.

  const navigation = [
    {
      group: "Main",
      items: [
        { name: 'Dashboard', href: '/dashboard_admin', icon: LayoutDashboard },
      ]
    },
    {
      group: "Content & Media",
      items: [
        { name: 'Karya', href: '/dashboard_admin/karya', icon: ImageIcon },
        { name: 'Majalah', href: '/dashboard_admin/majalah', icon: BookOpen },
        { name: 'Event', href: '/dashboard_admin/event', icon: Calendar },
        { name: 'Workshop', href: '/dashboard_admin/workshop', icon: Calendar },
      ]
    },
    {
      group: "Management",
      items: [
        { name: 'Ruangan', href: '/dashboard_admin/ruang', icon: Box },
        { name: 'Tenant', href: '/dashboard_admin/tenant', icon: ShoppingBag },
        { name: 'Lomba', href: '/dashboard_admin/lomba', icon: Trophy },
        { name: 'Proker', href: '/dashboard_admin/proker', icon: CheckSquare },
      ]
    },
    {
      group: "System",
      items: [
        { name: 'Validasi Pinjaman', href: '/dashboard_admin/pinjaman', icon: CheckSquare },
        { name: 'User Management', href: '/dashboard_admin/users', icon: User },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFB]">

      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          bg-[#121212] text-white flex flex-col transition-all duration-500 ease-in-out shadow-2xl

          ${isMobileOpen 
            ? 'fixed inset-y-0 left-0 z-[70] w-72 p-6 translate-x-0' 
            : 'fixed inset-y-0 left-0 z-[70] w-72 p-6 -translate-x-full lg:static lg:translate-x-0'
          }

          /* FIX HEIGHT */
          h-screen

          ${!isMobileOpen && (isSidebarOpen ? 'lg:w-72 lg:p-6' : 'lg:w-24 lg:p-4')}
        `}
      >

        {/* HEADER SIDEBAR */}
        <div className={`flex items-center mb-12 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-700">
              <div className="h-9 w-9 bg-[#EF6145] rounded-xl flex items-center justify-center font-black text-white shadow-lg rotate-3">C</div>
              <div className="overflow-hidden">
                <h1 className="text-lg font-black tracking-tighter leading-none">CREATIVE HUB</h1>
                <p className="text-[#EF6145] text-[9px] mt-1 uppercase font-black tracking-[0.2em]">FSRD UNTAR</p>
              </div>
            </div>
          ) : (
            <div className="h-10 w-10 bg-[#EF6145] rounded-xl flex items-center justify-center font-bold text-white shadow-lg hover:rotate-12 transition-transform cursor-pointer">C</div>
          )}
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex flex-col gap-8 overflow-y-auto no-scrollbar pb-10">
          {navigation.map((group) => (
            <div key={group.group} className="flex flex-col gap-2">
              {isSidebarOpen && (
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-4 mb-2">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className={`group flex items-center transition-all duration-300 rounded-2xl relative ${isSidebarOpen ? 'gap-4 px-4 py-3.5' : 'justify-center p-4'} ${isActive ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <item.icon size={isActive ? 22 : 20} />
                    {isSidebarOpen && (
                      <span className={`text-sm font-bold whitespace-nowrap ${isActive ? 'translate-x-1' : ''}`}>
                        {item.name}
                      </span>
                    )}
                    {item.href === '/dashboard_admin/pinjaman' && pendingCount > 0 && (
                      <div className="ml-auto mr-3 inline-flex items-center justify-center bg-yellow-500 text-white text-[10px] font-black px-2 py-1 rounded-full">
                        {pendingCount}
                      </div>
                    )}
                    {!isSidebarOpen && isActive && (
                      <div className="absolute right-0 w-1 h-6 bg-[#EF6145] rounded-l-full" />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* TOGGLE BUTTON */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          className="hidden lg:flex mt-auto items-center justify-center h-12 w-full bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* HEADER */}
        <header className="bg-white/70 backdrop-blur-xl px-6 lg:px-10 py-5 flex justify-between items-center sticky top-0 z-[40] border-b border-gray-100">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="lg:hidden p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:block">
              <h1 className="text-xl font-black text-gray-900 tracking-tight">
                {pathname.split('/').pop()?.toUpperCase() || 'DASHBOARD'}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                System Administrator
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <NotificationBell />
              <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-xl"><Settings size={20}/></button>
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-gray-900">{user?.nama || 'Admin Central'}</div>
                <div className="text-[10px] font-black text-[#EF6145] uppercase">Master Admin</div>
              </div>

              <div className="h-11 w-11 bg-gradient-to-tr from-[#121212] to-[#333] rounded-2xl flex items-center justify-center text-white shadow-xl">
                <User size={22} />
              </div>

              <button 
                onClick={handleLogout}
                className="ml-2 p-2.5 text-gray-400 hover:text-[#EF6145] hover:bg-[#EF6145]/5 rounded-xl"
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#FDFDFB] flex flex-col">
          <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}