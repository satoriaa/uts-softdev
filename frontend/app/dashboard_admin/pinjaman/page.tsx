'use client';

import { useEffect, useState } from 'react';
import { Home, CheckCircle2, Clock, ShieldCheck, Map } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import axios from '@/lib/axios';

type Pinjaman = {
  _id: string;
  ruang: { namaRuang?: string } | string;
  user: string;
  userNama?: string;
  tanggalPinjam: string;
  status: 'pending' | 'terima' | 'tolak' | string;
  notified?: boolean;
}

function AdminValidation() {
  const { token } = useAuthStore();
  const [items, setItems] = useState<Pinjaman[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get('/pinjaman', { headers: { Authorization: `Bearer ${token}` } });
      if (res.data && res.data.data) {
        setItems(res.data.data.reverse());
      }
    } catch (e) {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchItems() }, [token]);

  const decide = async (id: string, status: 'terima' | 'tolak') => {
    if (!token) return;
    try {
      await axios.put(`/pinjaman/${id}`, { status }, { headers: { Authorization: `Bearer ${token}` } });
      // optimistically update
      setItems((s) => s.map(i => i._id === id ? { ...i, status } : i));
    } catch (e) {
      // ignore
    }
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-500">Daftar permintaan pinjaman (klik Terima/Tolak untuk validasi)</div>
      <div className="space-y-3">
        {loading && <div className="text-sm text-gray-400">Memuat...</div>}
        {items.map(it => (
          <div key={it._id} className="p-3 border rounded-md flex items-center justify-between">
            <div>
              <div className="font-bold">{typeof it.ruang === 'string' ? it.ruang : (it.ruang?.namaRuang || 'Ruangan')}</div>
              <div className="text-xs text-gray-500">{it.userNama || it.user} • {it.tanggalPinjam?.slice(0,10)}</div>
            </div>
            <div className="flex items-center gap-2">
              {it.status === 'pending' ? (
                <>
                  <button onClick={() => decide(it._id, 'terima')} className="px-3 py-1 bg-emerald-600 text-white rounded-md">Terima</button>
                  <button onClick={() => decide(it._id, 'tolak')} className="px-3 py-1 bg-rose-600 text-white rounded-md">Tolak</button>
                </>
              ) : (
                <div className={`px-3 py-1 rounded-md ${it.status === 'terima' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>{it.status.toUpperCase()}</div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && <div className="text-sm text-gray-500">Tidak ada permintaan.</div>}
      </div>
    </div>
  )
}

export default function PinjamanPage() {
  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-1000 px-4 pb-20">
      <div className="relative overflow-hidden bg-[#1e1e1e] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border border-white/5">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`, 
               backgroundSize: '30px 30px' 
             }}>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck className="text-blue-400" size={16} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                Authorized Access Only
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Space <br />
              <span className="text-[#EF6145]">Validator.</span>
            </h1>
            
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
              Sistem kendali dan validasi penggunaan studio, galeri, dan ruang kreatif di lingkungan <span className="text-white italic">Campus Hub.</span>
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-center w-32 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
              <Clock className="mx-auto mb-2 text-yellow-500 opacity-50" size={24} />
              <div className="text-xl font-black italic">PENDING</div>
              <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">Reviewing</div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 text-center w-32 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <CheckCircle2 className="mx-auto mb-2 text-green-500 opacity-50" size={24} />
              <div className="text-xl font-black italic">SECURE</div>
              <div className="text-[9px] text-gray-500 uppercase font-bold mt-1">Validated</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-gray-200 rounded-tl-xl z-0"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-gray-200 rounded-br-xl z-0"></div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative z-10">
          <div className="px-10 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-900 rounded-lg">
                <Map className="text-white" size={18} />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-700">Log Peminjaman Ruang</h2>
            </div>
            <div className="text-[10px] font-bold text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
              SISTEM VALIDASI V.2.6
            </div>
          </div>

          <div className="p-6 md:p-10">
              <AdminValidation />
          </div>
        </div>
      </div>

      <div className="mt-12 bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Home size={18} className="text-blue-600" />
          </div>
          <p className="text-xs text-blue-900/70 font-medium max-w-md italic">
            "Pastikan ketersediaan studio telah dikonfirmasi melalui koordinator lab sebelum melakukan validasi akhir."
          </p>
        </div>
        <div className="text-[10px] font-black text-blue-900/40 uppercase tracking-widest">
          Facilities & Infrastructure
        </div>
      </div>
    </div>
  );
}