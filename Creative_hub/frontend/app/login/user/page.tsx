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
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center overflow-hidden">
        {/* Background pulse */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F7E8FF] to-[#E6F7FF]" />
        <div className="absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#EF6145]/10 blur-3xl animate-[splashFloatBg_2.2s_ease-in-out_infinite]" />

        <div className="relative z-10 text-center flex flex-col items-center">
          {/* Sparkles */}

          {/* memastikan logo splash tidak kepotong saat animasi */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => {
              const left = 10 + Math.random() * 80;
              const top = 10 + Math.random() * 65;
              const delay = Math.random() * 0.8;
              const duration = 1.2 + Math.random() * 0.9;
              const size = 6 + Math.random() * 10;
              return (
                <span
                  key={i}
                  className="absolute rounded-full bg-white/80"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    filter: 'drop-shadow(0 0 10px rgba(239,97,69,0.35))',
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                  }}
                />
              );
            })}
          </div>

          {/* Splash logo with float */}
          <div className="mb-4">

            <div className="animate-[splashFloat_1.8s_ease-in-out_infinite]">
              <Image
                src="/images/gambar-splash.png"
                alt="Splash"
                width={280}
                height={280}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Progress bar with shimmer */}
          <div className="mt-8 w-64 h-3 bg-white/30 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-120%] animate-[splashShimmer_2.1s_ease-in-out_forwards]" />
            <div className="absolute inset-y-0 left-0 bg-black rounded-full animate-[splashBar_1.8s_ease-in-out_forwards]" />
          </div>

          {/* Text hint */}
          <div className="mt-4 text-sm font-semibold tracking-widest text-gray-600">
            Central Creative Hub
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
 


              @keyframes splashFloatBg {
                0% { transform: translateY(0); opacity: 0.9; }
                50% { transform: translateY(-18px); opacity: 1; }
                100% { transform: translateY(0); opacity: 0.9; }
              }

              @keyframes splashBar {
                0% { width: 0%; }
                55% { width: 72%; }
                100% { width: 100%; }
              }

              @keyframes splashShimmer {
                0% { transform: translateX(-120%); opacity: 0; }
                20% { opacity: 1; }
                100% { transform: translateX(120%); opacity: 0; }
              }

              /* sparkles blink */
              @keyframes splashSparkle {
                0% { transform: scale(0.8); opacity: 0; }
                15% { opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.9; }
                100% { transform: scale(0.8); opacity: 0; }
              }

              /* prevent clipped look when floating */
              @keyframes splashFloat {
                0% { transform: translateY(0) rotate(-0.5deg); }
                50% { transform: translateY(-8px) rotate(0.5deg); }
                100% { transform: translateY(0) rotate(-0.5deg); }
              }


              /* exit animation */
              @media (prefers-reduced-motion: no-preference) {
                .splash-exit {
                  animation: splashExit 280ms ease-out forwards;
                }
                @keyframes splashExit {
                  from { opacity: 1; transform: translateY(0); }
                  to { opacity: 0; transform: translateY(-6px); }
                }
              }
            `,
          }}
        />
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