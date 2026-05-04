'use client';

import { useState, useEffect } from 'react'; // hook react
import { useRouter } from 'next/navigation'; // routing
import Image from 'next/image'; // image nextjs
import Link from 'next/link'; // link nextjs
import api from '@/lib/axios'; // axios instance
import { useAuthStore } from '@/store/authStore'; // state global

export default function LoginPage() {
  const [email, setEmail] = useState(''); // 🔥 ganti nim -> email
  const [password, setPassword] = useState('');
  const [showCharacter, setShowCharacter] = useState(false); // animasi karakter
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  // animasi muncul dari bawah
  useEffect(() => {
    const timer = setTimeout(() => setShowCharacter(true), 100);
    return () => clearTimeout(timer); // cleanup
  }, []);

  // handle submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // mencegah reload
    try {
      const res = await api.post('/auth/login', { email, password }); // 🔥 kirim email
      setAuth(res.data.data, res.data.token); // simpan auth
      router.push('/dashboard_admin'); // revisi ini harunsya ke bagian user dashboard, bukan admin
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login gagal'); // error handling
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans">
      
      {/* ================= LEFT SIDE (FORM) ================= */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">
          
          <h1 className="text-4xl font-bold mb-3 text-black">
            Selamat Datang Kembali
          </h1>
          <p className="text-gray-600 mb-10 text-[15px]">
            Masuk ke akun Central Creative Hub Anda
          </p>

          <form onSubmit={handleSubmit}>
            
            {/* INPUT EMAIL */}
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email" // 🔥 penting: validasi otomatis browser
                placeholder="Masukkan email"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // update email
                required
              />
            </div>

            {/* INPUT PASSWORD */}
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Masukkan password"
                className="w-full p-3.5 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // update password
                required
              />
            </div>

            {/* LUPA PASSWORD */}
            <div className="text-right text-xs text-[#E85C41] mb-8 cursor-pointer hover:underline">
              Lupa password?
            </div>

            {/* BUTTON LOGIN */}
            <button
              type="submit"
              className="w-full bg-[#E85C41] text-white font-semibold p-3.5 rounded-lg hover:bg-[#D44A30] transition-colors">
              masuk
            </button>

            {/* REGISTER */}
            <p className="text-center text-sm mt-6 text-gray-600">
              Belum punya akun?{' '}
              <Link href="/register/user" className="text-[#E85C41] hover:underline font-medium">
                Daftar sekarang
              </Link>
            </p>

          </form>
        </div>
      </div>

      {/* ================= RIGHT SIDE (GAMBAR) ================= */}
      <div className="hidden md:flex w-1/2 bg-[#DDBEEF] flex-col items-center justify-between relative overflow-hidden pt-20">
        
        {/* TEXT */}
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

        {/* KARAKTER */}
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