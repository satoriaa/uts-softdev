'use client'

import React, { useEffect, useRef, useState } from 'react'
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
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

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

const Reveal = ({ children, delay = 0, direction = 'up', className = '' }: any) => {
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
    <div className="min-h-screen relative selection:bg-[#F05A37] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="bg-noise fixed inset-0 z-[100]" />
      
      <main className="p-4 lg:p-8">
        {/* --- HERO SECTION --- */}
        <section className="relative min-h-[90vh] w-full rounded-[48px] overflow-hidden group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[15s] ease-out group-hover:scale-105"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2000&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20">
            <Reveal direction="scale">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase mb-6">
                Creative Hub Hub Ecosystem
              </span>
              <h1 className="text-white text-6xl md:text-8xl lg:text-[10rem] font-black tracking-[-0.05em] leading-[0.85] mb-8">
                Design <br /> <span className="text-[#F05A37] font-serif-italic">Matters.</span>
              </h1>
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <p className="text-white/70 text-lg md:text-xl max-w-md font-medium leading-relaxed">
                  Ruang kolaborasi digital untuk para visioner muda dalam mengekspresikan seni dan desain.
                </p>
                <button className="bg-white text-dark h-16 px-8 rounded-full font-black flex items-center gap-3 hover:bg-[#F05A37] hover:text-white transition-all duration-500 hover:scale-105">
                  START EXPLORING <ArrowRight size={20} />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* --- MARQUEE SECTION (REINSTATED) --- */}
        <div className="py-24 overflow-hidden">
          <div className="animate-marquee">
            {[...Array(2)].map((_, listIdx) => (
              <div key={listIdx} className="flex items-center gap-12 pr-12">
                <span className="text-8xl font-black italic outline-text">CREATIVITY</span>
                <span className="text-[#F05A37] text-6xl">✦</span>
                <span className="text-8xl font-black italic">INNOVATION</span>
                <span className="text-[#F05A37] text-6xl">✦</span>
                <span className="text-8xl font-black italic outline-text">SHOWCASE</span>
                <span className="text-[#F05A37] text-6xl">✦</span>
                <span className="text-8xl font-black italic">EMPOWER</span>
                <span className="text-[#F05A37] text-6xl">✦</span>
              </div>
            ))}
          </div>
        </div>

        {/* --- BENTO GRID FEATURES --- */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
            {/* Main Bento Card */}
            <div className="md:col-span-7 bg-white rounded-[40px] p-10 flex flex-col justify-between group overflow-hidden relative border border-gray-100 min-h-[450px]">
               <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#F05A37] flex items-center justify-center mb-6">
                    <Layers size={28} />
                  </div>
                  <h2 className="text-4xl font-black mb-4">Galeri <br />Karya Mahasiswa</h2>
                  <p className="text-gray-500 max-w-xs font-medium">Platform showcase untuk memamerkan proyek terbaikmu ke publik.</p>
               </div>
               <div className="relative z-10 mt-10">
                 <button className="text-dark font-bold flex items-center gap-2 group-hover:gap-4 transition-all">
                   Explore Gallery <ArrowRight size={20} className="text-[#F05A37]" />
                 </button>
               </div>
               <div className="absolute right-[-10%] bottom-[-10%] w-2/3 aspect-square bg-[#F05A37]/5 rounded-full blur-3xl group-hover:bg-[#F05A37]/10 transition-colors" />
               <img 
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=600&auto=format&fit=crop" 
                className="absolute right-10 bottom-[-20px] w-64 h-64 object-cover rounded-3xl rotate-12 group-hover:rotate-6 group-hover:translate-y-[-20px] transition-all duration-700 shadow-2xl hidden md:block"
                alt="preview"
               />
            </div>

            {/* Dark Card */}
            <div className="md:col-span-5 bg-dark rounded-[40px] p-10 flex flex-col justify-between text-white relative overflow-hidden min-h-[450px]">
               <div>
                  <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#F05A37] flex items-center justify-center mb-6">
                    <Package size={28} />
                  </div>
                  <h2 className="text-3xl font-black mb-4">Pinjam Ruang & Alat</h2>
                  <p className="text-white/50 font-medium">Sistem manajemen fasilitas kampus yang terintegrasi dan instan.</p>
               </div>
               <button className="w-full bg-[#F05A37] py-5 rounded-2xl font-bold hover:scale-[0.98] transition-transform">Book Now</button>
            </div>

            {/* Small Bento Cards */}
            <div className="md:col-span-4 bg-white rounded-[40px] p-8 border border-gray-100 flex flex-col items-center text-center justify-center gap-4 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center"><Calendar /></div>
                <h3 className="font-bold">Upcoming Events</h3>
                <p className="text-sm text-gray-400">Workshop dan seminar terbaru.</p>
            </div>
            <div className="md:col-span-4 bg-[#F05A37] rounded-[40px] p-8 text-white flex flex-col items-center text-center justify-center gap-4 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"><TrendingUp /></div>
                <h3 className="font-bold">Trending Proker</h3>
                <p className="text-white/70 text-sm">Update kegiatan himpunan.</p>
            </div>
            <div className="md:col-span-4 bg-white rounded-[40px] p-8 border border-gray-100 flex flex-col items-center text-center justify-center gap-4 hover:shadow-xl transition-all">
                <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center"><Palette /></div>
                <h3 className="font-bold">Creative Resource</h3>
                <p className="text-sm text-gray-400">Aset desain gratis mahasiswa.</p>
            </div>
          </div>
        </section>

        {/* --- REFINED CTA SECTION --- */}
        <section className="py-24">
          <Reveal direction="scale">
            <div className="bg-dark rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
               <div className="relative z-10">
                 <h2 className="text-white text-5xl md:text-7xl font-black mb-8 leading-tight">
                   Ready to <span className="text-[#F05A37]">Impact</span> the World?
                 </h2>
                 <p className="text-white/60 text-lg mb-12 max-w-2xl mx-auto font-medium">
                   Jadilah bagian dari komunitas kreatif terbesar di kampus. Bagikan ide, temukan rekan kolaborasi, dan bangun portofolio impianmu.
                 </p>
                 <button className="bg-white text-dark px-12 py-6 rounded-full font-black text-xl hover:bg-[#F05A37] hover:text-white transition-all duration-500 shadow-2xl shadow-orange-500/20">
                   JOIN THE HUB NOW
                 </button>
               </div>
            </div>
          </Reveal>
        </section>

        {/* --- MINIMAL FOOTER --- */}
        <footer className="py-12 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 gap-6">
           <p className="text-sm font-medium text-gray-400">© 2026 CCHUB. FSRD UNIVERSITY.</p>
           <div className="flex gap-8 text-sm font-bold">
             <a href="#" className="hover:text-[#F05A37] transition-colors">Instagram</a>
             <a href="#" className="hover:text-[#F05A37] transition-colors">Behance</a>
             <a href="#" className="hover:text-[#F05A37] transition-colors">Dribbble</a>
           </div>
           <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Design Matters</p>
        </footer>
      </main>
    </div>
  )
}