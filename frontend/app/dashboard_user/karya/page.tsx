'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '@/lib/axios';
import {
  Image as ImageIcon,
  Archive,
  Calendar,
  User,
  Camera,
  Palette,
  ArrowRight,
  ImageIcon as ImageLucide,
} from 'lucide-react';

type Karya = {
  _id: string;
  judul?: string;
  judul_karya?: string;
  nama?: string;
  author?: string;
  kategori?: string;
  kategori_karya?: string;
  deskripsi?: string;
  gambar?: string;
  createdAt?: string;
};

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

  .bg-noise {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    opacity: 0.03;
    pointer-events: none;
    position: absolute;
    inset: 0;
    z-index: 50;
  }
`;

const Reveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useState<{ current: HTMLDivElement | null }>({ current: null })[0];

  // NOTE: We intentionally keep this simple and reuse IntersectionObserver without extra refs.
  // It is safe for client components.
  const [node, setNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  const getTransform = () => {
    if (direction === 'up') return 'translate-y-16';
    if (direction === 'left') return '-translate-x-16';
    if (direction === 'right') return 'translate-x-16';
    if (direction === 'scale') return 'scale-95';
    return 'translate-y-0';
  };

  return (
    <div
      ref={setNode as any}
      style={{ transitionDelay: `${delay}ms` }}
      className={
        'transition-all duration-1000 ease-out-expo ' +
        className +
        (isVisible ? ' opacity-100 transform-none' : ` opacity-0 ${getTransform()}`)
      }
    >
      {children}
    </div>
  );
};

export default function DashboardKaryaPage() {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [karya, setKarya] = useState<Karya[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKarya = async () => {
      try {
        const res = await api.get('/karya');
        setKarya((res.data?.data ?? []) as Karya[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchKarya();
  }, []);

  const filters = useMemo(() => ['Semua', 'Foto', 'Desain', 'Video', 'Ilustrasi'], []);

  const filtered = useMemo(() => {
    if (activeFilter === 'Semua') return karya;
    return karya.filter((k) => {
      const cat = (k.kategori ?? k.kategori_karya ?? '').toLowerCase();
      return cat.includes(activeFilter.toLowerCase());
    });
  }, [activeFilter, karya]);

  return (
    <div className="relative min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <div className="bg-noise fixed pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full px-0">
        <div className="mb-6">
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tighter">
            Karya
          </h2>
          <p className="text-gray-500 mt-3 text-xl">Kelola dan tampilkan karya mahasiswa.</p>
        </div>

        {/* HERO FILTER */}
        <Reveal direction="scale" delay={100}>
          <section className="relative h-[60vh] w-full rounded-[40px] overflow-hidden group mb-10">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear group-hover:scale-110"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col justify-end h-full">
              <div className="max-w-4xl">
                <Reveal delay={200}>
                  <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-4">
                    Showcase Karya Mahasiswa
                  </h1>
                </Reveal>
                <Reveal delay={400}>
                  <p className="text-white/80 text-lg md:text-xl font-medium mb-10">
                    Jelajahi karya-karya inspiratif dari mahasiswa FSRD
                  </p>
                </Reveal>

                <Reveal delay={600}>
                  <div className="flex flex-wrap gap-3">
                    {filters.map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 ease-out-expo ${
                          activeFilter === filter
                            ? 'bg-[#F05A37] text-white shadow-[0_0_20px_rgba(240,90,55,0.4)] scale-105'
                            : 'bg-black/40 backdrop-blur-md text-white/70 border border-white/10 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        </Reveal>

        {/* GRID */}
        <section className="py-4">
          {loading ? (
            <div className="text-gray-500 text-center py-20">Memuat karya...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((item: any, i) => {
                const title = item?.judul ?? item?.judul_karya ?? 'Karya'
                const author = item?.author ?? item?.nama ?? 'Unknown'
                const category = item?.kategori ?? item?.kategori_karya ?? ''
                const image = item?.gambar ?? ''

                return (
                  <Reveal key={item?._id ?? i} delay={i * 80} direction="up" className="group">
                    <div className="bg-transparent group cursor-pointer h-full flex flex-col">
                      <div className="relative w-full aspect-square rounded-[32px] overflow-hidden mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out-expo group-hover:scale-110"
                          style={{
                            backgroundImage: image
                              ? `url('${image}')`
                              : "url('https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=800&auto=format&fit=crop')",
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                      </div>

                      <div className="px-2 flex flex-col items-start">
                        <h3 className="text-2xl font-black mb-1 text-gray-900 group-hover:text-[#F05A37] transition-colors duration-300">
                          {title}
                        </h3>
                        <p className="text-base text-gray-500 font-medium mb-3">{author}</p>
                        {category ? (
                          <span className="bg-[#F05A37] text-white text-[11px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                            {category}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                )
              })}

              {filtered.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-16">
                  Tidak ada karya untuk filter: {activeFilter}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

