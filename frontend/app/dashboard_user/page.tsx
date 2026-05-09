'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  Home,
  Image as ImageIcon,
  Archive,
  Calendar,
  User,
  ArrowRight,
  Package,
  Camera,
  Palette,
  TrendingUp,
} from 'lucide-react'

// --- CUSTOM STYLES & FONTS ---
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  :root {
    --color-cream: #F5F3ED;
    --color-orange: #F05A37;
    --color-dark: #121212;
  }

  body {
    background-color: var(--color-cream);
    color: var(--color-dark);
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .ease-out-expo {
    transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
  }
  .animate-marquee {
    display: flex;
    white-space: nowrap;
    animation: marquee 25s linear infinite;
  }

  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 50;
  }
`

const Reveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'scale'
  className?: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    if (ref.current) observer.observe(ref.current)
    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [])

  const getTransform = () => {
    if (direction === 'up') return 'translate-y-16'
    if (direction === 'left') return '-translate-x-16'
    if (direction === 'right') return 'translate-x-16'
    if (direction === 'scale') return 'scale-95'
    return 'translate-y-0'
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        'transition-all duration-1000 ease-out-expo ' +
        className +
        (isVisible
          ? ' opacity-100 transform-none'
          : ` opacity-0 ${getTransform()}`)
      }
    >
      {children}
    </div>
  )
}

// --- MAIN APPLICATION ---
export default function UserHomePage() {
  const [loading, setLoading] = useState(true)
  const [activeMenu, setActiveMenu] = useState('Home')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const menuItems = useMemo(
    () => [
      { name: 'Home', icon: Home, href: '/user-home' },
      { name: 'Showcase', icon: ImageIcon, href: '/dashboard_user/showcase' },

      { name: 'Pinjam Ruangan', icon: Archive, href: '/dashboard_user/pinjaman-ruangan' },
      { name: 'Proker', icon: Calendar, href: '/dashboard_user/proker' },
      { name: 'Event', icon: Calendar, href: '/dashboard_user/event' },
      { name: 'Profil', icon: User, href: '/dashboard_user' },
    ],
    []
  )

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#F05A37] z-[100] flex flex-col items-center justify-center overflow-hidden">
        <style dangerouslySetInnerHTML={{ __html: customStyles }} />
        <div className="absolute inset-0 bg-noise opacity-10"></div>

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

        <style
          dangerouslySetInnerHTML={{
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
            `,
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative selection:bg-[#F05A37] selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="bg-noise fixed pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="fixed left-6 top-6 bottom-6 w-72 bg-white/60 backdrop-blur-2xl border border-white/40 rounded-[40px] p-8 hidden lg:flex flex-col justify-between z-40 shadow-[0_8px_40px_rgb(0,0,0,0.03)]">
        <div>
          <h2 className="text-2xl font-black leading-tight tracking-tight mb-2">
            Central<br />Creative<br />Hub<span className="text-[#F05A37]">.</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium tracking-wide">FSRD UNTAR</p>

          <nav className="mt-12 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeMenu === item.name
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActiveMenu(item.name)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ease-out-expo group ${
                    isActive
                      ? 'bg-[#F05A37] text-white shadow-lg shadow-[#F05A37]/20 transform scale-[1.02]'
                      : 'hover:bg-white text-gray-600 hover:text-[#F05A37] hover:shadow-sm'
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`transition-transform duration-300 ${
                      isActive ? '' : 'group-hover:scale-110'
                    }`}
                  />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </a>
              )
            })}
          </nav>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-5 rounded-3xl border border-orange-100">
          <div className="w-10 h-10 bg-[#F05A37] rounded-full flex items-center justify-center mb-3">
            <User size={18} className="text-white" />
          </div>
          <p className="text-sm font-bold">Andi Prasetyo</p>
          <p className="text-xs text-gray-500 truncate">andi.prasetyo@student.untar.ac.id</p>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[32px] p-2 flex justify-between items-center z-50 lg:hidden shadow-xl">


        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = activeMenu === item.name
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActiveMenu(item.name)}
              className={`p-4 rounded-2xl transition-all duration-300 flex flex-col items-center gap-1 ${
                isActive ? 'bg-[#F05A37] text-white' : 'text-gray-400 hover:text-[#F05A37]'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span
                className="text-[10px] font-bold opacity-0 h-0 data-[active=true]:opacity-100 data-[active=true]:h-auto transition-all"
                data-active={isActive}
              >
                {item.name}
              </span>
            </a>
          )
        })}
      </nav>

      <main className="w-full lg:pl-[320px] p-4 lg:p-8 pb-32 lg:pb-8">
        {/* HERO SECTION */}
        <Reveal direction="scale">
          <section className="relative h-[85vh] w-full rounded-[40px] overflow-hidden group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full">
              <div className="max-w-3xl">
                <Reveal delay={200}>
                  <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-6">
                    Central<br />Creative Hub.
                  </h1>
                </Reveal>
                <Reveal delay={400}>
                  <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
                    Platform ekosistem digital untuk mahasiswa Fakultas Seni Rupa dan Desain. Showcase karya, kelola inventaris, dan temukan inspirasi.
                  </p>
                </Reveal>
                <Reveal delay={600}>
                  <div className="flex flex-wrap gap-4">
                    <button className="bg-[#F05A37] hover:bg-[#d04b2a] text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(240,90,55,0.4)] flex items-center gap-2">
                      Jelajahi Karya <ArrowRight size={18} />
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 hover:scale-105">
                      Lihat Event
                    </button>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </Reveal>

        {/* MARQUEE SECTION */}
        <section className="py-12 md:py-20 overflow-hidden relative border-b border-gray-200/50">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#F5F3ED] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#F5F3ED] to-transparent z-10" />

          <div className="flex w-[200%]">
            <div className="animate-marquee flex items-center gap-12">
              {[...Array(2)].map((_, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-4xl md:text-6xl font-black text-gray-300/50 tracking-tighter uppercase">SHOWCASE</span>
                  <span className="text-[#F05A37] text-2xl">✦</span>
                  <span className="text-4xl md:text-6xl font-black text-gray-300/50 tracking-tighter uppercase">EVENT</span>
                  <span className="text-[#F05A37] text-2xl">✦</span>
                  <span className="text-4xl md:text-6xl font-black text-gray-300/50 tracking-tighter uppercase">KARYA</span>
                  <span className="text-[#F05A37] text-2xl">✦</span>
                  <span className="text-4xl md:text-6xl font-black text-gray-300/50 tracking-tighter uppercase">FSRD</span>
                  <span className="text-[#F05A37] text-2xl">✦</span>
                  <span className="text-4xl md:text-6xl font-black text-[#F05A37]/20 tracking-tighter uppercase">CREATIVE HUB</span>
                  <span className="text-[#F05A37] text-2xl">✦</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* KARYA TERBARU + FEATURES + EVENT (ringkas tapi tetap sesuai style) */}
        <section className="py-16 md:py-24">
          <div className="flex justify-between items-end mb-12">
            <Reveal>
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Karya Terbaru</h2>
                <p className="text-gray-500 font-medium">Eksplorasi karya terbaru dari mahasiswa FSRD</p>
              </div>
            </Reveal>
            <Reveal delay={200} direction="left">
              <button className="hidden md:flex items-center gap-2 font-bold hover:text-[#F05A37] transition-colors group">
                Lihat Semua <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              'https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1578301978018-3005759f48f7?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=800&auto=format&fit=crop',
            ].map((img, i) => (
              <Reveal key={i} delay={i * 150} direction="up" className="group">
                <div className="bg-white rounded-[32px] p-3 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out-expo cursor-pointer border border-gray-100">
                  <div className="relative w-full aspect-square rounded-[24px] overflow-hidden mb-5">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-expo group-hover:scale-110"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  </div>
                  <div className="px-3 pb-3">
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#F05A37] transition-colors">Urban Synthesis</h3>
                    <p className="text-sm text-gray-500 font-medium">Andi Prasetyo</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* PROKER SECTION (height seperti Karya) */}
        <section id="proker" className="py-16 md:py-24">
          <div className="flex justify-between items-end mb-12">
            <Reveal>
              <div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-3">Proker</h2>
                <p className="text-gray-500 font-medium">Program kerja FSRD yang sedang berjalan</p>
              </div>
            </Reveal>
            <Reveal delay={200} direction="left">
              <button className="hidden md:flex items-center gap-2 font-bold hover:text-[#F05A37] transition-colors group">
                Lihat Semua <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1541807084-5c52b6c9b1ab?q=80&w=800&auto=format&fit=crop',
                judul: 'Workshop Tipografi',
                org: 'FSRD',
                href: '/dashboard_user/proker',
              },
              {
                img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
                judul: 'Pameran Karya Semester',
                org: 'FSRD',
                href: '/dashboard_user/proker',
              },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 170} direction="up" className="group">
                <a href={p.href} className="block">
                  <div className="bg-white rounded-[32px] p-3 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 ease-out-expo cursor-pointer border border-gray-100">
                    <div className="relative w-full h-[260px] rounded-[24px] overflow-hidden mb-5">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-expo group-hover:scale-110"
                        style={{ backgroundImage: `url('${p.img}')` }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </div>
                    <div className="px-3 pb-3">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-[#F05A37] transition-colors">{p.judul}</h3>
                      <p className="text-sm text-gray-500 font-medium">{p.org}</p>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Reveal delay={100}>
              <div className="bg-white rounded-[40px] p-10 h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden border border-gray-100">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl group-hover:bg-orange-100 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[#F05A37] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <ImageIcon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black mb-3">Showcase Karya</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  Pamerkan hasil karya terbaikmu dan dapatkan apresiasi dari komunitas FSRD.
                </p>
                <div className="mt-auto flex items-center gap-2 text-[#F05A37] font-bold group-hover:gap-4 transition-all">
                  Lihat showcase <ArrowRight size={18} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-white rounded-[40px] p-10 h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden border border-gray-100">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Package size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black mb-3">Pinjam Ruangan</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  Ajukan peminjaman ruang untuk kebutuhan kegiatanmu secara cepat dan terjadwal.
                </p>
                <div className="mt-auto flex items-center gap-2 text-blue-500 font-bold group-hover:gap-4 transition-all">
                  Pinjam ruangan <ArrowRight size={18} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <div className="bg-white rounded-[40px] p-10 h-full shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden border border-gray-100">
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full blur-3xl group-hover:bg-green-100 transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Calendar size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-black mb-3">Event</h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-8">
                  Ikuti berbagai event, workshop, dan seminar untuk mengembangkan skill kamu.
                </p>
                <div className="mt-auto flex items-center gap-2 text-green-500 font-bold group-hover:gap-4 transition-all">
                  Lihat event <ArrowRight size={18} />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <Reveal direction="scale" delay={200}>
          <section className="mt-12 bg-[#F05A37] rounded-[48px] p-12 md:p-24 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-50" />
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <TrendingUp size={64} strokeWidth={1} className="mb-8 opacity-80" />
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-tight">
                Mulai Showcase Karyamu
              </h2>
              <p className="text-lg md:text-xl font-medium text-white/80 mb-12">
                Bergabung dengan ratusan mahasiswa FSRD yang sudah membagikan karya mereka ke dunia.
              </p>
              <button className="bg-white text-[#F05A37] px-10 py-5 rounded-full font-black text-lg tracking-wide hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 ease-out-expo">
                Upload Karya Sekarang
              </button>
            </div>
          </section>
        </Reveal>

        <footer className="mt-24 pt-16 border-t border-gray-200/60 text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-4">
                Central Creative Hub<span className="text-[#F05A37]">.</span>
              </h3>
              <p className="font-medium text-sm leading-relaxed max-w-xs">
                Platform ekosistem digital untuk Fakultas Seni Rupa dan Desain.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">Navigasi</h4>
              <ul className="space-y-4 font-medium text-sm">
                <li>
                  <a href="/user-home" className="hover:text-[#F05A37] transition-colors">Home</a>
                </li>
                <li>
                  <a href="/dashboard_user/showcase" className="hover:text-[#F05A37] transition-colors">Showcase</a>
                </li>
                <li>
                  <a href="/dashboard_user/event" className="hover:text-[#F05A37] transition-colors">Events</a>
                </li>
                <li>
                  <a href="/dashboard_user/inventaris" className="hover:text-[#F05A37] transition-colors">Inventaris</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">Akademik</h4>
              <ul className="space-y-4 font-medium text-sm">
                <li>
                  <a href="#" className="hover:text-[#F05A37] transition-colors">Desain Komunikasi Visual</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F05A37] transition-colors">Desain Grafis</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F05A37] transition-colors">Fotografi</a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F05A37] transition-colors">Ilustrasi</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-6 tracking-wide">Kontak</h4>
              <ul className="space-y-4 font-medium text-sm">
                <li className="flex items-center gap-2">
                  <Archive size={16} /> fsrd@university.ac.id
                </li>
                <li className="flex gap-4 mt-6">
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#F05A37] hover:text-white transition-all text-gray-900">
                    <Camera size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-[#F05A37] hover:text-white transition-all text-gray-900">
                    <Palette size={18} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-200/60 text-xs font-medium pb-8">
            <p>© 2026 Central Creative Hub - FSRD University. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#F05A37] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#F05A37] transition-colors">Terms of Service</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}




