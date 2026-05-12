'use client';

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import Link from 'next/link'; 
import api from '@/lib/axios'; 
import { useAuthStore } from '@/store/authStore'; 

export default function LoginPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showCharacter, setShowCharacter] = useState(false); 
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const timer = setTimeout(() => setShowCharacter(true), 100);
    return () => clearTimeout(timer); 
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    try {
      const res = await api.post('/auth/login', { email, password }); 
      if (res.data.data?.role === 'admin') {
        alert('Email admin tidak dapat masuk di halaman user. Silakan gunakan halaman Login Admin.');
        return;
      }
      setAuth(res.data.data, res.data.token); 
      router.push('/dashboard_user'); 

    } catch (err: any) {
      alert(err.response?.data?.message || 'Login gagal'); 
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans relative">

      <Link 
        href="/login/admin"
        className="absolute top-0 left-0 z-50 w-20 h-20 opacity-0 cursor-default"
      >
        Login Admin &rarr;
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
                Email
              </label>
              <input
                type="email" 
                placeholder="Masukkan email"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] transition-colors"
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
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
                required
              />
            </div>

            <div className="text-right mb-8">
              <Link 
                href="/login/user/lupa" 
                className="text-xs text-[#E85C41] hover:underline cursor-pointer font-medium"
              >
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#E85C41] text-white font-semibold p-3.5 rounded-lg hover:bg-[#D44A30] transition-colors">
              Masuk
            </button>

            <p className="text-center text-sm mt-6 text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register/user" className="text-[#E85C41] hover:underline font-medium">
                Daftar sekarang
              </Link>
            </p>

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