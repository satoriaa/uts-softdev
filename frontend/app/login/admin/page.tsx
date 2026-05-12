'use client';

import { useState } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Link from 'next/link'; 
import api from '@/lib/axios'; 
import { useAuthStore } from '@/store/authStore'; 

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const res = await api.post('/auth/admin/login', { email, password });
      setAuth(res.data.data, res.data.token); 
      router.push('/dashboard_admin');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login gagal'); 
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F7F3] font-sans relative">

      <Link 
        href="/login/user"
        className="absolute top-6 left-6 z-50 bg-white text-sm font-semibold text-gray-600 px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-black hover:shadow-md transition-all duration-300"
      >
        &larr; Login User
      </Link>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">
          
          <h1 className="text-4xl font-bold mb-3 text-black">
            Selamat Datang Kembali
          </h1>
          
          <p className="text-gray-600 mb-10 text-[15px]">
            Masuk ke akun Central Creative Hub Anda
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email/User Name Admin
              </label>
              <input
                type="email" 
                placeholder="admin@company.com"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full bg-[#2A2A2A] text-white font-semibold p-3.5 rounded-lg hover:bg-[#3A3A3A] transition-colors">
                masuk
              </button>
            </div>

            <p className="text-center text-sm mt-4 text-gray-600">
              Belum punya akun admin?{' '}
              <Link href="/register/admin" className="text-[#E85C41] hover:underline font-medium">
                Daftar Admin
              </Link>
            </p>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#212121] flex-col items-center justify-center p-10">
        <div className="z-10 text-center">
          <h1 className="text-6xl font-extrabold text-white mb-6 tracking-wide">
            Central Creative Hub
          </h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Platform ekosistem digital untuk fakultas
            <br />
            Seni Rupa dan Desain
          </p>
        </div>
      </div>

    </div>
  );
}