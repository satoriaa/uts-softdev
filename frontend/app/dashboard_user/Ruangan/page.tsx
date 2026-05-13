'use client';

import React, { useState } from 'react';
import { Search, MapPin, Users, Clock, ArrowRight, DoorOpen } from 'lucide-react';

interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string;
  status: 'Tersedia' | 'Dipakai';
  image: string;
}

export default function PeminjamanRuanganPage() {
  const [query, setQuery] = useState("");

  const rooms: Room[] = [
    {
      id: 1,
      name: "Ruang Meeting Utama",
      capacity: 20,
      location: "Lantai 2, Sayap Kanan",
      status: "Tersedia",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Studio Kolaborasi",
      capacity: 8,
      location: "Lantai 1, Dekat Lobby",
      status: "Dipakai",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Aula Serbaguna",
      capacity: 100,
      location: "Gedung B, Lantai Dasar",
      status: "Tersedia",
      image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?q=80&w=2070&auto=format&fit=crop"
    }
  ];

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

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div 
            key={room.id}
            className="group bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-6px] transition-all duration-500"
          >
            {/* Image Overlay */}
            <div className="relative h-56 overflow-hidden">
              <img 
                src={room.image} 
                alt={room.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              <div className="absolute top-5 left-5">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                  room.status === 'Tersedia' 
                  ? 'bg-emerald-500/80 border-emerald-400 text-white' 
                  : 'bg-rose-500/80 border-rose-400 text-white'
                }`}>
                  {room.status}
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
                  <span className="text-sm font-bold text-gray-700">{room.capacity} Orang</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <MapPin size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 truncate">Lantai {room.id}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 font-medium mb-6 flex items-center gap-2">
                <DoorOpen size={14} />
                {room.location}
              </p>

              <button 
                disabled={room.status === 'Dipakai'}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[2px] text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  room.status === 'Tersedia'
                  ? 'bg-[#EF6145] text-white shadow-[#EF6145]/20 hover:bg-[#d94e3d]'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                {room.status === 'Tersedia' ? (
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
        <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center opacity-50 hover:opacity-100 transition-opacity cursor-pointer bg-gray-50/30">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
             <Clock size={24} className="text-[#EF6145]" />
          </div>
          <span className="text-sm font-black text-gray-400 uppercase tracking-widest">Cek Jadwal Lain</span>
        </div>
      </div>
    </div>
  );
}