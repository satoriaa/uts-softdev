'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, MapPin, Plus, X } from 'lucide-react';
import api from '@/lib/axios';

type EventFromApi = {
  _id: string;
  judul: string;
  deskripsi?: string;
  ketentuan?: string;
  lokasi: string;
  tanggal: string | Date;
  gambar?: string;
};

type WorkshopFromApi = {
  _id: string;
  nama?: string;
  deskripsi?: string;
  tanggal: string | Date;
  tempat?: string;
  gambar?: string;
};

type LombaFromApi = {
  _id: string;
  nama?: string;
  deskripsi?: string;
  tanggal: string | Date;
  tempat?: string;
  gambar?: string;
};

type ProkerFromApi = {
  _id: string;
  nama?: string;
  deskripsi?: string;
  tanggal: string | Date;
  tempat?: string;
  gambar?: string;
};

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  description: string;
  requirement?: string;
};

const CATEGORIES = ['Semua', 'Event', 'Workshop', 'Lomba', 'Proker'];

function formatTanggal(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop';

function mapToItem(params: {
  id: string;
  title: string;
  date: string | Date;
  location: string;
  category: string;
  image?: string;
  description?: string;
  requirement?: string;
}): EventItem {
  return {
    id: params.id,
    title: params.title,
    date: formatTanggal(params.date),
    location: params.location,
    category: params.category,
    image: params.image || DEFAULT_IMAGE,
    description: params.description || 'Tidak ada deskripsi untuk kegiatan ini.',
    requirement: params.requirement,
  };
}

/* ─────────────────────────────────────────
   ACTIVITY CARD — with layered shadow &
   image parallax-scale + shine sweep effect
───────────────────────────────────────── */
function ActivityCard({ item, onOpenDetail }: { item: EventItem; onOpenDetail: (item: EventItem) => void }) {
  return (
    <>
      <style>{`
        @keyframes shineSweep {
          0%   { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(300%) skewX(-15deg); }
        }
        .card-shine::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.18) 50%,
            transparent 100%
          );
          transform: translateX(-100%) skewX(-15deg);
          pointer-events: none;
          z-index: 2;
        }
        .activity-card:hover .card-shine::after {
          animation: shineSweep 0.6s ease forwards;
        }
        .activity-card:hover .card-img {
          transform: scale(1.06);
        }
        .activity-card {
          transition: box-shadow 0.35s cubic-bezier(.22,.68,0,1.2), transform 0.35s cubic-bezier(.22,.68,0,1.2);
        }
        .activity-card:hover {
          box-shadow:
            0 4px 6px -1px rgba(239,97,69,0.07),
            0 20px 40px -8px rgba(239,97,69,0.18),
            0 40px 60px -12px rgba(0,0,0,0.12);
          transform: translateY(-6px);
        }
        .detail-btn {
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .detail-btn:hover {
          background: #EF6145;
          color: white;
          border-color: #EF6145;
        }
      `}</style>
      <div className="activity-card group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]">
        {/* Image */}
        <div className="relative h-48 bg-gray-200 overflow-hidden card-shine">
          <img
            src={item.image}
            alt={item.title}
            className="card-img w-full h-full object-cover transition-transform duration-500 ease-out"
          />
          {/* gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 z-10">
            <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
              {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#EF6145] transition-colors duration-200 min-h-[3.5rem] line-clamp-2">
            {item.title}
          </h3>

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-gray-500 text-sm gap-2">
              <Calendar size={15} className="text-[#EF6145]/60 flex-shrink-0" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm gap-2">
              <MapPin size={15} className="text-[#EF6145]/60 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenDetail(item)}
            className="detail-btn w-full py-3 bg-white text-gray-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-200"
          >
            <span>Lihat Detail</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   DETAIL MODAL — cinematic entrance,
   layered shadows, glassmorphism close btn
───────────────────────────────────────── */
function DetailModal({ item, onClose }: { item: EventItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Small delay so the browser registers the initial state before animating
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
  }

  return (
    <>
      <style>{`
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes backdropOut {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes modalOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.97); }
        }
        .modal-backdrop {
          animation: backdropIn 0.22s ease forwards;
        }
        .modal-backdrop.leaving {
          animation: backdropOut 0.22s ease forwards;
        }
        .modal-box {
          animation: modalIn 0.25s ease forwards;
        }
        .modal-box.leaving {
          animation: modalOut 0.2s ease forwards;
        }
        .modal-img-overlay {
          background: linear-gradient(
            180deg,
            rgba(0,0,0,0) 30%,
            rgba(0,0,0,0.55) 100%
          );
        }
        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #EF6145;
          padding: 4px 10px;
          background: rgba(239,97,69,0.08);
          border-radius: 8px;
          border: 1px solid rgba(239,97,69,0.15);
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          background: #fafafa;
          border: 1px solid #f0f0f0;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }

        .modal-box {
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.04),
            0 8px 24px -4px rgba(0,0,0,0.12),
            0 32px 64px -8px rgba(0,0,0,0.22),
            0 64px 80px -16px rgba(239,97,69,0.08);
        }
      `}</style>

      <div
        className={`modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${!visible ? 'leaving' : ''}`}
      >
        <div className="absolute inset-0" onClick={handleClose} />

        <div className={`modal-box relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col z-10 ${!visible ? 'leaving' : ''}`}>
          
          {/* Hero image */}
          <div className="relative h-64 sm:h-72 bg-gray-200 flex-shrink-0 overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="modal-img-overlay absolute inset-0" />

            {/* Category + title overlay */}
            <div className="absolute bottom-5 left-6 right-14">
              <span className="inline-block px-3 py-1 bg-[#EF6145] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg mb-2">
                {item.category}
              </span>
              <h3 className="text-white text-xl font-black leading-tight drop-shadow-md">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">

            {/* Meta pills */}
            <div className="flex flex-wrap gap-3">
              <div className="meta-pill">
                <Calendar size={15} className="text-[#EF6145]" />
                {item.date}
              </div>
              <div className="meta-pill">
                <MapPin size={15} className="text-[#EF6145]" />
                {item.location}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Description */}
            <div className="space-y-3">
              <div className="section-tag">
                <span>Deskripsi Kegiatan</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Requirement */}
            {item.requirement && (
              <div className="space-y-3 pt-2">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <div className="section-tag">
                  <span>Ketentuan &amp; Syarat</span>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                  {item.requirement}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-end flex-shrink-0">
            <button
              onClick={handleClose}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-700 active:scale-95 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   CATEGORY TAB BUTTON
───────────────────────────────────────── */
function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <>
      <style>{`
        .tab-btn {
          position: relative;
          overflow: hidden;
          transition: color 0.2s, background 0.2s;
        }
        .tab-btn.active {
          background: #EF6145;
          color: white;
          box-shadow: 0 4px 14px -2px rgba(239,97,69,0.35), 0 1px 3px rgba(239,97,69,0.2);
        }
        .tab-btn:not(.active):hover {
          background: rgba(239,97,69,0.06);
          color: #111;
        }
      `}</style>
      <button
        onClick={onClick}
        className={`tab-btn px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider ${active ? 'active' : 'text-gray-500'}`}
      >
        {label}
      </button>
    </>
  );
}

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function EventPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [selectedItem, setSelectedItem] = useState<EventItem | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAll() {
      try {
        setLoading(true);
        setError(null);

        const [eventRes, workshopRes, lombaRes, prokerRes] = await Promise.all([
          api.get('/event').catch(() => null),
          api.get('/workshop').catch(() => null),
          api.get('/lomba').catch(() => null),
          api.get('/proker').catch(() => null),
        ]);

        const eventData = eventRes?.data?.data as EventFromApi[] | undefined;
        const workshopData = workshopRes?.data?.data as WorkshopFromApi[] | undefined;
        const lombaData = lombaRes?.data?.data as LombaFromApi[] | undefined;
        const prokerData = prokerRes?.data?.data as ProkerFromApi[] | undefined;

        const mapped: EventItem[] = [
          ...(eventData ?? []).map((e) =>
            mapToItem({ id: e._id, title: e.judul, date: e.tanggal, location: e.lokasi, category: 'Event', image: e.gambar, description: e.deskripsi, requirement: e.ketentuan })
          ),
          ...(workshopData ?? []).map((w) =>
            mapToItem({ id: w._id, title: w.nama || 'Workshop', date: w.tanggal, location: w.tempat || 'Lokasi', category: 'Workshop', image: w.gambar, description: w.deskripsi })
          ),
          ...(lombaData ?? []).map((l) =>
            mapToItem({ id: l._id, title: l.nama || 'Lomba', date: l.tanggal, location: l.tempat || 'Lokasi', category: 'Lomba', image: l.gambar, description: l.deskripsi })
          ),
          ...(prokerData ?? []).map((p) =>
            mapToItem({ id: p._id, title: p.nama || 'Proker', date: p.tanggal, location: p.tempat || 'Lokasi', category: 'Proker', image: p.gambar, description: p.deskripsi })
          ),
        ];

        if (mounted) setItems(mapped);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Gagal mengambil data kegiatan');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchAll();
    return () => { mounted = false; };
  }, []);

  const categorizedData = useMemo(() => ({
    Event: items.filter((i) => i.category === 'Event'),
    Workshop: items.filter((i) => i.category === 'Workshop'),
    Lomba: items.filter((i) => i.category === 'Lomba'),
    Proker: items.filter((i) => i.category === 'Proker'),
  }), [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Semua') return items;
    return items.filter((it) => it.category.toLowerCase() === activeCategory.toLowerCase());
  }, [items, activeCategory]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="flex gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#EF6145]"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Kegiatan…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-red-700 font-bold max-w-md mx-auto shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Our Activities</h2>
        <div className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full" style={{ boxShadow: '0 2px 10px rgba(239,97,69,0.4)' }} />
        <p className="text-gray-500 mt-4 font-medium">Temukan berbagai kegiatan menarik dan tingkatkan skill Anda.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-12 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100 shadow-inner">
        {CATEGORIES.map((cat) => (
          <TabButton
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onClick={() => setActiveCategory(cat)}
          />
        ))}
      </div>

      {/* Content */}
      {activeCategory === 'Semua' ? (
        <div className="space-y-16">
          {Object.entries(categorizedData).map(([categoryName, dataList]) => {
            if (dataList.length === 0) return null;
            return (
              <div key={categoryName} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-wider italic whitespace-nowrap">
                    {categoryName}
                  </h3>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dataList.map((item) => (
                    <ActivityCard key={item.id} item={item} onOpenDetail={setSelectedItem} />
                  ))}
                </div>
              </div>
            );
          })}
          {items.length === 0 && <EmptyState label="Belum Ada Kegiatan Apapun" />}
        </div>
      ) : (
        <div>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ActivityCard key={item.id} item={item} onOpenDetail={setSelectedItem} />
              ))}
            </div>
          ) : (
            <EmptyState label={`${activeCategory} Belum Tersedia`} />
          )}
        </div>
      )}

      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
      <Plus size={24} className="text-gray-400 mb-2" />
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  );
}
