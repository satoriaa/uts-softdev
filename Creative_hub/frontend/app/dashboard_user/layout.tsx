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

// MENU 
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

// NAV ITEM
type NavItemProps = {
  item: (typeof MENU_ITEMS)[number]
  isActive: boolean
  isExpanded: boolean
}

function NavItem({ item, isActive, isExpanded }: NavItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      title={!isExpanded ? item.name : undefined}
      className={`
        group relative flex items-center rounded-xl transition-all duration-300
        ${isExpanded ? 'gap-4 px-4 py-3' : 'justify-center p-3'}
        ${isActive
          ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'}
      `}
    >
      <Icon size={20} />
      {isExpanded && <span className="text-sm font-medium">{item.name}</span>}
    </Link>
  )
}

// MAIN LAYOUT 
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

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)



  // FIX LOCALSTORAGE 
  useEffect(() => {
    setLocalToken(localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    const run = async () => {
      setIsReady(true)

      const stored = token || localToken
      if (!stored) {
        router.replace('/login/user')
        return
      }

      // Hydrate user on refresh if token exists but user is not loaded yet
      if (!user && stored && !isHydrating) {
        setIsHydrating(true)
        try {
          const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
          const res = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
            headers: { Authorization: `Bearer ${stored}` },
          })
          if (res.ok) {
            const json = await res.json()
            const setAuth = useAuthStore.getState().setAuth
            // expected response shape: { data: userObject }
            if (json?.data) setAuth(json.data, stored)
          }
        } catch (e) {
          // ignore
        } finally {
          setIsHydrating(false)
        }
      }

      const hydratedUser = useAuthStore.getState().user
      if (!hydratedUser) {
        // Don’t bounce to login while refresh/hydration is still in progress
        if (isHydrating) return
        router.replace('/dashboard_user')
        return
      }


      if (hydratedUser.role !== 'student') {
        router.replace('/login/user')
        return
      }


      if (INVALID_ROUTES.includes(pathname)) {
        router.replace('/dashboard_user')
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, localToken, pathname, router, user, isHydrating])


  const activeMenu = useMemo(
    () => MENU_ITEMS.find((item) => item.href === pathname),
    [pathname]
  )

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/login/user')
  }

  // Always render the layout root to avoid hydration mismatches between server and client.
  // Redirects happen inside useEffect after mount.

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">

      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          flex flex-col bg-[#1A1A1A] text-white transition-all duration-500

          /* MOBILE MODE */
          ${isMobileOpen ? 'fixed inset-y-0 left-0 z-50 w-72 p-6' : ''}

          /* DESKTOP MODE */
          ${!isMobileOpen && (isSidebarExpanded ? 'w-72 p-6' : 'w-20 p-3')}
        `}
      >
        {/* LOGO */}
        <div className="mb-8 flex items-center justify-between">
          {isSidebarExpanded ? (
            <h1 className="font-bold">Creative Hub</h1>
          ) : (
            <span className="font-bold">C</span>
          )}

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-2 overflow-y-auto">
          {MENU_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isExpanded={isSidebarExpanded}
            />
          ))}
        </nav>

        {/* COLLAPSE BUTTON */}
        <button
          onClick={() => setIsSidebarExpanded((prev) => !prev)}
          className="hidden lg:flex mt-auto justify-center p-2 hover:bg-white/10 rounded-lg"
        >
          {isSidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">

        {/* HEADER */}
        <header className="flex items-center justify-between px-6 h-16 
  bg-white/80 backdrop-blur-xl border-b border-gray-100 
  sticky top-0 z-30">

  <div className="flex items-center gap-4">
    <button onClick={() => setIsMobileOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
      <Menu size={20}/>
    </button>

    <div className="flex flex-col">
      <span className="text-xs text-gray-400">Dashboard</span>
      <span className="font-semibold text-gray-900">
        {activeMenu?.name || 'Home'}
      </span>
    </div>
  </div>

    <div className="flex items-center gap-4">
      <div className="text-black">
        <NotificationBell />
      </div>

    <div className="h-6 w-px bg-gray-200"/>



    <div className="text-right hidden sm:block">
      <p className="text-sm font-semibold text-gray-900">{user?.nama || 'User'}</p>
      <span className="text-xs text-gray-400">Student</span>
    </div>

    <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg text-gray-900">
      <LogOut size={18}/>
    </button>
  </div>
</header>

        {/* CONTENT (SCROLL DI SINI) */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA] flex flex-col">
          <div className="p-6 flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}