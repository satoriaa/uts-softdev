'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function UserPinjamanPage() {
const [list, setList] = useState<any[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => { fetchList(); }, []);

async function fetchList() {
    setLoading(true); setError(null);
    try {
        const res = await api.get('/pinjaman');
        setList(res.data?.data || []);
    } catch (e: any) {
        setError(e?.response?.data?.message || e.message || 'Gagal mengambil data');
    } finally { setLoading(false); }
}

async function markAsRead(id: string) {
    try {
        await api.put(`/pinjaman/${id}/ack`);
        await fetchList();
    } catch (e: any) {
        alert(e?.response?.data?.message || e.message || 'Gagal menandai sebagai telah dibaca');
    }
}

return (
    <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Riwayat & Status Peminjaman Ruangan</h2>
        {loading && <p>Memuat...</p>}
        {error && <p className="text-rose-500">{error}</p>}
        {!loading && list.length === 0 && <p className="text-gray-500">Belum ada peminjaman.</p>}
    <div className="space-y-4">
        {list.map((it) => {
            const ruang = it.ruang;
            let ruangName = '-';
            if (!ruang) ruangName = '-';
            else if (typeof ruang === 'string') ruangName = ruang;
            else if (typeof ruang === 'object') ruangName = ruang.namaRuang || ruang._id || '-';
            else ruangName = String(ruang);

        return (
            <div key={it._id} className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-bold">{ruangName}</div>
                    <div className="text-sm text-gray-500">
                      {it.userNama || '-'} • {it.userNim || '-'}
                    </div>
                    <div className="text-xs text-gray-500">Tanggal: {new Date(it.tanggalPinjam).toLocaleDateString()}</div>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black ${it.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : it.status === 'terima' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                    {it.status}
                    </span>
                </div>
            </div>
            <div className="text-xs text-gray-500 mt-2">Dibuat: {new Date(it.createdAt).toLocaleString()}</div>
            {!it.notified && it.status !== 'pending' && (
                <div className="mt-3 flex items-center gap-3">
                <div className="text-sm text-gray-700">Status baru: <strong className="uppercase">{it.status}</strong></div>
                <button onClick={() => markAsRead(it._id)} className="px-3 py-1 rounded bg-[#EF6145] text-white text-sm font-bold">Tandai sudah dibaca</button>
                </div>
            )}
            {/* If booking is accepted, allow owner to mark it as finished */}
            {it.status === 'terima' && (
                <div className="mt-3 flex items-center gap-3">
                <button onClick={async () => {
                    if (!confirm('Tandai peminjaman ini sebagai selesai? Ini akan mengosongkan ruangan untuk tanggal tersebut.')) return;
                    try {
                    await api.put(`/pinjaman/${it._id}/finish`);
                    alert('Peminjaman ditandai selesai. Ruangan sekarang tersedia.');
                    await fetchList();
                } catch (e: any) {
                    alert(e?.response?.data?.message || e.message || 'Gagal menandai selesai');
                }
                }} className="px-3 py-1 rounded bg-emerald-600 text-white text-sm font-bold">Selesai</button>
            </div>
            )}
        </div>
        );
        })}
    </div>
    </div>
    );
}