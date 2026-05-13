'use client';

import { useState, useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import Image from 'next/image'; 
import Link from 'next/link'; 
import { Eye, EyeOff } from 'lucide-react'; // icon mata
import api from '@/lib/axios'; 
import { useAuthStore } from '@/store/authStore'; 

export default function LoginPage() {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle password
  const [showCharacter, setShowCharacter] = useState(false); 
  const [loading, setLoading] = useState(true); 
  
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const splashTimer = setTimeout(() => setLoading(false), 1800); // splash
    const charTimer = setTimeout(() => setShowCharacter(true), 2000); // animasi karakter

    return () => {
      clearTimeout(splashTimer);
      clearTimeout(charTimer);
    };
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

  // ================= SPLASH SCREEN =================
  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F05A37] z-[100] flex flex-col items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="overflow-hidden mb-4">
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tight animate-[slideUp_1s_ease-out_forwards]">
              CENTRAL
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 className="text-white text-5xl md:text-7xl font-black tracking-tight opacity-0 animate-[slideUp_1s_ease-out_0.2s_forwards]">
              CREATIVE HUB
            </h1>
          </div>
          <div className="mt-8 w-48 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full animate-[loadingBar_2s_ease-in-out_forwards]"></div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes slideUp {
              from { transform: translateY(100%); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
            @keyframes loadingBar {
              0% { width: 0%; }
              50% { width: 70%; }
              100% { width: 100%; }
            }
          `
        }} />
      </div>
    );
  }

  // ================= LOGIN PAGE =================
  return (
    <div className="min-h-screen flex bg-[#FAFAFA] font-sans relative">

      {/* hidden admin access */}
      <Link 
        href="/login/admin"
        className="absolute top-0 left-0 z-50 w-20 h-20 opacity-0 cursor-default"
      >
        Login Admin →
      </Link>

      {/* LEFT FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-[420px]">

          <h1 className="text-4xl font-bold mb-3 text-black">
            Selamat Datang Kembali
          </h1>

          <p className="text-gray-600 mb-10 text-[15px]">
            Masuk ke akun Central Creative Hub Anda
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
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

            {/* PASSWORD + SHOW */}
            <div className="mb-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} // toggle
                  placeholder="Masukkan password"
                  className="w-full p-3.5 pr-12 rounded-lg border border-gray-200 text-black focus:outline-none focus:border-[#E85C41] focus:ring-1 focus:ring-[#E85C41] transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} 
                  required
                />

                {/* ICON MATA */}
                <button
                  type="button" // biar ga submit form
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#E85C41] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* LUPA PASSWORD */}
            <div className="text-right mb-8">
              <Link 
                href="/login/user/lupa" 
                className="text-xs text-[#E85C41] hover:underline font-medium"
              >
                Lupa password?
              </Link>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#E85C41] text-white font-semibold p-3.5 rounded-lg hover:bg-[#D44A30] transition-colors"
            >
              Masuk
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

      {/* RIGHT SIDE */}
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

        {/* CHARACTER */}
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