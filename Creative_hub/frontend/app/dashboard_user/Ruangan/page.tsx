'use client';

import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import Image from 'next/image'; 
import { debounce } from '@/lib/rateLimit';

import { ArrowRight, Clock, DoorOpen, MapPin, Search, Users, CalendarDays, X } from 'lucide-react';
import api from '@/lib/axios';

type BackendRuangStatus = 'pending' | 'tersedia' | 'tidak_tersedia';
type RuangKategori = 'galeri' | 'studio' | 'ruangan';

type BackendRuang = {
  _id: string;
  namaRuang: string;
  lantai: number;
  kategori: RuangKategori;
  status: BackendRuangStatus;
  gambar?: string;
};

type RoomUI = {
  id: string;
  name: string;
  capacityLabel: string;
  locationLabel: string;
  kategori: RuangKategori;
  statusUI: 'Tersedia' | 'Booked' | 'Pending';
  isAvailable: boolean;
  image: string;
  floor: number;
};

// Buat interface untuk menangani struktur data Axios Error
interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
    statusText?: string;
  };
  message?: string;
}

// Helper untuk format URL Gambar
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return 'https://placehold.co/600x400?text=Ruangan+Tanpa+Gambar';
  
  if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) {
    return imagePath;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
};

export default function PeminjamanRuanganPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RuangKategori | ''>('');

  const [rooms, setRooms] = useState<RoomUI[]>([]);
  const [myAcceptedMap, setMyAcceptedMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
  const [bookingRoomName, setBookingRoomName] = useState<string>('');
  const [bookingDate, setBookingDate] = useState('');

  // Schedule View States
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRoomName, setScheduleRoomName] = useState('');
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  async function openScheduleModal(id: string, name: string) {
    setScheduleRoomName(name);
    setScheduleOpen(true);
    setScheduleLoading(true);
    try {
      const res = await api.get(`/pinjaman/ruang/${id}`);
      setScheduleData(res.data?.data || []);
    } catch (e) {
      alert('Gagal mengambil jadwal ruangan');
      setScheduleOpen(false);
    } finally {
      setScheduleLoading(false);
    }
  }

  function openBookingModal(id: string, name: string) {
    setBookingRoomId(id);
    setBookingRoomName(name);
    setBookingDate('');
    setBookingOpen(true);
  }

  async function submitBooking() {
    if (!bookingRoomId || !bookingDate) return alert('Pilih tanggal peminjaman');
    try {
      setLoading(true);
      await api.post('/pinjaman', { ruang: bookingRoomId, tanggalPinjam: bookingDate });
      alert('Booking berhasil dikirim. Menunggu validasi admin.');
      setBookingOpen(false);
      await fetchRooms();
    } catch (e) {
      const err = e as AxiosErrorResponse;
      alert(err?.response?.data?.message || err.message || 'Gagal membuat booking');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
    fetchMyBookings();
    const token = localStorage.getItem('token') || undefined;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let socket: any = null;

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      socket = io(base.replace(/\/$/, ''), { auth: { token } });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('ruang:updated', (payload: any) => {
        try {
          if (!payload || !payload.id) return;
          setRooms((prev) => prev.map(r => {
            if (r.id === String(payload.id)) {
              const statusUI = payload.status === 'tersedia' ? 'Tersedia' : payload.status === 'tidak_tersedia' ? 'Booked' : 'Pending';
              return { ...r, statusUI, isAvailable: payload.status === 'tersedia' };
            }
            return r;
          }));
        } catch (err) {}
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      socket.on('pinjaman:updated', (payload: any) => {
        try {
          fetchMyBookings();
          if (payload && payload.ruang) fetchRooms();
        } catch (err) {}
      });
    } catch (err) {}

    return () => {
      if (socket) {
        try {
          socket.disconnect();
        } catch (err) {
          console.error("Gagal memutus socket:", err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMyBookings() {
    try {
      const res = await api.get('/pinjaman');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const list: any[] = res.data?.data || [];
      const map: Record<string, string> = {};
      const today = new Date();
      const endToday = new Date(new Date(today).setHours(23, 59, 59, 999));

      // Map accepted bookings (status 'terima') for which the booking date is today or in the past.
      // This lets users mark their accepted bookings as finished even after the event day.
      for (const p of list) {
        if (p.status === 'terima' && p.ruang) {
          const tp = p.tanggalPinjam ? new Date(p.tanggalPinjam) : null;
          // include bookings whose tanggalPinjam is <= end of today
          if (tp && tp <= endToday) {
            const ruangId = typeof p.ruang === 'string' ? p.ruang : (p.ruang._id || p.ruang);
            map[String(ruangId)] = p._id;
          }
        }
      }
      setMyAcceptedMap(map);
    } catch (e) {
      // ignore
    }
  }

  async function fetchRooms() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/ruang');
      const data: BackendRuang[] = res.data?.data || [];

      const mapped: RoomUI[] = data.map((r) => {
        const statusUI: RoomUI['statusUI'] =
          r.status === 'tersedia' ? 'Tersedia' : r.status === 'tidak_tersedia' ? 'Booked' : 'Pending';

        return {
          id: r._id,
          name: r.namaRuang,
          capacityLabel: '-', 
          locationLabel: `${r.lantai}`,
          kategori: r.kategori,
          statusUI,
          isAvailable: r.status === 'tersedia',
          image: getImageUrl(r.gambar),
          floor: r.lantai,
        };
      });

      setRooms(mapped);
    } catch (e) {
      const err = e as AxiosErrorResponse;
      const msg = err?.response?.data?.message || err.message || 'Gagal mengambil data ruangan';
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

    return rooms.filter((r) => {
      const matchesQuery = !q || (
        r.name.toLowerCase().includes(q) ||
        r.locationLabel.toLowerCase().includes(q) ||
        r.statusUI.toLowerCase().includes(q)
      );
      
      const matchesCategory = !selectedCategory || r.kategori === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });
  }, [debouncedQuery, rooms, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
            <input
              type="text"
              placeholder="Cari nama ruangan..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-medium focus:ring-4 focus:ring-[#EF6145]/10 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-gray-600">Kategori:</span>
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
              selectedCategory === ''
                ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setSelectedCategory('galeri')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              selectedCategory === 'galeri'
                ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Galeri
          </button>
          <button
            onClick={() => setSelectedCategory('studio')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              selectedCategory === 'studio'
                ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setSelectedCategory('ruangan')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-all capitalize ${
              selectedCategory === 'ruangan'
                ? 'bg-[#EF6145] text-white shadow-lg shadow-[#EF6145]/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Ruangan
          </button>
        </div>
      </div>

      {/* Tampilkan Loading atau Error */}
      {loading && <p className="text-gray-500 italic">Memuat data ruangan...</p>}
      {error && <p className="text-rose-500 font-medium">Error: {error}</p>}

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && !error && filteredRooms.map((room) => {
          return (
            <div 
              key={room.id}
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-500 hover:rounded-[2.5rem]"
            >
              {/* Image Overlay */}
              <div className="relative h-56 overflow-hidden">
                {/* Mengganti <img> biasa dengan <Image /> milik Next.js */}
                <Image 
                  src={room.image} 
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/600x400?text=Gambar+Rusak';
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 bg-gray-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute top-5 left-5">
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border bg-emerald-500/80 border-emerald-400 text-white">
                    Tersedia
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
                <p className="text-xs text-gray-400 font-medium mb-6 flex items-center gap-2">
                  <DoorOpen size={14} />
                  {room.locationLabel}
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => openBookingModal(room.id, room.name)}
                    className="w-full py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 transition-all shadow-lg bg-[#EF6145] text-white shadow-[#EF6145]/20 hover:bg-[#d94e3d]"
                  >
                    Booking Sekarang
                    <ArrowRight size={16} />
                  </button>

                  <button 
                    onClick={() => openScheduleModal(room.id, room.name)}
                    className="w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all text-[#EF6145] bg-[#EF6145]/10 hover:bg-[#EF6145]/20"
                  >
                    <CalendarDays size={16} />
                    Lihat Jadwal
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Booking Modal */}
        {bookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-black">Booking: {bookingRoomName}</h3>
              <label className="block text-sm font-bold mb-2 text-black">Tanggal Peminjaman</label>
              <input type="date" className="w-full p-3 mb-4 border rounded-lg text-black" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setBookingOpen(false)} className="px-4 py-2 rounded-lg border border-gray-300 text-black font-bold hover:bg-gray-50">Batal</button>
                <button onClick={submitBooking} className="px-4 py-2 rounded-lg bg-[#EF6145] text-white font-bold">Kirim Booking</button>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Modal */}
        {scheduleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight">Jadwal Ruangan</h3>
                  <p className="text-sm text-gray-500 font-medium">{scheduleRoomName}</p>
                </div>
                <button onClick={() => setScheduleOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                {scheduleLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="w-8 h-8 border-4 border-[#EF6145] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : scheduleData.length === 0 ? (
                  <div className="text-center py-10">
                    <CalendarDays size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm font-bold text-gray-400">Belum ada yang membooking ruangan ini.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {scheduleData.map((s: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          <Users size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{s.userNama}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Tanggal: <span className="font-bold">{new Date(s.tanggalPinjam).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                          </p>
                          <div className="mt-2">
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-lg ${s.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                              {s.status === 'terima' ? 'Disetujui' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder Tambah */}
        {!loading && (
          <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-gray-50/30">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <Clock size={24} className="text-[#EF6145]" />
            </div>
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Tidak ada data lagi</span>
          </div>
        )}
      </div>
    </div>
  );
}