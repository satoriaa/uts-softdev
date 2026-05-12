'use client';

import CrudPage from '@/app/components/CrudPage';
import { BookOpen, Newspaper, Star, Hash, DollarSign } from 'lucide-react';

export default function MajalahPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-right-4 duration-1000 px-4 pb-20">
      <div className="relative overflow-hidden bg-[#FDFDFD] rounded-[3rem] p-10 mb-12 border border-gray-200 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-full bg-[#EF6145] opacity-[0.03] skew-x-12 translate-x-20"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-5"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-[1px] bg-[#EF6145]"></div>
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[#EF6145]">
                Editorial Office
              </span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter text-gray-900 leading-none">
              Press <br />
              <span className="font-sans font-black italic text-[#EF6145]">Release.</span>
            </h1>
            
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
              Arsip publikasi dan distribusi majalah kreatif <span className="text-gray-900 font-bold">FSRD UNTAR</span>. Kelola setiap edisi dengan standar editorial tinggi.
            </p>
          </div>
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gray-900 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="relative bg-white border-2 border-gray-900 p-6 rounded-2xl -rotate-3 group-hover:rotate-0 transition-transform duration-500 w-48 shadow-lg">
              <Star className="text-yellow-500 mb-4" fill="currentColor" size={24} />
              <div className="text-[10px] font-black uppercase mb-1">Latest Issue</div>
              <div className="text-3xl font-black leading-none mb-2">2026</div>
              <div className="h-1 w-10 bg-[#EF6145] mb-4"></div>
              <div className="text-[9px] text-gray-400 leading-tight">Digital & Print Distribution System</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-12 top-0 hidden xl:block">
          <span className="text-8xl font-black text-gray-50 opacity-10 select-none">04</span>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white shadow-sm rounded-xl text-[#EF6145]">
                <Newspaper size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800 leading-none">Manajemen Edisi</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Publication & Pricing Control</p>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-3 py-1 bg-gray-900 text-white text-[10px] font-bold rounded-full uppercase">All Editions</span>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title="" 
              endpoint="/majalah"
              fields={[
                { 
                  name: 'nama', 
                  label: 'Judul / Edisi Majalah', 
                  required: true 
                },
                { 
                  name: 'deskripsi', 
                  label: 'Headline & Ringkasan Konten', 
                  type: 'textarea', 
                  required: true 
                },
                { 
                  name: 'tanggal', 
                  label: 'Tanggal Terbit', 
                  type: 'date', 
                  required: true 
                },
                { 
                  name: 'harga', 
                  label: 'Harga Satuan (IDR)', 
                  type: 'number', 
                  required: true 
                },
                { 
                  name: 'gambar', 
                  label: 'Cover Art (Portrait Format)', 
                  type: 'file', 
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60">
        <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.2em] text-gray-400">
          <Hash size={14} />
          <span>FSRD_CATALOGUE_2026</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#EF6145]"></div>
          <span className="text-[11px] font-serif italic text-gray-600">Established for Creative Excellence</span>
        </div>
      </div>

    </div>
  );
}