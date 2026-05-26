'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Hash, BookOpen, ShieldCheck, Edit2, Camera } from 'lucide-react';

export default function ProfilPage() {
  const { user, token, setAuth } = useAuthStore();
  const [preview, setPreview] = useState(user?.gambar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setPreview(user?.gambar || '');
  }, [user?.gambar]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar JPG/PNG.');
      setMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('gambar', file);

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto profil.');
      }

      setAuth(data.data, token || '');
      setPreview(data.data.gambar || '');
      setMessage('Foto profil berhasil diperbarui.');
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:py-16 animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Pengaturan Profil
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Kelola data informasi akademik dan foto profil institusi Anda.
          </p>
        </div>
        <div className="h-1 w-20 bg-[#EF6145] rounded-full hidden md:block"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm text-center relative overflow-hidden group">
            {/* Dekorasi Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-100"></div>
            
            <div className="relative inline-block mt-4">
              <div className="w-36 h-36 bg-white rounded-full p-1.5 shadow-xl ring-4 ring-gray-50 overflow-hidden mx-auto relative group/avatar">
                {preview ? (
                  <img src={preview} alt="Profil" className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover/avatar:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 rounded-full">
                    <User size={64} className="stroke-[1.5]" />
                  </div>
                )}
                {/* Overlay Loading */}
                {loading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              
              <label 
                htmlFor="profileImageUpload" 
                className={`absolute bottom-1 right-1 p-3 bg-[#EF6145] text-white rounded-2xl shadow-md transition-all duration-200 cursor-pointer hover:bg-[#d85036] hover:scale-105 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Camera size={16} />
              </label>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={handleFileChange}
              />
            </div>

            {/* Status Messages */}
            {message && (
              <div className="mt-5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 animate-pulse">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mt-6 tracking-tight">
              {user?.nama || 'Guest User'}
            </h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1.5 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">
              {user?.nim || 'NIM Tidak Terdaftar'}
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50/70 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold tracking-wide">
                <ShieldCheck size={16} className="text-emerald-600" />
                Verified Student
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8 pb-3 border-b border-gray-50 flex items-center gap-2">
              <span>Informasi Akademik</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Field: Nama */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <User size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>
                  <p className="text-sm font-semibold text-gray-800 break-words">{user?.nama || '-'}</p>
                </div>
              </div>

              {/* Field: NIM */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <Hash size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">NIM / ID User</label>
                  <p className="text-sm font-semibold text-gray-800 break-words">{user?.nim || '-'}</p>
                </div>
              </div>

              {/* Field: Jurusan */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <BookOpen size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Program Studi</label>
                  <p className="text-sm font-semibold text-gray-800 break-words">{user?.jurusan || '-'}</p>
                </div>
              </div>

              {/* Field: Email */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Institusi</label>
                  <p className="text-sm font-semibold text-gray-800 break-all">{user?.email || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings/Note Section */}
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative shadow-lg shadow-gray-900/10">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keamanan Akun</p>
              <h5 className="text-base font-semibold mt-1">Ingin mengubah sandi Anda?</h5>
              <p className="text-xs text-gray-400 mt-0.5">Pastikan untuk menggunakan kombinasi password yang kuat.</p>
            </div>
            <button className="relative z-10 px-5 py-3 bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/10 rounded-xl text-xs font-bold transition-all shrink-0 text-center">
              Kelola Password
            </button>
            {/* Visual Decoration */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#EF6145] opacity-20 blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}