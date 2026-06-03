'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  User,
  LayoutDashboard,
  ImageIcon,
  Box,
  Briefcase,
  Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import NotificationBell from '@/app/components/NotificationBell'
import Footer from '@/app/components/Footer'

// MENU (Tetap Menu User Asli)
const MENU_ITEMS = [
  { name: 'Home', href: '/dashboard_user', icon: LayoutDashboard },
  { name: 'Showcase', href: '/dashboard_user/showcase', icon: ImageIcon },
  { name: 'Ruangan', href: '/dashboard_user/Ruangan', icon: Box },
  { name: 'Activity', href: '/dashboard_user/event', icon: Briefcase },
  { name: 'Proker', href: '/dashboard_user/proker', icon: Calendar },
  { name: 'Profil', href: '/dashboard_user/profil', icon: User },
] as const

const INVALID_ROUTES = [
  '/dashboard_user/users',
  '/dashboard_admin',
  '/dashboard_admin/users',
]

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { token, user, logout } = useAuthStore()

  const [isHydrating, setIsHydrating] = useState(false)
  const [localToken, setLocalToken] = useState<string | null>(null)

  // Mengikuti nama state & default value layout admin (true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Ambil token dari localStorage (agar saat refresh tetap stay)
  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    setLocalToken(t)
  }, [])

  useEffect(() => {
    const run = async () => {
      const stored = localToken || token

      // belum ada token => tetap logout & redirect
      if (!stored) {
        logout()
        router.replace('/login/user')
        return
      }

      // hydrate user hanya sekali saat user belum ada
      if (!user && !isHydrating) {
        setIsHydrating(true)
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          const res = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          })

          if (res.ok) {
            const json = await res.json()
            const setAuth = useAuthStore.getState().setAuth
            if (json?.data) setAuth(json.data, stored)
          } else {
            // token invalid/expired
            logout()
            localStorage.removeItem('token')
            router.replace('/login/user')
            return
          }
        } catch {
          logout()
          localStorage.removeItem('token')
          router.replace('/login/user')
          return
        } finally {
          setIsHydrating(false)
        }
      }

      // setelah (atau jika) hydrate, validasi role
      const hydratedUser = useAuthStore.getState().user
      if (!hydratedUser) {
        // hindari redirect berulang saat masih proses hydration
        if (isHydrating) return
        logout()
        localStorage.removeItem('token')
        router.replace('/login/user')
        return
      }

      if (hydratedUser.role !== 'student') {
        logout()
        localStorage.removeItem('token')
        router.replace('/login/user')
        return
      }

      if (INVALID_ROUTES.includes(pathname)) {
        router.replace('/dashboard_user')
      }
    }

    run()
  }, [localToken, token, pathname, router, user, isHydrating, logout])

  // Revalidate berkala agar jika token expired/logout di background bisa tertangkap sebelum halaman "rusak"
  useEffect(() => {
    const intervalMs = 4 * 60 * 1000 // 4 menit
    let t: ReturnType<typeof setInterval> | null = null

    const revalidate = async () => {
      const stored = localStorage.getItem('token')
      if (!stored) return

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        const res = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
          headers: { Authorization: `Bearer ${stored}` },
        })

        // 401/403 -> token expired/invalid -> logout
        if (res.status === 401 || res.status === 403) {
          logout()
          localStorage.removeItem('token')
          router.replace('/login/user')
          return
        }
      } catch {
        // kalau server error sementara, jangan paksa logout
      }
    }

    // start hanya jika token ada
    if (typeof window !== 'undefined' && (localToken || token)) {
      // jalankan sekali saat mount
      revalidate()
      t = setInterval(revalidate, intervalMs)
    }

    return () => {
      if (t) clearInterval(t)
    }
  }, [localToken, token, logout, router])



  const activeMenu = useMemo(
    () => MENU_ITEMS.find((item) => item.href === pathname),
    [pathname]
  )

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/login/user')
  }

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
          h-screen

          ${isMobileOpen 
            ? 'fixed inset-y-0 left-0 z-[70] w-72 p-6 translate-x-0' 
            : 'fixed inset-y-0 left-0 z-[70] w-72 p-6 -translate-x-full lg:static lg:translate-x-0'
          }

          ${!isMobileOpen && (isSidebarOpen ? 'lg:w-72 lg:p-6' : 'lg:w-24 lg:p-4')}
        `}
      >
        {/* HEADER SIDEBAR */}
        <div className={`flex items-center mb-12 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <div className="flex items-center gap-3 animate-in fade-in duration-700">
              {/* LOGO SAAT SIDEBAR TERBUKA */}
              <div className="h-9 w-9 relative flex-shrink-0">
                <img
                  src="/images/Logo-Bem-Layout-1.png"
                  alt="Logo BEM"
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="overflow-hidden">
                <h1 className="text-lg font-black tracking-tighter leading-none">CREATIVE HUB</h1>
                <p className="text-[#EF6145] text-[9px] mt-1 uppercase font-black tracking-[0.2em]">FSRD UNTAR</p>
              </div>
            </div>
          ) : (
            /* LOGO SAAT SIDEBAR MENGECIL (COLLAPSED) */
            <div className="h-10 w-10 relative hover:scale-110 transition-transform cursor-pointer flex-shrink-0">
              <img
                src="/Logo-Bem-Layout-1.png"
                alt="Logo BEM"
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto no-scrollbar pb-10">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center transition-all duration-300 rounded-2xl relative 
                  ${isSidebarOpen ? 'gap-4 px-4 py-3.5' : 'justify-center p-4'} 
                  ${isActive 
                    ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Icon size={isActive ? 22 : 20} />
                {isSidebarOpen && (
                  <span className={`text-sm font-bold whitespace-nowrap transition-transform duration-300 ${isActive ? 'translate-x-1' : ''}`}>
                    {item.name}
                  </span>
                )}
                {!isSidebarOpen && isActive && (
                  <div className="absolute right-0 w-1 h-6 bg-[#EF6145] rounded-l-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* TOGGLE BUTTON */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="hidden lg:flex mt-auto items-center justify-center h-12 w-full bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/5"
        >
          {isSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
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
                {activeMenu?.name.toUpperCase() || 'HOME'}
              </h1>
              <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">
                Student Center
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <div className="hidden sm:flex items-center gap-2 mr-2">
              <NotificationBell />
            </div>

            <div className="h-8 w-[1px] bg-gray-200 hidden sm:block"></div>

            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-gray-900">{user?.nama || 'Creative Student'}</div>
                <div className="text-[10px] font-black text-[#EF6145] uppercase">Student</div>
              </div>

              {/* Avatar Box Gradasi Hitam Khas Admin */}
              <div className="h-11 w-11 bg-gradient-to-tr from-[#121212] to-[#333] rounded-2xl flex items-center justify-center text-white shadow-xl">
                <User size={22} />
              </div>

              <button
                onClick={handleLogout}
                className="ml-2 p-2.5 text-gray-400 hover:text-[#EF6145] hover:bg-[#EF6145]/5 rounded-xl transition-colors"
              >
                <LogOut size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#FDFDFB] flex flex-col">
          <div className="p-6 lg:p 20max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}