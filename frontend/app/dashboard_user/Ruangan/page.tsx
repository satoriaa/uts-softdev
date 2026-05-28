'use client';

import React, { useEffect, useMemo, useState } from 'react';
import io from 'socket.io-client';
import Image from 'next/image'; // Perbaikan: Gunakan Next.js Image
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
    };
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

  const [rooms, setRooms] = useState<RoomUI[]>([]);
  const [myAcceptedMap, setMyAcceptedMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | null>(null);
  const [bookingRoomName, setBookingRoomName] = useState<string>('');
  const [bookingDate, setBookingDate] = useState('');

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
      // Perbaikan: Assert tipe data error dari 'unknown' ke AxiosErrorResponse
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
    
    // Perbaikan: Hindari tipe data explicit any pada inisialisasi socket
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

    // Perbaikan: Cleanup function dibuat lebih bersih dan jelas
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
          locationLabel: `Lantai ${r.lantai}`,
          statusUI,
          isAvailable: r.status === 'tersedia',
          image: getImageUrl(r.gambar),
          floor: r.lantai,
        };
      });

      setRooms(mapped);
    } catch (e) {
      // Perbaikan: Assert tipe data error dari 'unknown' ke AxiosErrorResponse
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
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-medium focus:ring-4 focus:ring-[#EF6145]/10 outline-none transition-all shadow-sm"
          />
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
              className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-500"
            >
              {/* Image Overlay */}
              <div className="relative h-56 overflow-hidden">
                {/* Perbaikan: Mengganti <img> biasa dengan <Image /> milik Next.js */}
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
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                    room.statusUI === 'Tersedia' 
                    ? 'bg-emerald-500/80 border-emerald-400 text-white' 
                    : room.statusUI === 'Booked' ? 'bg-rose-600/90 border-rose-500 text-white' : 'bg-amber-400/90 border-amber-300 text-white'
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
                  disabled={room.statusUI === 'Booked'}
                  onClick={() => openBookingModal(room.id, room.name)}
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
                    'Booked'
                  )}
                </button>

                {myAcceptedMap[room.id] && (
                  <div className="mt-3">
                    <button onClick={async () => {
                      if (!confirm('Tandai peminjaman ini sebagai selesai?')) return;
                      try {
                        await api.put(`/pinjaman/${myAcceptedMap[room.id]}/finish`);
                        alert('Peminjaman ditandai selesai. Terima kasih.');
                        await fetchRooms();
                        await fetchMyBookings();
                      } catch (e) {
                        const err = e as AxiosErrorResponse;
                        alert(err?.response?.data?.message || err.message || 'Gagal menandai selesai');
                      }
                    }} className="w-full py-3 rounded-2xl font-black uppercase tracking-[2px] text-xs bg-emerald-600 text-white">Selesai</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Booking Modal */}
        {bookingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">Booking: {bookingRoomName}</h3>
              <label className="block text-sm font-bold mb-2">Tanggal Peminjaman</label>
              <input type="date" className="w-full p-3 mb-4 border rounded-lg" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setBookingOpen(false)} className="px-4 py-2 rounded-lg border">Batal</button>
                <button onClick={submitBooking} className="px-4 py-2 rounded-lg bg-[#EF6145] text-white font-bold">Kirim Booking</button>
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
            <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Cek Jadwal Lain</span>
          </div>
        )}
      </div>
    </div>
  );
}