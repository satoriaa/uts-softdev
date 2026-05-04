'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [showCharacter, setShowCharacter] = useState(false);

  const [form, setForm] = useState({ 
    nama: '', 
    nim: '', 
    jurusan: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    role: 'student' 
  });

  useEffect(() => {
    // Animasi muncul delay 100ms
    const timer = setTimeout(() => setShowCharacter(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    try {
      await api.post('/auth/register', form);
      alert('Register berhasil! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans">
      
      {/* ================= LEFT SIDE (FORM) ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-[420px]">
          
          <h1 className="text-4xl font-bold mb-3 text-black">Buat Akun Baru</h1>
          <p className="text-gray-600 mb-8 text-[15px]">Bergabung dengan Central Creative Hub</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Nama lengkap</label>
              <input
                name="nama"
                type="text"
                placeholder="Nama lengkap Anda"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">NIM</label>
              <input
                name="nim"
                type="text"
                placeholder="21120001"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.nim}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Program Studi</label>
              <select 
                name="jurusan" 
                value={form.jurusan} 
                onChange={handleChange} 
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] bg-white"
                required
              >
                <option value="" disabled>Pilih Program Studi</option>
                <option value="DKV">Desain Komunikasi Visual</option>
                <option value="Seni Murni">Seni Murni</option>
                <option value="Desain Interior">Desain Interior</option>
                <option value="Desain Produk">Desain Produk</option>
              </select>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="nama@student.university.ac.id"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Minimal 8 karakter"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41]"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#E85C41] text-white font-semibold p-3.5 rounded-lg hover:bg-[#D44A30] transition-colors mt-4">
              Daftar
            </button>

            <p className="text-center text-sm mt-5 text-gray-600">
              Sudah punya akun?{' '}
              <Link href="/login/user" className="text-[#E85C41] hover:underline font-medium">
                Masuk
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* ================= RIGHT SIDE (GAMBAR) ================= */}
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

        {/* CONTAINER KARAKTER (Animasi muncul dari bawah) */}
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