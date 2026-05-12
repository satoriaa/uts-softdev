'use client';

import CrudPage from '@/app/components/CrudPage';
import { Palette, User, FileText, Image as ImageIcon, Search } from 'lucide-react';

export default function KaryaPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-700 px-4 pb-20">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] rounded-[3rem] p-10 mb-10 text-white shadow-2xl border border-white/10">
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-50px] right-[-50px] w-80 h-80 bg-[#EF6145]/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EF6145]/10 border border-[#EF6145]/20 backdrop-blur-sm">
                <Palette className="text-[#EF6145]" size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#EF6145]">
                  Student Showcase
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black tracking-tight uppercase italic">
                Art <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Archives.</span>
              </h1>
              
              <p className="text-gray-400 max-w-md font-light leading-relaxed">
                Dokumentasikan setiap goresan karya dan proyek kreatifmu ke dalam sistem pengarsipan digital <span className="text-white font-medium italic underline decoration-[#EF6145]">FSRD UNTAR</span>.
              </p>
            </div>

            <div className="hidden lg:block">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-[2px] bg-[#EF6145]"></div>
                    <div>
                      <div className="text-2xl font-bold">2026</div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-500">Collection Era</div>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-32 bg-[#EF6145] rounded-full hidden xl:block"></div>
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          <div className="flex items-center gap-4 px-10 pt-10">
            <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
              <FileText size={20} />
            </div>
            <div className="h-[1px] flex-1 bg-gray-100"></div>
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Workspace</span>
          </div>

          <div className="p-4 md:p-10">
            <CrudPage
              title="Manajemen Inventaris Karya"
              endpoint="/karya"
              fields={[
                { 
                  name: 'judul', 
                  label: 'Judul Karya', 
                  required: true 
                },
                { 
                  name: 'deskripsi', 
                  label: 'Narasi / Deskripsi Karya', 
                  type: 'textarea', 
                  required: true 
                },
                { 
                  name: 'username', 
                  label: 'Nama Artist (Mahasiswa)', 
                  required: true 
                },
                { 
                  name: 'nim', 
                  label: 'Nomor Induk Mahasiswa', 
                  required: true 
                },
                { 
                  name: 'gambar', 
                  label: 'Dokumentasi Visual (High-Res)', 
                  type: 'file', 
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <div className="inline-flex items-center gap-8 py-4 px-10 rounded-full bg-gray-50 border border-gray-100">
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                 <User size={12} className="text-gray-400" />
               </div>
             ))}
          </div>
          <p className="text-[11px] font-medium text-gray-500 italic">
            "Seni adalah satu-satunya cara untuk melarikan diri tanpa meninggalkan rumah."
          </p>
        </div>
      </div>
    </div>
  );
}