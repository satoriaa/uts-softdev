'use client';

import { useAuthStore } from '@/store/authStore';

export default function ProfilPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        Profil
      </h2>
      <p className="text-gray-500 mt-3">Kelola data profil user.</p>

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest font-black text-gray-500">
              Nama
            </div>
            <div className="text-sm font-bold text-gray-900 mt-2">
              {user?.nama || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-black text-gray-500">
              NIM
            </div>
            <div className="text-sm font-bold text-gray-900 mt-2">
              {user?.nim || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-black text-gray-500">
              Jurusan
            </div>
            <div className="text-sm font-bold text-gray-900 mt-2">
              {user?.jurusan || '-'}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest font-black text-gray-500">
              Email
            </div>
            <div className="text-sm font-bold text-gray-900 mt-2">
              {user?.email || '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

