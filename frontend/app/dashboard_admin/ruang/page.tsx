'use client';

import CrudPage from '@/app/components/CrudPage';
import { Layout, DoorOpen, Layers, CheckCircle, Info } from 'lucide-react';

export default function RuangPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 px-4 pb-20">
      
      {/* Header Facility - Campus Blueprint Style */}
      <div className="relative overflow-hidden bg-[#222222] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl">
        
        {/* Dekorasi Garis-Garis Arsitektur */}
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 right-10 w-40 h-40 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-40 h-40 border-2 border-white rounded-full"></div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-10"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 backdrop-blur-md">
              <Layout className="text-[#EF6145]" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                Facility & Infrastructure
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
              Space <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EF6145] to-orange-400">Inventory.</span>
            </h1>
            
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
              Manajemen inventaris ruang studio, laboratorium, dan galeri pameran di gedung <span className="text-white">FSRD Creative Hub.</span>
            </p>
          </div>

          {/* Quick Floor Status */}
          <div className="flex gap-2">
             <div className="bg-white text-black p-5 rounded-3xl min-w-[100px] flex flex-col items-center">
                <Layers className="mb-2" size={20} />
                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Floor Range</span>
                <span className="text-xl font-bold">B1 - L8</span>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Decorative Grid Line */}
        <div className="absolute -top-6 right-10 h-12 w-[1px] bg-gray-200"></div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* Section Header */}
          <div className="px-10 py-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm">
                <DoorOpen className="text-gray-800" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-none">Database Ruangan</h2>
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">Room availability control</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full">
              <CheckCircle size={14} className="text-green-500" />
              <span className="text-[10px] font-bold text-green-700 uppercase">System Active</span>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title="" // Dikosongkan karena sudah ada header custom
              endpoint="/ruang"
              fields={[
                {
                  name: 'namaRuang',
                  label: 'Nama / Nomor Ruangan',
                  required: true,
                },
                {
                  name: 'lantai',
                  label: 'Posisi Lantai',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'status',
                  label: 'Status',
                  type: 'select',
                  options: ['pending', 'tersedia', 'tidak_tersedia'],
                  required: true,
                },
                {
                  name: 'gambar',
                  label: 'Foto Kondisi Ruangan (Wide Angle)',
                  type: 'file',
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Guidelines / Info Section */}
      <div className="mt-8 flex items-start gap-4 px-8 py-6 bg-[#EF6145]/5 rounded-3xl border border-[#EF6145]/10">
        <Info className="text-[#EF6145] shrink-0" size={20} />
        <div>
          <h4 className="text-xs font-bold text-[#EF6145] uppercase tracking-widest mb-1">Panduan Penginputan</h4>
          <p className="text-[11px] text-[#EF6145]/70 leading-relaxed font-medium">
            Pastikan nama ruangan sesuai dengan papan Wayfinding gedung. Untuk status 'tidak_tersedia', sistem akan otomatis menutup akses peminjaman pada modul User.
          </p>
        </div>
      </div>
    </div>
  );
}