'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Heart, ExternalLink, LayoutGrid, X, User } from 'lucide-react';
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

function ProjectDetailModal({
  project,
  onClose,
  onApresiasi,
  currentUser,
  pending,
}: {
  project: Project;
  onClose: () => void;
  onApresiasi?: (p: Project) => void;
  currentUser?: any;
  pending?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl border border-gray-50 max-h-[92vh] flex flex-col z-10 animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md transition-all z-20 group"
        >
          <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto">
          <div className="md:col-span-7 bg-gray-900 relative min-h-[300px] md:min-h-[500px]">
            <img src={project.image || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070'} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-5 left-5">
              <span className="px-4 py-1.5 bg-[#EF6145] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg">
                {project.category}
              </span>
            </div>
          </div>

          <div className="md:col-span-5 p-8 flex flex-col justify-between bg-white">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase italic mb-2">{project.title}</h3>
                <div className="h-1 w-14 bg-[#EF6145] rounded-full" />
              </div>

              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-2 bg-white rounded-xl text-[#EF6145] shadow-sm">
                  <User size={18} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Kreator Karya</h4>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{project.creator}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl text-[#EF6145]">
                  <Heart size={16} className="fill-[#EF6145]" />
                  <span className="font-black text-sm">{project.likes} Likes</span>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-gray-100 space-y-3">
              <button
                disabled={!!pending}
                onClick={() => onApresiasi && onApresiasi(project)}
                className={`w-full py-4 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg transform transition-transform duration-150 ${pending ? 'opacity-70 scale-95 cursor-not-allowed' : 'hover:scale-101'} ${Array.isArray(project.likedBy) && currentUser && project.likedBy.map(String).includes(String(currentUser._id)) ? 'bg-pink-500 text-white' : 'bg-gray-900 hover:bg-pink-400 text-white'}`}
              >
                Apresiasi Karya
                <Heart size={14} />
              </button>

              <button onClick={onClose} className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all">
                Kembali ke Galeri
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function mapKaryaToProject(data: any, idx: number): Project {
  return {
    id: idx,
    title: data.judul ?? 'Tanpa Judul',
    creator: data.username && data.nim ? `${data.username} (${data.nim})` : data.username ?? '-',
    category: data.kategori ?? data.deskripsi ?? 'Karya',

    likes: typeof data.like === 'number' ? data.like : 0,
    _id: data._id,
    likedBy: data.likedBy || [],
    image: data.gambar ?? '',
  };
}

export default function ShowcasePage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'latest'>('latest');
  const [showFilter, setShowFilter] = useState(false);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);


  const { user, token } = useAuthStore();
  const socketRef = useRef<any>(null);
  const [pendingMap, setPendingMap] = useState<Record<string, boolean>>({});

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Infinite scroll state
  const PAGE_SIZE = 6;
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
    const fn = debounce((val: string) => setDebouncedQuery(val), 300);
    fn(query);

    // Reset pagination when user changes the search query.
    // (We only show filtered items from fetched results; resetting ensures newer matches load.)
    setProjects([]);
    setOffset(0);
    setHasMore(true);
    setError(null);
    setLoading(false);
    setLoadingMore(false);
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const filteredProjects = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    let result = projects;

    // Filter kategori
    if (category !== 'all') {
      const c = category.trim().toLowerCase();
      result = result.filter((p) => (p.category ?? '').toLowerCase() === c);
    }

    // Filter query
    if (q) {
      result = result.filter((p) => {
        const creator = p.creator?.toLowerCase() ?? '';
        const title = p.title?.toLowerCase() ?? '';
        const categoryText = p.category?.toLowerCase() ?? '';
        return title.includes(q) || creator.includes(q) || categoryText.includes(q);
      });
    }

    // Sorting
    const sorted = [...result];
    if (sortBy === 'popular') {
      sorted.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    } else {
      // latest: fallback to original order from server (offset-based id) when createdAt isn't available
      sorted.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
    }

    return sorted;
  }, [projects, debouncedQuery, category, sortBy]);


const fetchPage = async (nextOffset: number, replace: boolean) => {
    // Note: current implementation paginates server results; current filter only affects
    // what is rendered from already-fetched data.
    if (nextOffset === 0 && !replace) return;
    try {
      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const res = await fetch(`http://localhost:5000/api/karya?limit=${PAGE_SIZE}&offset=${nextOffset}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) throw new Error(`Gagal mengambil data karya: ${res.status}`);

      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : [];

      const mapped: Project[] = data.map((k: any, idx: number) => mapKaryaToProject(k, nextOffset + idx));

      setProjects((prev) => (replace ? mapped : [...prev, ...mapped]));
      setHasMore(mapped.length === PAGE_SIZE);
      setOffset(nextOffset + mapped.length);
    } catch (e: any) {
      setError(e?.message ?? 'Terjadi kesalahan');
      setHasMore(false);
    } finally {
      if (replace) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime likes/socket
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (!socketRef.current) {
      socketRef.current = io(base.replace(/\/$/, ''), { transports: ['websocket'], auth: { token } });
    }

    const sock = socketRef.current;
    sock.on('karya:updated', (payload: any) => {
      if (!payload || !payload.karyaId) return;
      setProjects((prev) =>
        prev.map((p) => {
          if (String((p as any)._id) === String(payload.karyaId)) {
            return { ...p, likes: payload.likes };
          }
          return p;
        })
      );
    });

    return () => {
      try {
        sock.off('karya:updated');
      } catch {}
    };
  }, [token]);

  const findProjectIndexByServerId = (id?: string) => projects.findIndex((p) => String((p as any)._id) === String(id));

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

    setProjects((prev) =>
      prev.map((p) => {
        if (String((p as any)._id) !== String(serverId)) return p;
        const newLikes = alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1;
        const newLikedBy = alreadyLiked
          ? ((p.likedBy || []) as string[]).filter((id) => String(id) !== String(user._id))
          : [...((p.likedBy || []) as string[]), user._id];
        return { ...p, likes: newLikes, likedBy: newLikedBy } as Project;
      })
    );

    setPendingMap((prev) => ({ ...prev, [serverId]: true }));

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

      setProjects((prev) =>
        prev.map((p) => {
          if (String((p as any)._id) !== String(serverId)) return p;
          const updatedLikes = typeof json?.likes === 'number' ? json.likes : p.likes;
          const nowLiked = !alreadyLiked;
          const updatedLikedBy = nowLiked
            ? [...((p.likedBy || []) as string[]).filter(Boolean), user._id]
            : ((p.likedBy || []) as string[]).filter((id) => String(id) !== String(user._id));
          return { ...p, likes: updatedLikes, likedBy: updatedLikedBy } as Project;
        })
      );
    } catch (e: any) {
      console.error(e);
      // revert to original snapshot via selected project reference
      setProjects((prev) => prev.map((p) => (String((p as any)._id) !== String(serverId) ? p : project)));
      alert(e?.message || 'Gagal berkomunikasi dengan server');
    } finally {
      setPendingMap((prev) => ({ ...prev, [serverId]: false }));
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (loadingMore || loading || !hasMore) return;
        fetchPage(offset, false);
      },
      { root: null, threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, hasMore, loadingMore, loading]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="text-[#EF6145]" size={28} />
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">User Showcase</h2>
          </div>
          <div className="h-1.5 w-32 bg-[#EF6145] rounded-full mb-4" />
          <p className="text-gray-500 font-medium max-w-lg">Galeri karya kreatif dan portofolio terbaik dari para user berbakat kami.</p>
        </div>

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

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  // toggle dropdown
                  setShowFilter((prev) => !prev);
                }}
                className={`flex items-center gap-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-bold focus:ring-4 focus:ring-[#EF6145]/10 outline-none shadow-sm transition-all ${category !== 'all' ? 'border-[#EF6145]/40 ring-2 ring-[#EF6145]/10' : ''}`}
                aria-label="Filter kategori"
              >
                <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${category !== 'all' ? 'bg-[#EF6145] text-white' : 'bg-gray-50 text-gray-500'}`}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 5H20L14 13V19L10 21V13L4 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Filter</span>
              </button>

              {showFilter && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg z-20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setShowFilter(false);
                      setProjects([]);
                      setOffset(0);
                      setHasMore(true);
                      setError(null);
                      setLoading(false);
                      setLoadingMore(false);
                      fetchPage(0, true);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 ${category === 'all' ? 'bg-[#EF6145]/10 text-[#EF6145]' : 'text-gray-800'}`}
                  >
                    Semua
                  </button>

                  {['sketsa', 'lukisan', 'digital art', 'tugas', 'desain', 'fotografi', 'nirmana', 'project'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setCategory(c);
                        setShowFilter(false);
                        setProjects([]);
                        setOffset(0);
                        setHasMore(true);
                        setError(null);
                        setLoading(false);
                        setLoadingMore(false);
                        fetchPage(0, true);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 ${String(category).toLowerCase() === c ? 'bg-[#EF6145]/10 text-[#EF6145]' : 'text-gray-800'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse py-12">Memuat data...</div>
        ) : error ? (
          <div className="col-span-full max-w-md mx-auto p-4 bg-rose-50 border border-rose-200 text-rose-700 font-bold rounded-2xl text-center text-sm">{error}</div>
        ) : filteredProjects.length === 0 ? (
          <div className="col-span-full text-center text-sm font-bold text-gray-400 uppercase tracking-widest py-12 border border-dashed rounded-[2.5rem]">Tidak ada karya ditemukan</div>
        ) : (
          <>
            {filteredProjects.map((project) => (
              <div key={project.id} className="group">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <div className="flex justify-between items-center text-white">
                      <div className="flex items-center gap-2">
                        <Heart size={18} className="fill-[#EF6145] text-[#EF6145]" />
                        <span className="font-bold text-sm">{project.likes}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-[#EF6145] text-white transition-all"
                        >
                          <ExternalLink size={18} />
                        </button>

                        {(() => {
                          const current = projects.find((p) => String((p as any)._id) === String((project as any)._id)) || project;
                          const isLiked = Array.isArray(current.likedBy) && current.likedBy.map(String).includes(String(user?._id));
                          const pending = !!pendingMap[String((current as any)._id)];
                          return (
                            <button
                              disabled={pending}
                              onClick={() => toggleApresiasi(current)}
                              className={`p-3 rounded-xl text-white transform transition-transform duration-150 ${isLiked ? 'bg-pink-500' : 'bg-white/20 hover:bg-pink-400'} ${pending ? 'opacity-70 cursor-not-allowed scale-95' : 'hover:scale-110 active:scale-95'}`}
                            >
                              <Heart size={16} className={`${isLiked ? 'fill-current' : ''}`} />
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-5 left-5">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="px-2">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#EF6145] cursor-pointer transition-colors"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 italic">by {project.creator}</p>
                </div>
              </div>
            ))}

            <div ref={sentinelRef} className="col-span-full h-1" />

            <div className="col-span-full text-center py-6">
              {loadingMore && (
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat lagi...</div>
              )}
              {!hasMore && <div className="text-xs font-bold text-gray-300 uppercase tracking-widest">Tidak ada data lagi</div>}
            </div>
          </>
        )}
      </div>

      {selectedProject && (
        <ProjectDetailModal
          project={projects.find((p) => String((p as any)._id) === String((selectedProject as any)._id)) || selectedProject}
          onClose={() => setSelectedProject(null)}
          onApresiasi={toggleApresiasi}
          currentUser={user}
          pending={!!pendingMap[String((selectedProject as any)._id)]}
        />
      )}
    </div>
  );
}