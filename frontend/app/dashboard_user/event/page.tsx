'use client';

import React from 'react';
import { Calendar, MapPin, ArrowRight, Plus } from 'lucide-react';

// Definisikan tipe data untuk TypeScript agar tidak error
interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
}

export default function EventPage() {
  // Data dummy dengan tipe data EventItem[]
  const events: EventItem[] = [
    {
      id: 1,
      title: "Workshop UI/UX Design Modern",
      date: "24 Mei 2024",
      location: "Jakarta Pusat",
      category: "Workshop",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Seminar Teknologi AI 2026",
      date: "12 Juni 2026",
      location: "Online (Zoom)",
      category: "Seminar",
      image: "https://images.unsplash.com/photo-1591115765373-520b7a21769b?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">
          Featured Events
        </h2>
        <div className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"></div>
        <p className="text-gray-500 mt-4 font-medium">
          Temukan berbagai kegiatan menarik dan tingkatkan skill Anda.
        </p>
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
              <img 
                src={event.image} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
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

        {/* Empty State / Coming Soon */}
        <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center opacity-60">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
            <Plus size={24} className="text-gray-400" />
          </div>
          <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Segera Hadir</span>
        </div>
      </div>
    </div>
  );
}