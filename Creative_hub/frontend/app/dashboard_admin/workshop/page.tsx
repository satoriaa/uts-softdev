'use client';

import CrudPage from '@/app/components/CrudPage';
import { PenTool, Brush, Lightbulb, Users, Shapes } from 'lucide-react';

export default function WorkshopPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4 pb-20">
      <div className="relative overflow-hidden bg-[#2A2A2A] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border-l-[12px] border-[#EF6145]">
        <div className="absolute top-[-30px] right-[-30px] w-72 h-72 bg-[#EF6145] rounded-full blur-[90px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-20px] left-[30%] w-48 h-48 bg-yellow-500 rounded-full blur-[70px] opacity-10"></div>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none hidden lg:block">
            <Shapes size={200} strokeWidth={1} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <Lightbulb className="text-yellow-400" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                Skills & Knowledge Transfer
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
              Master <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#EF6145] to-[#EF6145]">
                Class.
              </span>
            </h1>
            
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed border-b border-white/10 pb-4">
              Kelola sesi pelatihan, demonstrasi teknik, dan kolaborasi praktis mahasiswa <span className="text-white">FSRD Creative Lab.</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
             <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-4 group hover:bg-[#EF6145] transition-all duration-500 cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                  <PenTool className="text-[#EF6145] group-hover:text-white" size={24} />
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 group-hover:text-white/70 uppercase font-black tracking-widest">Type</div>
                  <div className="text-sm font-bold">Practical Art</div>
                </div>
             </div>

             <div className="bg-white/5 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 flex items-center gap-4 group hover:bg-blue-600 transition-all duration-500 cursor-default">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20">
                  <Brush className="text-blue-400 group-hover:text-white" size={24} />
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 group-hover:text-white/70 uppercase font-black tracking-widest">Focus</div>
                  <div className="text-sm font-bold">Digital & Analog</div>
                </div>
             </div>
          </div>
        </div>
      </div>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#EF6145] to-yellow-500 rounded-[3rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
        
        <div className="relative bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-500">
          <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-[#EF6145] rounded-full"></div>
              <div>
                <h2 className="text-lg font-black text-gray-800 tracking-tight">Agenda Pelatihan Baru</h2>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">Workshop Registration Desk</p>
              </div>
            </div>
            <Users className="text-gray-200 hidden sm:block" size={40} />
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title="" 
              endpoint="/workshop"
              fields={[
                { 
                  name: 'nama', 
                  label: 'Nama Workshop / Judul Sesi', 
                  required: true 
                },
                { 
                  name: 'deskripsi', 
                  label: 'Silabus & Deskripsi Singkat', 
                  type: 'textarea', 
                  required: true 
                },
                { 
                  name: 'tanggal', 
                  label: 'Jadwal Kelas', 
                  type: 'date', 
                  required: true 
                },
                { 
                  name: 'tempat', 
                  label: 'Laboratorium / Platform', 
                  required: true 
                },
                { 
                  name: 'googleFormUrl', 
                  label: 'Google Form URL', 
                  required: false 
                },
                { 
                  name: 'gambar', 
                  label: 'Key Visual / Poster Workshop (Upload)', 
                  type: 'file', 
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="mt-12 text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
           <div className="h-[1px] w-12 bg-gray-200"></div>
           <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.6em]">Learn by Doing</span>
           <div className="h-[1px] w-12 bg-gray-200"></div>
        </div>
        <p className="text-[11px] text-gray-300 font-medium">©️ 2026 FSRD UNTAR • Central Hub Ecosystem</p>
      </div>

    </div>
  );
}