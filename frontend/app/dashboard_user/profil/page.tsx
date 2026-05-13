'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Hash, BookOpen, ShieldCheck, Edit2 } from 'lucide-react';

export default function ProfilPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
          My Profile
        </h2>
        <div className="h-1.5 w-16 bg-[#EF6145] mt-2 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm text-center relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gray-50 -z-10"></div>
            
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden mx-auto">
                {/* Placeholder Avatar - Bisa diganti <img> jika ada user?.avatar */}
                <User size={64} className="text-gray-200" />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-[#EF6145] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Edit2 size={14} />
              </button>
            </div>

            <h3 className="text-xl font-black text-gray-900 mt-6 leading-tight">
              {user?.nama || 'Guest User'}
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-[2px] mt-2">
              {user?.nim || 'NIM Tidak Terdaftar'}
            </p>

            <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                <ShieldCheck size={16} />
                Verified Student
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[3px] mb-8 flex items-center gap-3">
              Informasi Akademik
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-6">
              {/* Field: Nama */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                  <User size={20} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Lengkap</label>
                  <p className="text-sm font-bold text-gray-900">{user?.nama || '-'}</p>
                </div>
              </div>

              {/* Field: NIM */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                  <Hash size={20} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">NIM / ID User</label>
                  <p className="text-sm font-bold text-gray-900">{user?.nim || '-'}</p>
                </div>
              </div>

              {/* Field: Jurusan */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                  <BookOpen size={20} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Program Studi</label>
                  <p className="text-sm font-bold text-gray-900">{user?.jurusan || '-'}</p>
                </div>
              </div>

              {/* Field: Email */}
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Institusi</label>
                  <p className="text-sm font-bold text-gray-900 italic">{user?.email || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings/Note Section */}
          <div className="bg-gray-900 rounded-[2rem] p-6 text-white flex items-center justify-between overflow-hidden relative">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Keamanan Akun</p>
              <h5 className="text-sm font-bold mt-1">Ingin mengubah password?</h5>
            </div>
            <button className="relative z-10 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold transition-all">
              Kelola Password
            </button>
            {/* Visual Decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#EF6145] opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}