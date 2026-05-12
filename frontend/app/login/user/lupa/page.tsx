'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/axios';

export default function LupaPasswordPage() {
  const router = useRouter();
  const [showCharacter, setShowCharacter] = useState(false);

  
  const [form, setForm] = useState({
    email: '',
    password: '',
    password_confirmation: '' 
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowCharacter(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (form.password !== form.password_confirmation) {
      alert('Password baru dan konfirmasi password tidak cocok!');
      return;
    }

    try {
      await api.post('/auth/reset-password', form);
      
      alert('Password berhasil diubah! Silakan login.');
      router.push('/login/user');
    } catch (err: any) {
      console.error("Detail Error API:", err.response?.data);
      alert(err.response?.data?.message || 'Gagal mengubah password. Pastikan email benar.');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans relative">

      <Link 
        href="/login/user"
        className="absolute top-6 left-6 z-50 bg-white text-sm font-semibold text-gray-600 px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-[#E85C41] hover:shadow-md transition-all duration-300"
      >
        &larr; Kembali ke Login
      </Link>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          
          <h1 className="text-4xl font-bold mb-3 text-black">Lupa Password</h1>
          <p className="text-gray-600 mb-8 text-[15px]">Ubah Password akun anda</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Masukkan email..."
                className="w-full p-3 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Password Baru</label>
              <input
                name="password"
                type="password"
                placeholder="Masukkan password baru"
                className="w-full p-3 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                name="password_confirmation"
                type="password"
                placeholder="Ulangi password baru"
                className="w-full p-3 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.password_confirmation}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E85C41] text-white font-semibold p-3.5 rounded-lg hover:bg-[#D44A30] transition-colors mt-4">
              Rubah
            </button>

          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#DDBEEF] flex-col items-center justify-between relative overflow-hidden pt-20">
        
        <div className="z-10 text-center px-10">
          <h1 className="text-5xl font-extrabold text-white mb-4 drop-shadow-md tracking-wide">
            Central Creative Hub
          </h1>
          <p className="text-white/90 text-lg mb-10 leading-relaxed drop-shadow-sm">
            Platform ekosistem digital untuk fakultas
            <br />
            Seni Rupa dan Desain
          </p>
        </div>

        <div 
          className={`relative w-full flex justify-center items-end mt-auto transition-transform duration-1000 ease-out transform ${
            showCharacter ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <Image
            src="/images/character1.png"
            alt="Character Greeting"
            width={350}
            height={350}
            className="object-contain drop-shadow-2xl translate-y-4"
            priority
          />
        </div>

      </div>

    </div>
  );
}