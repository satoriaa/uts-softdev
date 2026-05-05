'use client';

import CrudPage from '@/components/CrudPage';
import { Sparkles } from 'lucide-react';

export default function EventPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* Header Estetik Khusus Anak FSRD */}
      <div className="relative overflow-hidden bg-[#222222] rounded-3xl p-8 mb-10 text-white shadow-2xl">
        {/* Dekorasi Abstrak di Background */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-[#EF6145] rounded-full blur-[80px] opacity-20"></div>
        <div className="absolute bottom-[-40px] left-[-20px] w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-[#EF6145]" size={20} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                Creative Management
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Event <span className="text-[#EF6145]">Curator</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium max-w-md">
              Atur jadwal pameran, workshop, dan seminar kreatif di Central Creative Hub.
            </p>
          </div>
          
          <div className="hidden md:flex gap-4">
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <div className="text-[#EF6145] font-bold text-xl leading-none">FSRD</div>
                <div className="text-[10px] text-gray-500 uppercase mt-1 font-bold">Campus</div>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[100px]">
                <div className="text-white font-bold text-xl leading-none">2026</div>
                <div className="text-[10px] text-gray-400 uppercase mt-1 font-bold">Academic</div>
             </div>
          </div>
        </div>
      </div>

      {/* Bagian CRUD Utama */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
        <div className="p-2 md:p-6">
          <CrudPage
            title="Daftar Agenda Kreatif"
            endpoint="/event"
            fields={[
              { 
                name: 'judul', 
                label: 'Nama Event', 
                required: true 
              },
              { 
                name: 'deskripsi', 
                label: 'Konsep & Deskripsi', 
                type: 'textarea', 
                required: true 
              },
              { 
                name: 'ketentuan', 
                label: 'Ketentuan Peserta', 
                type: 'textarea', 
                required: true 
              },
              { 
                name: 'lokasi', 
                label: 'Venue / Lokasi', 
                required: true 
              },
              { 
                name: 'tanggal', 
                label: 'Waktu Pelaksanaan', 
                type: 'date', 
                required: true 
              },
              { 
                name: 'pembicara', 
                label: 'ID Penanggung Jawab', 
                required: true 
              },
            ]}
          />
        </div>
      </div>

      {/* Footer / Tip Kreatif */}
      <div className="mt-8 flex items-center justify-center gap-4 text-gray-400 text-xs font-bold uppercase tracking-widest">
        <span>Design Driven</span>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <span>FSRD UNTAR</span>
        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
        <span>2026</span>
      </div>
    </div>
  );
}