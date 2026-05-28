'use client';

import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Search, Heart, ExternalLink, LayoutGrid, Filter, X, User } from 'lucide-react';
import io from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';
import { debounce } from '@/lib/rateLimit';


interface Project {
  id: number;
  title: string;
  creator: string;
  category: string;
  likes: number;
  image: string;
  _id?: string;
  likedBy?: string[];
}

// ==========================================
// 🌟 KOMPONEN MODAL POPUP DETAIL KARYA
// ==========================================
function ProjectDetailModal({ project, onClose, onApresiasi, currentUser, pending }: { project: Project; onClose: () => void; onApresiasi?: (p: Project) => void; currentUser?: any; pending?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      {/* Backdrop Klik untuk Menutup */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Box Konten Modal */}
      <div className="relative bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-gray-50 max-h-[92vh] flex flex-col z-10 animate-scale-up">
        
        {/* Tombol Close Pojok Kanan Atas */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md transition-all z-20 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Layout Grid Gambar & Detail */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          
          {/* Sisi Kiri: Gambar Karya */}
          <div className="md:col-span-7 bg-gray-900 relative min-h-[300px] md:min-h-[500px]">
            <img 
              src={project.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070'} 
              alt={project.title} 
              className="w-full h-full object-cover" 
            />
            {/* Tag Deskripsi/Kategori di Atas Gambar */}
            <div className="absolute bottom-5 left-5">
              <span className="px-4 py-1.5 bg-[#EF6145] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                {project.category}
              </span>
            </div>
          </div>

          {/* Sisi Kanan: Metadata & Informasi */}
          <div className="md:col-span-5 p-8 flex flex-col justify-between bg-white">
            <div className="space-y-6">
              {/* Judul Karya */}
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase italic mb-2">
                  {project.title}
                </h3>
                <div className="h-1 w-14 bg-[#EF6145] rounded-full"></div>
              </div>

              {/* Pembuat / Kreator */}
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-2 bg-white rounded-xl text-[#EF6145] shadow-sm">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kreator Karya</h4>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{project.creator}</p>
                </div>
              </div>

              {/* Ringkasan Status Likes */}
              <div className="flex items-center gap-3 px-1">
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-[#EF6145]">
                  <Heart size={16} className="fill-[#EF6145]" />
                  <span className="font-black text-sm">{project.likes} Likes</span>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="pt-8 mt-8 border-t border-gray-100 space-y-3">
              {/* Modal Apresiasi button with hover and persistent liked color */}
              <button disabled={!!pending} onClick={() => onApresiasi && onApresiasi(project)} className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transform transition-transform duration-150 ${pending ? 'opacity-70 scale-95 cursor-not-allowed' : 'hover:scale-101'} ${Array.isArray(project.likedBy) && currentUser && project.likedBy.map(String).includes(String(currentUser._id)) ? 'bg-pink-500 text-white' : 'bg-gray-900 hover:bg-pink-400 text-white'}`}>
                Apresiasi Karya
                <Heart size={14} />
              </button>

              <button 
                onClick={onClose}
                className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all"
              >
                Kembali ke Galeri
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default function ShowcasePage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const { user, token } = useAuthStore();
  const socketRef = useRef<any>(null);
  const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});
  
  // 🎯 State untuk menyimpan data karya yang sedang dibuka pop up-nya
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fn = debounce((val: string) => setDebouncedQuery(val), 300);
    fn(query);
  }, [query]);

  // 🔎 Filter Project
  const filteredProjects = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
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
  }, [projects, debouncedQuery]);


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
          // attach server-side id if exists
          _id: k._id,
          likedBy: k.likedBy || [],
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

  // setup socket to listen for karya updates (realtime likes)
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (!socketRef.current) {
      socketRef.current = io(base.replace(/\/$/, ''), { transports: ['websocket'], auth: { token } });
    }

    const sock = socketRef.current;
    sock.on('karya:updated', (payload: any) => {
      if (!payload || !payload.karyaId) return;
      setProjects((prev) => prev.map(p => {
        if (String(p._id) === String(payload.karyaId)) {
          return { ...p, likes: payload.likes };
        }
        return p;
      }));
    });

    return () => {
      try {
        sock.off('karya:updated');
        // do not disconnect global socket because NotificationBell also uses socket
      } catch (e) {}
    }
  }, [token]);

  // helper: find project index by server _id
  const findProjectIndexByServerId = (id?: string) => projects.findIndex(p => String((p as any)._id) === String(id));

  // toggle appreciation with optimistic UI and pending state
  const toggleApresiasi = async (project: Project) => {
    if (!token || !user) {
      alert('Silakan login terlebih dahulu untuk memberikan apresiasi.');
      return;
    }

    const serverId = (project as any)._id;
    if (!serverId) {
      alert('Karya tidak valid');
      return;
    }

    const idx = findProjectIndexByServerId(serverId);
    if (idx === -1) return;

    const alreadyLiked = Array.isArray((project as any).likedBy) && (project as any).likedBy.map(String).includes(String(user._id));

    // optimistic likedBy and likes update
    setProjects(prev => prev.map(p => {
      if (String((p as any)._id) !== String(serverId)) return p;
      const newLikes = alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
      const newLikedBy = alreadyLiked ? ((p.likedBy || []) as string[]).filter(id => String(id) !== String(user._id)) : [ ...( (p.likedBy || []) as string[] ), user._id ];
      return { ...p, likes: newLikes, likedBy: newLikedBy } as Project;
    }));

    // set pending state for this karya to disable button & show press animation
    setPendingMap(prev => ({ ...prev, [serverId]: true }));

    try {
      const url = `http://localhost:5000/api/karya/${serverId}/like`;
      const res = await fetch(url, {
        method: alreadyLiked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || 'Gagal melakukan aksi');

      // reconcile likes from server
      setProjects(prev => prev.map(p => {
        if (String((p as any)._id) !== String(serverId)) return p;
        const updatedLikes = typeof json?.likes === 'number' ? json.likes : p.likes;
        // update likedBy based on whether now liked or not
        const nowLiked = !alreadyLiked;
        const updatedLikedBy = nowLiked ? [ ...( (p.likedBy || []) as string[] ).filter(Boolean), user._id ] : ((p.likedBy || []) as string[]).filter(id => String(id) !== String(user._id));
        return { ...p, likes: updatedLikes, likedBy: updatedLikedBy } as Project;
      }));

    } catch (e: any) {
      // revert optimistic change on error
      console.error(e);
      setProjects(prev => prev.map(p => {
        if (String((p as any)._id) !== String(serverId)) return p;
        return project; // revert to original project snapshot
      }));
      alert(e?.message || 'Gagal berkomunikasi dengan server');
    } finally {
      setPendingMap(prev => ({ ...prev, [serverId]: false }));
    }
  };

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

        {/* SEARCH & FILTER BUTTON */}
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

      {/* GRID KONTEN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {/* LOADING */}
        {loading ? (
          <div className="col-span-full text-center text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse py-12">
            Memuat data...
          </div>

        /* ERROR */
        ) : error ? (
          <div className="col-span-full max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl text-center text-sm">
            {error}
          </div>

        /* EMPTY */
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-sm font-bold text-gray-400 uppercase tracking-widest py-12 border border-dashed rounded-[2.5rem]">
            Tidak ada karya ditemukan
          </div>

        /* SUCCESS RENDER DATA */
        ) : (
          <>
            {filteredProjects.map((project) => (
              <div key={project.id} className="group">
                
                {/* IMAGE BOX */}
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* OVERLAY HOVER */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="fill-[#EF6145] text-[#EF6145]" />
                        <span className="font-bold text-sm">
                          {project.likes}
                        </span>
                      </div>

                      {/* Tombol Buka Detail Popup via Icon */}
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedProject(project)}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-[#EF6145] text-white transition-all"
                          >
                            <ExternalLink size={18} />
                          </button>

                          {/* Apresiasi toggle with optimistic UI and press animation */}
                          {(() => {
                              // derive up-to-date project from state to avoid stale snapshot
                              const current = projects.find(p => String((p as any)._id) === String((project as any)._id)) || project;
                              const isLiked = Array.isArray(current.likedBy) && current.likedBy.map(String).includes(String(user?._id));
                              const pending = !!pendingMap[String((current as any)._id)];
                              return (
                                <button
                                  disabled={pending}
                                  onClick={() => toggleApresiasi(current)}
                                  className={`p-3 rounded-xl text-white transform transition-transform duration-150 ${isLiked ? 'bg-pink-500' : 'bg-white/20 hover:bg-pink-400'} ${pending ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-110 active:scale-95'}`}>
                                  <Heart size={16} className={`${isLiked ? 'fill-current' : ''}`} />
                                </button>
                              )
                            })()}
                        </div>
                    </div>
                  </div>

                  {/* CATEGORY LABEL */}
                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* INFO TEXT */}
                <div className="px-2">
                  {/* Klik Judul juga memicu pembukaan popup */}
                  <h3 
                    onClick={() => setSelectedProject(project)}
                    className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#EF6145] cursor-pointer transition-colors"
                  >
                    {project.title}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1 italic">
                    by {project.creator}
                  </p>
                </div>
              </div>
            ))}

            {/* UPLOAD CARD PLACEHOLDER */}
            <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 hover:bg-gray-50 hover:border-[#EF6145]/30 transition-all group cursor-pointer aspect-[4/5]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl text-[#EF6145] font-light">+</span>
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

      {/* ==========================================
          RENDER POPUP JIKA KARYA DIKLIK
         ========================================== */}
      {selectedProject && (() => {
        // find latest project object from projects state
        const latest = projects.find(p => String((p as any)._id) === String((selectedProject as any)._id)) || selectedProject;
        return (
          <ProjectDetailModal 
            project={latest} 
            onClose={() => setSelectedProject(null)} 
            onApresiasi={toggleApresiasi}
            currentUser={user}
            pending={!!pendingMap[String((latest as any)._id)]}
          />
        )
      })()}
    </div>
  );
}