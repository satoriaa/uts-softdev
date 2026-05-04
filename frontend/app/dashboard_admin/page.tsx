'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  ImageIcon, AlertCircle, Box, Calendar, 
  Users, TrendingUp, ArrowRight 
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({ users: 0, karya: 0, ruang: 0, event: 0, proker: 0, lomba: 0, tenant: 0, workshop: 0, majalah: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = ['/users', '/karya', '/ruang', '/event', '/proker', '/lomba', '/tenant', '/workshop', '/majalah'];
        const results = await Promise.all(
          endpoints.map(path => api.get(path).then(r => r.data.data?.length || 0).catch(() => 0))
        );
        setStats({
          users: results[0], karya: results[1], ruang: results[2],
          event: results[3], proker: results[4], lomba: results[5],
          tenant: results[6], workshop: results[7], majalah: results[8]
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  return (
    /* Container Utama: Menggunakan mx-auto dan max-width agar konten berada di tengah */
    <div className="max-w-6xl mx-auto w-full px-4 md:px-0">
      
      {/* Title Section */}
      <div className="mb-10">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tighter">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 mt-4 text-xl">
          Ringkasan aktivitas dan statistik platform
        </p>
      </div>

      {/* 4 TOP CARDS - Grid disesuaikan agar lebih rapi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<ImageIcon className="text-[#5B8DEF]"/>} bg="bg-[#E8EFFF]" value={stats.karya || 1} label="Pending Kurasi Karya" />
        <StatCard icon={<AlertCircle className="text-[#F5B546]"/>} bg="bg-[#FFF4E3]" value={stats.ruang || 1} label="Permintaan Peminjaman" />
        <StatCard icon={<Box className="text-[#42C87A]"/>} bg="bg-[#E5F7ED]" value={stats.ruang || 1} label="Peralatan Tersedia" />
        <StatCard icon={<Calendar className="text-[#B874F5]"/>} bg="bg-[#F3E8FF]" value={stats.event || 1} label="Event Mendatang" />
      </div>

      {/* MIDDLE ACTION CARDS - Dua kolom yang sejajar di tengah */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <ActionCard title="Antrian Kurasi Karya" detail="Andi Prasetyo 2026-04-11" name="Urban Synthesis" badge="Ilustrasi" img="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=150" />
        <ActionCard title="Validasi Peminjaman" detail="2026-04-05 - 2026-04-08" name="Budi Santoso" sub="Wacom Cintiq Pro 27" />
      </div>

      {/* BOTTOM TOTAL CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
        <BottomStat icon={<Users className="text-[#EF6145]"/>} value={stats.users || 3} label="Total Users" />
        <BottomStat icon={<TrendingUp className="text-[#EF6145]"/>} value={stats.karya || 3} label="Karya Published" />
        <BottomStat icon={<Calendar className="text-[#EF6145]"/>} value={stats.event || 3} label="Active Events" />
      </div>
    </div>
  );
}
// 1. StatCard dengan efek hover shadow & lift-up
function StatCard({ icon, bg, value, label }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] 
                    flex flex-col gap-6 transition-all duration-300 ease-in-out 
                    hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 cursor-default">
      <div className={`h-11 w-11 rounded-xl ${bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <div>
        <div className="text-4xl font-bold text-gray-900 tracking-tight">{value}</div>
        <div className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );
}

// 2. ActionCard dengan efek hover shadow
function ActionCard({ title, detail, name, badge, sub, img }: any) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] 
                    flex flex-col transition-all duration-300 ease-in-out 
                    hover:shadow-[0_25px_50px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center mb-8">
        <span className="text-gray-900 text-xl font-bold">{title}</span>
        <button className="flex items-center gap-1 text-[#EF6145] text-xs font-bold hover:underline">
          Lihat Detail <ArrowRight size={14}/>
        </button>
      </div>
      <div className="flex gap-4 mb-10">
        {img ? (
          <img src={img} className="h-20 w-20 rounded-xl object-cover shadow-sm" alt="preview" />
        ) : (
          <div className="h-20 w-20 bg-gray-50 rounded-xl shrink-0 border border-gray-100"></div>
        )}
        <div className="flex flex-col justify-center">
          <h4 className="text-lg font-bold text-gray-900">{name}</h4>
          {sub && <p className="text-gray-500 text-sm font-medium">{sub}</p>}
          <p className="text-gray-400 text-xs mt-1 font-medium">{detail}</p>
          {badge && (
            <span className="inline-block w-fit mt-3 px-4 py-1 bg-[#FDECE9] text-[#EF6145] text-[10px] font-bold rounded-lg uppercase tracking-wider">
              {badge}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-4 mt-auto">
        <button className="flex-1 bg-[#EF6145] text-white py-3.5 rounded-xl font-bold hover:bg-[#D9553C] transition-all active:scale-95 shadow-md shadow-orange-200/50">
          Setuju
        </button>
        <button className="flex-1 bg-[#CC2525] text-white py-3.5 rounded-xl font-bold hover:bg-[#B32020] transition-all active:scale-95 shadow-md shadow-red-200/50">
          Tolak
        </button>
      </div>
    </div>
  );
}

// 3. BottomStat dengan efek hover ring & shadow
function BottomStat({ icon, value, label }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] 
                    flex items-center justify-between transition-all duration-300 
                    hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] hover:ring-1 hover:ring-orange-100">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#FDECE9] flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div className="flex items-baseline gap-4">
            <span className="text-3xl font-bold text-gray-900">{value}</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-tight">{label}</span>
          </div>
        </div>
      </div>
      <button className="text-[#EF6145] hover:translate-x-2 transition-transform duration-200">
        <ArrowRight size={18}/>
      </button>
    </div>
  );
}