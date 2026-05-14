'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Calendar, MapPin, Plus } from 'lucide-react';
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

type EventItem = {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
};

function formatTanggal(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);

  // Format Indonesia sederhana: DD Mon YYYY (mis. 12 Jun 2026)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export default function EventPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get('/event');
        const data = res?.data?.data as EventFromApi[] | undefined;

        const mapped: EventItem[] = (data ?? []).map((e) => ({
          id: e._id,
          title: e.judul,
          date: formatTanggal(e.tanggal),
          location: e.lokasi,
          category: 'Event', // karena model Event tidak punya field category
          image:
            e.gambar ||
            'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop',
        }));

        if (mounted) setEvents(mapped);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.response?.data?.message || err?.message || 'Gagal mengambil data event');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchEvents();
    return () => {
      mounted = false;
    };
  }, []);

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center opacity-60">
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-center">
          <div className="text-red-700 font-bold">{error}</div>
        </div>
      );
    }

    if (!events.length) {
      return (
        <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center opacity-60">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <Plus size={24} className="text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Segera Hadir</span>
        </div>
      );
    }

    return null;
  }, [loading, error, events.length]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Featured Events</h2>
        <div className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"></div>
        <p className="text-gray-500 mt-4 font-medium">Temukan berbagai kegiatan menarik dan tingkatkan skill Anda.</p>
      </div>

      {/* Event Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300"
          >
            {/* Image Section */}
            <div className="relative h-48 bg-gray-200">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                  {event.category}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#EF6145] transition-colors">
                {event.title}
              </h3>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{event.location}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-gray-50 text-gray-900 font-bold rounded-2xl flex items-center justify-center gap-2 group-hover:bg-[#EF6145] group-hover:text-white transition-all">
                Lihat Detail
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}

        {content}
      </div>
    </div>
  );
}

