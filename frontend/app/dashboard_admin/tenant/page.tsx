'use client';

import CrudPage from '@/app/components/CrudPage';
import { Store, ShoppingBag, Utensils, Sparkles, Tag } from 'lucide-react';

export default function TenantPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-top-8 duration-1000 px-4 pb-20">
      
      {/* Header Vibrant - Creative Market Vibes */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#EF6145] to-[#ff8c75] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl">
        
        {/* Dekorasi Pola Lingkaran - Playful Pattern */}
        <div className="absolute top-[-20px] right-[-20px] w-64 h-64 bg-white/10 rounded-full blur-[40px]"></div>
        <div className="absolute bottom-[-30px] left-[20%] w-40 h-40 bg-yellow-300/20 rounded-full blur-[30px]"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-lg border border-white/30">
              <Sparkles size={14} className="text-yellow-200" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                Tenant & Merchant Portal
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Creative <br />
              <span className="text-white/80 italic">Market.</span>
            </h1>
            
            <p className="text-white/90 max-w-sm font-medium leading-relaxed mx-auto md:mx-0">
              Kelola daftar tenant, UMKM mahasiswa, dan booth kreatif di area <span className="underline decoration-yellow-300 decoration-2">Central Hub FSRD</span>.
            </p>
          </div>

          {/* Decorative Floating Cards */}
          <div className="hidden lg:flex gap-4">
             <div className="bg-white p-6 rounded-3xl shadow-xl -rotate-6 hover:rotate-0 transition-transform duration-500 w-40 text-black">
                <Utensils className="text-[#EF6145] mb-3" size={28} />
                <div className="text-xs font-black uppercase tracking-widest text-gray-400">Category</div>
                <div className="text-lg font-bold">F&B</div>
             </div>
             <div className="bg-white p-6 rounded-3xl shadow-xl rotate-6 hover:rotate-0 transition-transform duration-500 w-40 text-black mt-8">
                <ShoppingBag className="text-blue-500 mb-3" size={28} />
                <div className="text-xs font-black uppercase tracking-widest text-gray-400">Category</div>
                <div className="text-lg font-bold">Merch</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {/* Floating Label Style */}
        <div className="absolute -top-5 left-12 z-20 flex gap-2">
          <div className="bg-black text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
            <Store size={14} className="text-[#EF6145]" />
            Tenant Directory
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
          {/* Subtle Form Header */}
          <div className="px-12 pt-14 pb-4">
            <div className="flex items-center gap-3 mb-2">
              <Tag size={18} className="text-gray-300" />
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Registrasi Tenant Baru</h2>
            </div>
            <div className="h-1 w-20 bg-[#EF6145] rounded-full"></div>
          </div>

          <div className="p-6 md:p-12 pt-4">
            <CrudPage
              title="" // Dikosongkan karena sudah ada header custom
              endpoint="/tenant"
              fields={[
                { 
                  name: 'nama', 
                  label: 'Nama Brand / Tenant', 
                  required: true 
                },
                { 
                  name: 'listJualan', 
                  label: 'Katalog Produk (Pisahkan dengan koma)', 
                  required: true 
                },
                { 
                  name: 'gambar', 
                  label: 'Foto Profil Booth / Logo Tenant', 
                  type: 'file', 
                  required: true 
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Footer / Tip Kreatif */}
      <div className="mt-12 flex flex-col items-center gap-4 py-8 border-t border-dashed border-gray-200">
        <div className="flex items-center gap-6">
           <div className="w-2 h-2 bg-[#EF6145] rounded-full animate-ping"></div>
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em]">
             Support Local Creative Brand
           </p>
           <div className="w-2 h-2 bg-[#EF6145] rounded-full animate-ping"></div>
        </div>
        <span className="text-[9px] text-gray-300 font-medium">© 2026 FSRD UNTAR - Creative Management</span>
      </div>

    </div>
  );
}