'use client';

import CrudPage from '@/app/components/CrudPage';
import { Sparkles, Calendar, MapPin, Palette } from 'lucide-react';

export default function EventPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 pb-20">
      <div className="relative overflow-hidden bg-[#1a1a1a] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border border-white/5">
        <div className="absolute top-[-40px] right-[-40px] w-80 h-80 bg-[#EF6145] rounded-full blur-[100px] opacity-25 animate-pulse"></div>
        <div className="absolute bottom-[-60px] left-[-20px] w-60 h-60 bg-blue-600 rounded-full blur-[90px] opacity-15"></div>

        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Sparkles className="text-[#EF6145]" size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
                Creative Hub Management
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Event <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF6145] to-[#ff8c75]">
                Curator.
              </span>
            </h1>
            
            <p className="text-gray-400 mt-4 font-medium max-w-sm leading-relaxed border-l-2 border-[#EF6145] pl-4">
              Platform kurasi agenda kreatif: Pameran, Workshop, dan Seminar Visual di <span className="text-white">Central Creative Hub.</span>
            </p>
          </div>

          <div className="flex gap-3">
             <div className="group bg-white/5 hover:bg-[#EF6145] transition-all duration-500 backdrop-blur-xl p-5 rounded-3xl border border-white/10 text-center min-w-[110px]">
                <Palette className="mx-auto mb-2 text-[#EF6145] group-hover:text-white transition-colors" size={20} />
                <div className="text-white font-bold text-xl leading-none">FSRD</div>
                <div className="text-[9px] text-gray-500 group-hover:text-white/70 uppercase mt-1 font-bold tracking-tighter">Department</div>
             </div>
             
             <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 text-center min-w-[110px]">
                <Calendar className="mx-auto mb-2 text-blue-400" size={20} />
                <div className="text-white font-bold text-xl leading-none">2026</div>
                <div className="text-[9px] text-gray-500 uppercase mt-1 font-bold tracking-tighter">Academic Year</div>
             </div>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#EF6145] to-blue-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-500">
          <div className="px-8 pt-8 pb-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-2 h-8 bg-[#EF6145] rounded-full"></div>
              Daftar Agenda Kreatif
            </h2>
          </div>

          <div className="p-4 md:p-8">
            <CrudPage
              title="" 
              endpoint="/event"
              fields={[
                { name: 'judul', label: 'Nama Event', required: true },
                { name: 'deskripsi', label: 'Konsep & Deskripsi', type: 'textarea', required: true },
                { name: 'ketentuan', label: 'Ketentuan Peserta', type: 'textarea', required: true },
                { name: 'lokasi', label: 'Venue / Lokasi', required: true },
                { name: 'tanggal', label: 'Waktu Pelaksanaan', type: 'date', required: true },
                { name: 'pembicara', label: 'ID Penanggung Jawab', required: false },
                { name: 'gambar', label: 'Poster Event (Format .jpg/.png)', type: 'file', required: true },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center gap-4">
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        <div className="flex items-center gap-6 text-gray-400 text-[10px] font-black uppercase tracking-[0.4em]">
          <span className="hover:text-[#EF6145] transition-colors cursor-default">Design Driven</span>
          <div className="w-1.5 h-1.5 bg-[#EF6145] rotate-45"></div>
          <span className="hover:text-[#EF6145] transition-colors cursor-default">FSRD UNTAR</span>
          <div className="w-1.5 h-1.5 bg-[#EF6145] rotate-45"></div>
          <span className="hover:text-[#EF6145] transition-colors cursor-default">2026</span>
        </div>
      </div>
    </div>
  );
}