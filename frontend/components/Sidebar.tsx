'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { LayoutDashboard, Users, BookOpen, DoorOpen, Calendar, Trophy, Store, Wrench, Newspaper, LogOut } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/users', label: 'Kelola User', icon: Users },
  { href: '/dashboard/karya', label: 'Karya', icon: BookOpen },
  { href: '/dashboard/ruang', label: 'Ruang', icon: DoorOpen },
  { href: '/dashboard/pinjaman', label: 'Pinjaman', icon: DoorOpen },
  { href: '/dashboard/event', label: 'Event', icon: Calendar },
  { href: '/dashboard/proker', label: 'Proker', icon: Calendar },
  { href: '/dashboard/lomba', label: 'Lomba', icon: Trophy },
  { href: '/dashboard/tenant', label: 'Tenant', icon: Store },
  { href: '/dashboard/workshop', label: 'Workshop', icon: Wrench },
  { href: '/dashboard/majalah', label: 'Majalah', icon: Newspaper },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

