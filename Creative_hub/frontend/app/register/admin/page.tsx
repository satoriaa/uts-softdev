'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Password dan Konfirmasi Password tidak cocok!');
      return;
    }

    try {
      await api.post('/auth/admin/register', {
        nama: form.nama,
        email: form.email,
        password: form.password,
      });
      alert('Register admin berhasil! Silakan login.');
      router.push('/login/admin');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F7F3] font-sans relative">
      <Link
        href="/login/admin"
        className="absolute top-6 left-6 z-50 bg-white text-sm font-semibold text-gray-600 px-4 py-2.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 hover:text-black hover:shadow-md transition-all duration-300"
      >
        &larr; Login Admin
      </Link>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">
          <h1 className="text-4xl font-bold mb-3 text-black">Daftar Admin Baru</h1>
          <p className="text-gray-600 mb-10 text-[15px]">Masuk ke area admin dengan akun baru Anda.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Nama lengkap</label>
              <input
                name="nama"
                type="text"
                placeholder="Nama lengkap Anda"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Email admin</label>
              <input
                name="email"
                type="email"
                placeholder="admin@company.com"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Masukkan password"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-700">Konfirmasi Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Ulangi password"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:ring-1 focus:ring-gray-300 transition-colors"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#2A2A2A] text-white font-semibold p-3.5 rounded-lg hover:bg-[#3A3A3A] transition-colors"
            >
              Daftar Admin
            </button>
          </form>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#212121] flex-col items-center justify-center p-10">
        <div className="z-10 text-center">
          <h1 className="text-6xl font-extrabold text-white mb-6 tracking-wide">Central Creative Hub</h1>
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
