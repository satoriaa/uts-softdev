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

// Struktur data lokal yang diperluas untuk menampung deskripsi/ketentuan di popup
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

// Komponen Card Kegiatan
function ActivityCard({ item, onOpenDetail }: { item: EventItem; onOpenDetail: (item: EventItem) => void }) {
  return (
    <div className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gray-200">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#EF6145] transition-colors min-h-[3.5rem] line-clamp-2">
          {item.title}
        </h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <Calendar size={16} className="text-gray-400" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <MapPin size={16} className="text-gray-400" />
            <span>{item.location}</span>
          </div>
        </div>

        <button
          onClick={() => onOpenDetail(item)}
          className="w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 group-hover:bg-[#EF6145] group-hover:text-white transition-all"
        >
          Lihat Detail
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

// Komponen Modal Popup Detail Info
function DetailModal({ item, onClose }: { item: EventItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop Klik untuk Close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Box Modal */}
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 max-h-[90vh] flex flex-col z-10 animate-scale-up">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-black rounded-full shadow-md transition-all z-20"
        >
          <X size={20} />
        </button>

        {/* Gambar Utama Modal */}
        <div className="relative h-64 sm:h-72 bg-gray-200 flex-shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute bottom-4 left-6">
            <span className="px-3 py-1 bg-[#EF6145] text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-md">
              {item.category}
            </span>
          </div>
        </div>

        {/* Isi Info Detail (Scrollable jika teks panjang) */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-4">
              {item.title}
            </h3>

            {/* Meta Info Grid */}
            <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center text-gray-700 text-sm gap-2">
                <Calendar size={18} className="text-[#EF6145]" />
                <span className="font-semibold">{item.date}</span>
              </div>
              <div className="flex items-center text-gray-700 text-sm gap-2">
                <MapPin size={18} className="text-[#EF6145]" />
                <span className="font-semibold">{item.location}</span>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-gray-400">Deskripsi Kegiatan</h4>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
          </div>

          {/* Ketentuan (Khusus jika ada data dari API Event) */}
          {item.requirement && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <h4 className="text-sm font-black uppercase tracking-wider text-gray-400">Ketentuan & Syarat</h4>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.requirement}</p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm rounded-xl transition-all"
          >
            Tutup Detail
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventPage() {
  const [items, setItems] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('Semua');
  
  // State untuk menyimpan item yang sedang aktif di popup modal
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
    return () => {
      mounted = false;
    };
  }, []);

  const categorizedData = useMemo(() => {
    return {
      Event: items.filter((i) => i.category === 'Event'),
      Workshop: items.filter((i) => i.category === 'Workshop'),
      Lomba: items.filter((i) => i.category === 'Lomba'),
      Proker: items.filter((i) => i.category === 'Proker'),
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'Semua') return items;
    return items.filter((it) => it.category.toLowerCase() === activeCategory.toLowerCase());
  }, [items, activeCategory]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center opacity-60">
        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">Loading Kegiatan...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-red-700 font-bold max-w-md mx-auto">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Our Activities</h2>
        <div className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"></div>
        <p className="text-gray-500 mt-4 font-medium">Temukan berbagai kegiatan menarik dan tingkatkan skill Anda.</p>
      </div>

      {/* Tabs Filter Category */}
      <div className="flex flex-wrap gap-2 mb-12 bg-gray-50 p-2 rounded-2xl w-fit border border-gray-100">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-[#EF6145] text-white shadow-md shadow-[#EF6145]/20'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tampilan Konten Kondisional */}
      {activeCategory === 'Semua' ? (
        <div className="space-y-16">
          {Object.entries(categorizedData).map(([categoryName, dataList]) => {
            if (dataList.length === 0) return null;

            return (
              <div key={categoryName} className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-xl font-black text-gray-800 uppercase tracking-wider italic">
                    {categoryName}
                  </h3>
                  <div className="h-[2px] flex-1 bg-gray-100 rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dataList.map((item) => (
                    <ActivityCard key={item.id} item={item} onOpenDetail={setSelectedItem} />
                  ))}
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
              <Plus size={24} className="text-gray-400 mb-2" />
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Belum Ada Kegiatan Apapun</span>
            </div>
          )}
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
            <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
              <Plus size={24} className="text-gray-400 mb-2" />
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{activeCategory} Belum Tersedia</span>
            </div>
          )}
        </div>
      )}

      {/* RENDER MODAL POPUP JIKA ITEM DIPILIH */}
      {selectedItem && (
        <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}