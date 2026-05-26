'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Package,
  Calendar,
  TrendingUp,
  Layers,
  Palette,
} from 'lucide-react'

// --- ADVANCED CUSTOM STYLES ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght=300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  :root {
    --color-cream: #FAF9F6;
    --color-orange: #F05A37;
    --color-dark: #0F1115;
    --font-outfit: 'Outfit', sans-serif;
    --font-serif: 'Playfair Display', serif;
  }

  body {
    background-color: var(--color-cream);
    color: var(--color-dark);
    font-family: var(--font-outfit);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .font-serif-italic { font-family: var(--font-serif); font-style: italic; }

  .ease-custom {
    transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  }

  /* --- ANIMASI MARQUEE --- */
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-marquee {
    display: flex;
    width: max-content;
    animation: marquee 30s linear infinite;
  }

  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.04;
    pointer-events: none;
  }

  .outline-text {
    color: transparent;
    -webkit-text-stroke: 1px rgba(15, 17, 21, 0.2);
  }
`

interface RevealProps {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
  className?: string
}

const Reveal = ({ children, delay = 0, direction = 'up', className = '' }: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const directions = {
    up: 'translate-y-12',
    down: '-translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
    scale: 'scale-90 opacity-0'
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-1000 ease-custom ${className} ${
        isVisible ? 'opacity-100 translate-x-0 translate-y-0 scale-100' : `opacity-0 ${directions[direction as keyof typeof directions]}`
      }`}
    >
      {children}
    </div>
  )
}

export default function UserHomePage() {
  return (
    <div className="min-h-screen relative selection:bg-[#F05A37] selection:text-white bg-[#FAF9F6]">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="bg-noise fixed inset-0 z-[100]" />
      
      <main className="p-4 lg:p-6 max-w-[1600px] mx-auto">
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[60vh] w-full rounded-[32px] overflow-hidden group mb-8">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] ease-out group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
            <Reveal direction="scale">
              <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-4">
                Creative Hub Ecosystem
              </span>
              <h1 className="text-white text-5xl md:text-7xl font-black tracking-[-0.05em] leading-[0.9] mb-4">
                Design <br /> <span className="text-[#F05A37] font-serif-italic">Matters.</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <p className="text-white/70 text-sm md:text-base max-w-sm font-medium leading-relaxed">
                  Ruang kolaborasi digital untuk para visioner muda dalam mengekspresikan seni dan desain.
                </p>
                <Link href="/dashboard_user/showcase" className="bg-white text-[#0F1115] h-12 px-6 rounded-full text-xs font-black flex items-center gap-2 justify-center hover:bg-[#F05A37] hover:text-white transition-all duration-500 hover:scale-105 whitespace-nowrap">
                  START EXPLORING <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- MARQUEE SECTION --- */}
        <div className="py-12 overflow-hidden">
          <div className="animate-marquee">
            {[...Array(2)].map((_, listIdx) => (
              <div key={listIdx} className="flex items-center gap-12 pr-12">
                <span className="text-6xl font-black italic outline-text">CREATIVITY</span>
                <span className="text-[#F05A37] text-4xl">✦</span>
                <span className="text-6xl font-black italic">INNOVATION</span>
                <span className="text-[#F05A37] text-4xl">✦</span>
                <span className="text-6xl font-black italic outline-text">SHOWCASE</span>
                <span className="text-[#F05A37] text-4xl">✦</span>
                <span className="text-6xl font-black italic">EMPOWER</span>
                <span className="text-[#F05A37] text-4xl">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- MAIN BENTO GRID FEATURES (REVISI) --- */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Kartu Terang - Galeri Karya Mahasiswa */}
            <div className="bg-white rounded-[32px] p-8 md:p-10 flex flex-col justify-between group overflow-hidden relative border border-gray-100 min-h-[380px] shadow-sm hover:shadow-md transition-all duration-500">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full items-center relative z-10">
                
                {/* Sisi Kiri: Teks Informasi */}
                <div className="md:col-span-7 flex flex-col justify-between h-full min-h-[220px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F05A37] flex items-center justify-center mb-6">
                      <Layers size={24} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-gray-950 leading-tight">
                      Galeri <br />Karya Mahasiswa
                    </h2>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed max-w-[240px]">
                      Platform showcase untuk memamerkan proyek terbaikmu ke publik.
                    </p>
                  </div>
                  <div className="mt-6 md:mt-0">
                    <button className="text-gray-950 text-sm font-bold flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                      Explore Gallery <ArrowRight size={18} className="text-[#F05A37]" />
                    </button>
                  </div>
                </div>

                {/* Sisi Kanan: Frame Gambar Kreatif */}
                <div className="md:col-span-5 relative flex justify-center items-center h-full min-h-[200px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#F05A37]/10 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-700 relative z-10">
                    <Image
                      src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&auto=format&fit=crop"
                      alt="preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 220px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

              </div>
              <div className="absolute right-[-10%] bottom-[-10%] w-60 aspect-square bg-[#F05A37]/5 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Kartu Gelap - Pinjam Ruang & Alat */}
            <div className="bg-[#0F1115] rounded-[32px] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[380px] shadow-sm hover:shadow-lg transition-all duration-500 group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 text-[#F05A37] flex items-center justify-center mb-6">
                  <Package size={24} />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight leading-tight">
                  Pinjam Ruang <br />& Alat
                </h2>
                <p className="text-gray-300 text-sm font-medium leading-relaxed max-w-sm">
                  Sistem manajemen fasilitas kampus yang terintegrasi, transparan, dan instan.
                </p>
              </div>
              
              <div className="relative z-10 mt-8">
                <Link href="/dashboard_user/Ruangan" className="w-full block bg-[#F05A37] py-4 rounded-xl font-bold text-sm tracking-wide text-center hover:bg-[#d85036] active:scale-[0.99] transition-all duration-300 shadow-lg shadow-orange-500/10">
                  Book Now
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* --- SMALL BENTO CARDS --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Calendar size={20} /></div>
            <h3 className="font-bold text-sm text-gray-900">Upcoming Events</h3>
            <p className="text-xs text-gray-400">Workshop dan seminar terbaru.</p>
          </div>
          <div className="bg-[#F05A37] rounded-[24px] p-6 text-white flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><TrendingUp size={20} /></div>
            <h3 className="font-bold text-sm">Trending Proker</h3>
            <p className="text-white/70 text-xs">Update kegiatan himpunan.</p>
          </div>
          <div className="bg-white rounded-[24px] p-6 border border-gray-100 flex flex-col items-center text-center justify-center gap-3 hover:shadow-md transition-all duration-300">
            <div className="w-10 h-10 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><Palette size={20} /></div>
            <h3 className="font-bold text-sm text-gray-900">Creative Resource</h3>
            <p className="text-xs text-gray-400">Aset desain gratis mahasiswa.</p>
          </div>
        </section>

        {/* --- REFINED CTA SECTION --- */}
        <section className="mb-12">
          <Reveal direction="scale">
            <div className="bg-[#0F1115] rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10">
                <h2 className="text-white text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Ready to <span className="text-[#F05A37]">Impact</span> the World?
                </h2>
                <p className="text-white/60 text-sm md:text-base mb-8 max-w-xl mx-auto font-medium leading-relaxed">
                  Jadi bagian dari komunitas kreatif terbesar di kampus. Bagikan ide, temukan rekan kolaborasi, dan bangun portofolio impianmu.
                </p>
                <Link href="/dashboard_user/event" className="bg-white text-[#0F1115] px-8 py-4 rounded-full font-black text-sm hover:bg-[#F05A37] hover:text-white transition-all duration-500 shadow-xl shadow-orange-500/10 inline-flex justify-center">
                  JOIN THE HUB NOW
                </Link>
              </div>
            </div>
          </Reveal>
        </section>

        {/* --- MINIMAL FOOTER --- */}
        <footer className="py-8 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200 gap-4">
          <p className="text-xs font-medium text-gray-400">© 2026 CCHUB. FSRD UNIVERSITY.</p>
          <div className="flex gap-6 text-xs font-bold text-gray-600">
            <a href="#" className="hover:text-[#F05A37] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#F05A37] transition-colors">Behance</a>
            <a href="#" className="hover:text-[#F05A37] transition-colors">Dribbble</a>
          </div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Design Matters</p>
        </footer>
      </main>
    </div>
  )
}