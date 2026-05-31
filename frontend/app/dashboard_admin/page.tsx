'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { 
  ImageIcon, AlertCircle, Box, Calendar, 
  Users, TrendingUp, ArrowRight, Sparkles, 
  Zap, Clock, ChevronRight, LayoutGrid, RefreshCw
} from 'lucide-react';

export default function DashboardHome() {
  const [stats, setStats] = useState({ 
    users: 0, karya: 0, ruang: 0, event: 0, 
    proker: 0, lomba: 0, tenant: 0, workshop: 0, majalah: 0, pinjaman: 0
  });
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loadingApprovals, setLoadingApprovals] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const endpoints = ['/users', '/karya', '/ruang', '/event', '/proker', '/lomba', '/tenant', '/workshop', '/majalah', '/pinjaman'];
        const results = await Promise.all(
          endpoints.map(path => api.get(path).then(r => r.data.data?.length || 0).catch(() => 0))
        );
        setStats({
          users: results[0], karya: results[1], ruang: results[2],
          event: results[3], proker: results[4], lomba: results[5],
          tenant: results[6], workshop: results[7], majalah: results[8], pinjaman: results[9]
        });
      } catch (err) { console.error(err); }
    };
    fetchStats();
  }, []);

  const fetchApprovals = async () => {
    setLoadingApprovals(true);
    try {
      const [pinjamanRes, usersRes] = await Promise.all([
        api.get('/pinjaman').catch(() => ({ data: { data: [] } })),
        api.get('/users').catch(() => ({ data: { data: [] } }))
      ]);
      
      const pinjamanData = (pinjamanRes.data?.data || [])
        .filter((item: any) => item.status === 'pending')
        .slice(0, 5)
        .map((item: any) => ({
          _id: item._id,
          type: 'pinjaman',
          title: 'Izin Peminjaman',
          name: item.userNama || item.user?.nama || 'Unknown User',
          detail: `${item.tanggalPinjam?.slice(0, 10) || 'N/A'}`,
          room: typeof item.ruang === 'string' ? item.ruang : (item.ruang?.namaRuang || 'Ruangan'),
          author: item.user?.nim || 'Student'
        }));

      const userData = (usersRes.data?.data || [])
        .filter((item: any) => item.role === 'student')
        .slice(0, 5)
        .map((item: any) => ({
          _id: item._id,
          type: 'user',
          title: 'User Management',
          name: item.nama || 'Unknown',
          detail: item.jurusan || 'N/A',
          author: item.nim || 'N/A'
        }));

      setApprovals([...pinjamanData, ...userData].slice(0, 2));
    } catch (err) {
      console.error('Error fetching approvals:', err);
    } finally {
      setLoadingApprovals(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      <div className="relative overflow-hidden bg-[#121212] rounded-[2.5rem] p-8 md:p-12 mb-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-6">
            <Zap size={14} className="text-[#EF6145]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Status: Operational</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">
            Hello, <span className="text-[#EF6145]">Creative Director.</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-medium">
            Semua sistem berjalan normal. Ada <span className="text-white underline decoration-[#EF6145] underline-offset-4">{stats.karya + 2} tugas baru</span> yang memerlukan perhatian Anda hari ini.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<ImageIcon size={24}/>} color="blue" value={stats.karya || 0} label="Total Karya" trend="+2 New" />
        <StatCard icon={<Clock size={24}/>} color="orange" value={stats.pinjaman || 0} label="Ruangan Dipinjam" trend="Urgent" />
        <StatCard icon={<Box size={24}/>} color="green" value={stats.users || 0} label="Total User" trend="Safe" />
        <StatCard icon={<Calendar size={24}/>} color="purple" value={stats.event || 0} label="Event Akan Datang" trend="This Week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <LayoutGrid className="text-[#EF6145]" size={24}/>
              Priority Approval
            </h3>
            <div className="flex items-center gap-3">
              <button onClick={fetchApprovals} disabled={loadingApprovals} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                <RefreshCw size={18} className={`text-gray-600 ${loadingApprovals ? 'animate-spin' : ''}`} />
              </button>
              <button className="text-sm font-bold text-gray-400 hover:text-[#EF6145] transition-colors">View All</button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {approvals.length > 0 ? (
              approvals.map((approval) => (
                approval.type === 'pinjaman' ? (
                  <ActionCard 
                    key={approval._id}
                    title={approval.title}
                    detail={approval.detail}
                    name={approval.name}
                    room={approval.room}
                    author={approval.author}
                  />
                ) : (
                  <ActionCard 
                    key={approval._id}
                    title={approval.title}
                    detail={approval.detail}
                    name={approval.name}
                    author={approval.author}
                  />
                )
              ))
            ) : (
              <>
                <ActionCard 
                  title="Kurasi Karya" 
                  detail="Deadline: Today, 17:00" 
                  name="Abstract Expressionism" 
                  author="Andi Prasetyo"
                  img="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300" 
                />
                <ActionCard 
                  title="Izin Peminjaman" 
                  detail="5 - 8 Mei 2026" 
                  name="Budi Santoso" 
                  room="Wacom Cintiq Pro 27" 
                  author="DKV Student"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, color, value, label, trend }: any) {
  const colors: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-[#EF6145] border-orange-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
      <div className={`h-12 w-12 rounded-2xl ${colors[color]} flex items-center justify-center mb-6 transition-transform group-hover:rotate-12`}>
        {icon}
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-4xl font-black text-gray-900 tracking-tighter mb-1">{value}</div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        </div>
        <div className={`text-[10px] font-black px-2 py-1 rounded-lg ${colors[color]}`}>
          {trend}
        </div>
      </div>
    </div>
  );
}

function ActionCard({ title, detail, name, room, author, img, badge, sub }: any) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col hover:shadow-2xl transition-all duration-700">
      <div className="flex justify-between items-center mb-6">
        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
          {title}
        </span>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight size={18} className="text-gray-300" />
        </button>
      </div>

      <div className="flex gap-4 mb-8">
        {img ? (
          <img src={img} className="h-20 w-20 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="art" />
        ) : (
          <div className="h-20 w-20 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
            <Users className="text-gray-200" />
          </div>
        )}
        <div className="flex flex-col justify-center">
          <h4 className="text-lg font-black text-gray-900 leading-tight">{name}</h4>
          <p className="text-sm font-bold text-[#EF6145] mt-0.5">{author}</p>
          <div className="flex items-center gap-2 mt-2 text-gray-400">
            <Clock size={12} />
            <span className="text-[10px] font-medium uppercase tracking-tighter">{detail || 'No detail'}</span>
          </div>
          {(room || sub) && (
            <div className="text-xs text-gray-500 mt-2">
              {room || sub}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-gray-900 text-white py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#EF6145] transition-all active:scale-95">
          Approve
        </button>
        <button className="px-5 border border-gray-100 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all">
          X
        </button>
      </div>
    </div>
  );
}

function BottomStat({ icon, value, label, color }: any) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-4">
        <div className={`h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-md`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{label}</p>
          <p className={`text-xl font-black text-gray-900`}>{value}</p>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <TrendingUp size={16} className="text-[#EF6145]" />
      </div>
    </div>
  );
}