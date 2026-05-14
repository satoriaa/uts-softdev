 'use client';

import CrudPage from '@/app/components/CrudPage';
import { Trophy, Target, Flag, Rocket, Award } from 'lucide-react';

export default function LombaPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000 px-4 pb-20">

      <div className="relative overflow-hidden bg-[#0F172A] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border-b-4 border-[#EF6145]">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute rotate-45 bg-white w-[1px] h-[1000px] right-20 -top-20"></div>
          <div className="absolute rotate-45 bg-white w-[1px] h-[1000px] right-40 -top-20"></div>
          <div className="absolute rotate-45 bg-[#EF6145] w-[4px] h-[1000px] right-60 -top-20"></div>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-[#EF6145] to-orange-600 shadow-lg shadow-orange-500/20">
              <Trophy className="text-white" size={18} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                Championship Portal
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Creative <br />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#EF6145] via-white to-gray-400">
                League.
              </span>
            </h1>
            
            <p className="text-gray-400 max-w-md font-medium text-lg border-l-4 border-white/20 pl-6 py-2">
              Kelola kompetisi desain, sayembara arsitektur, dan ajang talenta kreatif <span className="text-[#EF6145]">FSRD UNTAR</span> dalam satu sistem terintegrasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[120px]">
                <Target className="text-blue-400 mb-1" size={20} />
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Target</span>
                <span className="text-lg font-bold">National</span>
             </div>
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[120px]">
                <Award className="text-yellow-400 mb-1" size={20} />
                <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest">Level</span>
                <span className="text-lg font-bold">Prestigious</span>
             </div>
          </div>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center -rotate-12 group-hover:rotate-0 transition-transform duration-500 z-20 border border-gray-100">
          <Rocket className="text-[#EF6145]" size={32} />
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          <div className="bg-gray-50/50 px-10 py-6 border-b border-gray-100 flex items-center gap-4">
            <Flag className="text-gray-400" size={20} />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">
              Competition Entry Form
            </h2>
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title="Pendaftaran Lomba Baru"
              endpoint="/lomba"
              fields={[
                { 
                  name: 'nama', 
                  label: 'Nama Kompetisi', 
                  required: true 
                },
                { 
                  name: 'deskripsi', 
                  label: 'Brief & Deskripsi Lomba', 
                  type: 'textarea', 
                  required: true 
                },
                { 
                  name: 'tanggal', 
                  label: 'Deadline / Tanggal Pelaksanaan', 
                  type: 'date', 
                  required: true 
                },
                { 
                  name: 'tempat', 
                  label: 'Lokasi', 
                  required: true 
                },
                { 
                  name: 'gambar', 
                  label: 'Flyer/Poster Resmi (Max 5MB)', 
                  type: 'file', 
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 flex flex-col items-center">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-[2px] w-12 bg-[#EF6145]"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">
            Go Higher, Design Better
          </p>
          <div className="h-[2px] w-12 bg-[#EF6145]"></div>
        </div>
        <p className="text-[10px] text-gray-300 font-medium">© 2026 FSRD UNTAR - Creative Management System</p>
      </div>

    </div>
  );
}