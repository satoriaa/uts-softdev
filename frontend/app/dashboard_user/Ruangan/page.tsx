'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { debounce } from '@/lib/rateLimit';

import { ArrowRight, Clock, DoorOpen, MapPin, Search, Users } from 'lucide-react';
import api from '@/lib/axios';

type BackendRuangStatus = 'pending' | 'tersedia' | 'tidak_tersedia';

type BackendRuang = {
  _id: string;
  namaRuang: string;
  lantai: number;
  status: BackendRuangStatus;
  gambar?: string;
};

type RoomUI = {
  id: string;
  name: string;
  capacityLabel: string;
  locationLabel: string;
  statusUI: 'Tersedia' | 'Dipakai' | 'Pending';
  isAvailable: boolean;
  image: string;
  floor: number;
};

// Helper untuk format URL Gambar
const getImageUrl = (imagePath?: string) => {
  // 1. Jika tidak ada gambar, tampilkan placeholder
  if (!imagePath) return 'https://placehold.co/600x400?text=Ruangan+Tanpa+Gambar';
  
  // 2. Jika gambar sudah berupa URL penuh (Cloudinary/AWS) atau Base64, kembalikan apa adanya
  if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  // 3. Jika berupa relative path dari multer lokal, gabungkan dengan URL Backend
  // Pastikan menyesuaikan port backend kamu di sini (misalnya 5000 atau 8000)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  // Menghindari double slash (misal: http://localhost:5000//uploads/gambar.jpg)
  return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
};

export default function PeminjamanRuanganPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const [rooms, setRooms] = useState<RoomUI[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/ruang');
      const data: BackendRuang[] = res.data?.data || [];

      const mapped: RoomUI[] = data.map((r) => {
        const statusUI: RoomUI['statusUI'] =
          r.status === 'tersedia' ? 'Tersedia' : r.status === 'tidak_tersedia' ? 'Dipakai' : 'Pending';

        return {
          id: r._id,
          name: r.namaRuang,
          capacityLabel: '-',
          locationLabel: `Lantai ${r.lantai}`,
          statusUI,
          isAvailable: r.status === 'tersedia',
          image: getImageUrl(r.gambar), // <- Perbaikan integrasi gambar di sini
          floor: r.lantai,
        };
      });

      setRooms(mapped);
    } catch (e: any) {
      const msg = e?.response?.data?.message || e.message || 'Gagal mengambil data ruangan';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fn = debounce((val: string) => setDebouncedQuery(val), 300);
    fn(query);
  }, [query]);

  const filteredRooms = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    if (!q) return rooms;
    return rooms.filter((r) => {
      return (
        r.name.toLowerCase().includes(q) ||
        r.locationLabel.toLowerCase().includes(q) ||
        r.statusUI.toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, rooms]);


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
            Pinjam Ruangan
          </h2>
          <div className="h-1.5 w-24 bg-[#EF6145] mt-2 rounded-full"></div>
          <p className="text-gray-500 mt-4 font-medium italic">
            Cari dan reservasi ruangan untuk kebutuhan acaramu.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama ruangan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            // text-black untuk memastikan input berwarna hitam pekat
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-medium focus:ring-4 focus:ring-[#EF6145]/10 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Tampilkan Loading atau Error */}
      {loading && <p className="text-gray-500 italic">Memuat data ruangan...</p>}
      {error && <p className="text-rose-500 font-medium">Error: {error}</p>}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && !error && filteredRooms.map((room) => (
          <div 
            key={room.id}
            className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-500"
          >
            {/* Image Overlay */}
            <div className="relative h-56 overflow-hidden">
              {/* Fallback internal jika URL valid namun gambar terhapus di server */}
              <img 
                src={room.image} 
                alt={room.name}
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/600x400?text=Gambar+Rusak';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute top-5 left-5">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                  room.statusUI === 'Tersedia' 
                  ? 'bg-emerald-500/80 border-emerald-400 text-white' 
                  : 'bg-rose-500/80 border-rose-400 text-white'
                }`}>
                  {room.statusUI}
                </span>
              </div>

              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-xl font-bold text-white leading-tight">
                  {room.name}
                </h3>
              </div>
            </div>

            {/* Details */}
            <div className="p-7">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Users size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{room.capacityLabel} Orang</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate">{room.locationLabel}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium mb-6 flex items-center gap-2">
                <DoorOpen size={14} />
                {room.locationLabel}
              </p>

              <button 
                disabled={room.statusUI === 'Dipakai'}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  room.statusUI === 'Tersedia'
                  ? 'bg-[#EF6145] text-white shadow-[#EF6145]/20 hover:bg-[#d94e3d]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {room.statusUI === 'Tersedia' ? (
                  <>
                    Booking Sekarang
                    <ArrowRight size={16} />
                  </>
                ) : (
                  'Tidak Tersedia'
                )}
              </button>
            </div>
          </div>
        ))}

        {/* Placeholder Tambah */}
        {!loading && (
          <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-gray-50/30">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
               <Clock size={24} className="text-[#EF6145]" />
            </div>
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Cek Jadwal Lain</span>
          </div>
        )}
      </div>
    </div>
  );
}