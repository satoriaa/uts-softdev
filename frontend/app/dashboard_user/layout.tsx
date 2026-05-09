'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  Bell,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const MENU_ITEMS = [
  { name: 'Home', href: '/dashboard_user', icon: LayoutDashboard },
  { name: 'Showcase', href: '/dashboard_user/showcase', icon: ImageIcon },
  { name: 'Inventaris', href: '/dashboard_user/inventaris', icon: Box },
  { name: 'Event', href: '/dashboard_user/event', icon: Calendar },
  { name: 'Profil', href: '/dashboard_user/profil', icon: User },
] as const

const INVALID_ROUTES = [
  '/dashboard_user/users',
  '/dashboard_admin',
  '/dashboard_admin/users',
]

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
        group relative flex items-center rounded-xl transition-all duration-300 ease-in-out
        ${isExpanded ? 'gap-4 px-4 py-3' : 'justify-center p-3'}
        ${isActive 
          ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/30' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'}
      `}
    >
      <Icon
        size={20}
        className={`shrink-0 transition-transform duration-300 ${!isActive ? 'group-hover:scale-110' : ''}`}
      />
      {isExpanded && (
        <span className="whitespace-nowrap text-sm font-medium tracking-wide">
          {item.name}
        </span>
      )}
      {/* Active Indicator Pin */}
      {isActive && !isExpanded && (
        <div className="absolute right-0 h-1.5 w-1.5 rounded-full bg-white" />
      )}
    </Link>
  )
}

export default function DashboardUserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { token, user, logout } = useAuthStore()

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const localToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  useEffect(() => {
    setIsReady(true)
    if (!token && !localToken) {
      router.replace('/login/user')
      return
    }
    if (INVALID_ROUTES.includes(pathname)) {
      router.replace('/dashboard_user')
    }
  }, [token, localToken, pathname, router])

  const activeMenu = useMemo(
    () => MENU_ITEMS.find((item) => item.href === pathname),
    [pathname]
  )

  const handleLogout = () => {
    logout()
    localStorage.removeItem('token')
    router.push('/login/user')
  }

  if (!isReady || (!token && !localToken)) return null

  return (
    <div className="flex min-h-screen bg-[#FDFDFD] text-slate-900 antialiased">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-[#1A1A1A] text-white transition-all duration-500 ease-in-out lg:static
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarExpanded ? 'lg:w-72 p-6' : 'lg:w-24 p-4'}
        `}
      >
        <div className={`mb-10 flex items-center ${isSidebarExpanded ? 'px-2' : 'justify-center'}`}>
          {isSidebarExpanded ? (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#EF6145] flex items-center justify-center font-bold">C</div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold leading-none tracking-tight">Creative Hub</h1>
                <span className="text-[10px] font-medium text-[#EF6145] mt-1">USER PANEL</span>
              </div>
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EF6145] font-bold shadow-lg shadow-[#EF6145]/20">
              C
            </div>
          )}
          <button onClick={() => setIsMobileOpen(false)} className="ml-auto text-gray-500 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1.5">
          <p className={`text-[10px] font-bold text-gray-500 mb-2 px-4 uppercase tracking-widest ${!isSidebarExpanded && 'text-center'}`}>
            {isSidebarExpanded ? 'Main Menu' : '•••'}
          </p>
          {MENU_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isExpanded={isSidebarExpanded}
            />
          ))}
        </nav>

        {/* Sidebar Toggle & Logout on Bottom */}
        <div className="mt-auto flex flex-col gap-2">
           <button
            onClick={() => setIsSidebarExpanded((prev) => !prev)}
            className="hidden h-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all hover:bg-white/10 hover:text-white lg:flex"
          >
            {isSidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-xl lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={20} />
            </button>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <span className="text-gray-400">Dashboard</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">{activeMenu?.name ?? 'Home'}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 lg:gap-5">
            {/* Notification placeholder */}
            <button className="relative rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-[#EF6145]">
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EF6145] border-2 border-white" />
            </button>

            <div className="h-6 w-[1px] bg-gray-100 mx-1" />

            {/* Profile & Logout Group */}
            <div className="flex items-center gap-4">
              <div className="hidden flex-col items-end sm:flex">
                <p className="text-xs font-bold text-gray-900 leading-none">
                  {user?.nama || 'User Name'}
                </p>
                <span className="text-[10px] font-medium text-gray-400 mt-1 uppercase">FTI UNTAR</span>
              </div>
              
              {/* Avatar Dropdown (Simple) */}
              <div className="group relative">
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#EF6145]/10 text-[#EF6145] transition-all hover:ring-4 hover:ring-[#EF6145]/10">
                  <User size={18} />
                </div>
                
                {/* Minimal Logout Tooltip/Button */}
                <button 
                  onClick={handleLogout}
                  className="absolute right-0 top-12 flex w-32 items-center gap-2 rounded-lg bg-white p-2 text-xs font-bold text-gray-500 opacity-0 shadow-xl ring-1 ring-black/5 transition-all group-hover:top-11 group-hover:opacity-100 hover:text-red-500"
                >
                  <LogOut size={14} /> Keluar
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#FAFAFA]">
          <div className="p-6 lg:p-10">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}