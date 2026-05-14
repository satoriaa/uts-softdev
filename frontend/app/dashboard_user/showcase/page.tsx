'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Heart, ExternalLink, LayoutGrid, Filter } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  creator: string;
  category: string;
  likes: number;
  image: string;
}

export default function ShowcasePage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  // 🔎 Filter Project
  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;

    return projects.filter((p) => {
      const creator = p.creator?.toLowerCase() ?? '';
      const title = p.title?.toLowerCase() ?? '';
      const category = p.category?.toLowerCase() ?? '';

      return (
        title.includes(q) ||
        creator.includes(q) ||
        category.includes(q)
      );
    });
  }, [projects, query]);

  // 📡 Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://localhost:5000/api/karya', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          throw new Error(`Gagal mengambil data karya: ${res.status}`);
        }

        const json = await res.json();
        const data = Array.isArray(json?.data) ? json.data : [];

        const mapped: Project[] = data.map((k: any, idx: number) => ({
          id: idx,
          title: k.judul ?? 'Tanpa Judul',
          creator:
            k.username && k.nim
              ? `${k.username} (${k.nim})`
              : k.username ?? '-',
          category: k.deskripsi ?? 'Karya',
          likes: typeof k.like === 'number' ? k.like : 0,
          image: k.gambar ?? '',
        }));

        setProjects(mapped);
      } catch (e: any) {
        setError(e?.message ?? 'Terjadi kesalahan');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="text-[#EF6145]" size={28} />
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              User Showcase
            </h2>
          </div>

          <div className="h-1.5 w-32 bg-[#EF6145] rounded-full mb-4"></div>

          <p className="text-gray-500 font-medium max-w-lg">
            Galeri karya kreatif dan portofolio terbaik dari para user berbakat kami.
          </p>
        </div>

        {/* SEARCH */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EF6145]"
              size={18}
            />

            <input
              type="text"
              placeholder="Cari inspirasi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-72 pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-bold focus:ring-4 focus:ring-[#EF6145]/10 outline-none shadow-sm placeholder:text-gray-300"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {/* LOADING */}
        {loading ? (
          <div className="col-span-full text-center text-gray-500">
            Memuat data...
          </div>

        /* ERROR */
        ) : error ? (
          <div className="col-span-full text-center text-rose-500">
            {error}
          </div>

        /* EMPTY */
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">
            Tidak ada karya
          </div>

        /* SUCCESS */
        ) : (
          <>
            {filteredProjects.map((project) => (
              <div key={project.id} className="group">
                
                {/* IMAGE */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="fill-[#EF6145] text-[#EF6145]" />
                        <span className="font-bold text-sm">
                          {project.likes}
                        </span>
                      </div>

                      <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-[#EF6145]">
                        <ExternalLink size={18} />
                      </button>
                    </div>
                  </div>

                  {/* CATEGORY */}
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-white/90 text-[#EF6145] text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* INFO */}
                <div className="px-2">
                  <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#EF6145]">
                    {project.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1 italic">
                    by {project.creator}
                  </p>
                </div>
              </div>
            ))}

            {/* UPLOAD CARD */}
            <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 hover:bg-gray-50 hover:border-[#EF6145]/30 transition-all group cursor-pointer aspect-[4/5]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110">
                <span className="text-3xl text-[#EF6145]">+</span>
              </div>

              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Upload Karyamu
              </p>

              <p className="text-[10px] text-gray-300 mt-2">
                Dapatkan feedback dari komunitas
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}