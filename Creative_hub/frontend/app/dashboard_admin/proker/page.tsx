'use client';

import CrudPage from '@/app/components/CrudPage';
import { Briefcase, Zap, BarChart3, Layers, CheckSquare } from 'lucide-react';

export default function ProkerPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-left-6 duration-1000 px-4 pb-20">
      <div className="relative overflow-hidden bg-gradient-to-r from-[#222] to-[#333] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#EF6145] to-transparent opacity-50"></div>
        <div className="absolute bottom-10 right-[-20px] w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
              <Zap className="text-yellow-400" size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
                Organizational Growth
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Strategic <br />
              <span className="text-[#EF6145]">Mission.</span>
            </h1>
            
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed border-l-2 border-gray-700 pl-4">
              Susun dan kelola seluruh lini <span className="text-white">Program Kerja</span> untuk memastikan keberlanjutan ekosistem kreatif di FSRD.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                <BarChart3 className="text-[#EF6145] mb-2" size={20} />
                <span className="text-[8px] uppercase font-black tracking-widest text-gray-500">Efficiency</span>
                <span className="text-lg font-bold">100%</span>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex flex-col items-center">
                <Layers className="text-blue-400 mb-2" size={20} />
                <span className="text-[8px] uppercase font-black tracking-widest text-gray-500">Capacity</span>
                <span className="text-lg font-bold">Scalable</span>
             </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-4 left-10 z-20">
          <div className="bg-[#EF6145] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-[#EF6145]/30">
            Internal Roadmap
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          <div className="px-10 pt-12 pb-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <CheckSquare className="text-gray-400" size={20} />
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Timeline & Eksekusi Proker</h2>
            </div>
            <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-[#EF6145] w-2/3"></div>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title=""
              endpoint="/proker"
              fields={[
                { 
                  name: 'nama', 
                  label: 'Nama Program Kerja', 
                  required: true 
                },
                { 
                  name: 'deskripsi', 
                  label: 'Tujuan & Rincian Rencana', 
                  type: 'textarea', 
                  required: true 
                },
                { 
                  name: 'tanggal',
                  label: 'Tanggal',
                  type: 'date',
                  required: true
                },
                { 
                  name: 'jam',
                  label: 'Jam',
                  required: true
                },
                { 
                  name: 'tempat',
                  label: 'Tempat (Google Maps Link)',
                  required: true
                },
                { 
                  name: 'namaPembicara',
                  label: 'Nama Pembicara',
                  required: true
                },
                { 
                  name: 'kapasitas',
                  label: 'Kapasitas',
                  type: 'number',
                  required: true
                },
                { 
                  name: 'googleFormUrl',
                  label: 'Google Form URL',
                  required: true 
                },

                { 
                  name: 'gambar',
                  label: 'Key Visual / Poster (Upload)', 
                  type: 'file',
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 px-10">
        <div className="flex items-center gap-3">
          <Briefcase size={16} className="text-gray-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Executive Dashboard</span>
        </div>
        <div className="text-[10px] font-medium text-gray-300 italic">
          "Plan the work, then work the plan."
        </div>
      </div>

    </div>
  );
}