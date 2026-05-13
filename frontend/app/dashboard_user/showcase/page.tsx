'use client';

import React, { useState } from 'react';
import { Search, Heart, ExternalLink, LayoutGrid, Filter } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  creator: string;
  category: string;
  likes: number;
  image: string;
}

export default function ShowcasePage() {
  const [query, setQuery] = useState("");

  const projects: Project[] = [
    {
      id: 1,
      title: "Redesign Mobile Banking App",
      creator: "Budi Santoso",
      category: "UI/UX Design",
      likes: 124,
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=1974&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Ilustrasi Digital: Cyberpunk City",
      creator: "Siti Aminah",
      category: "Illustration",
      likes: 89,
      image: "https://images.unsplash.com/photo-1614850523296-e8c041de4398?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 3,
      title: "Brand Identity: Coffee Shop",
      creator: "Andi Wijaya",
      category: "Branding",
      likes: 56,
      image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: 4,
      title: "Dashboard Analytics E-Commerce",
      creator: "Rizky Pratama",
      category: "Web Development",
      likes: 210,
      image: "https://images.unsplash.com/photo-1551288049-bbbda536639a?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <LayoutGrid className="text-[#EF6145]" size={28} />
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
              User Showcase
            </h2>
          </div>
          <div className="h-1.5 w-32 bg-[#EF6145] rounded-full mb-4"></div>
          <p className="text-gray-500 font-medium max-w-lg">
            Galeri karya kreatif dan portofolio terbaik dari para user berbakat kami.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EF6145] transition-colors" size={18} />
            <input
              type="text"
              placeholder="Cari inspirasi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-72 pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl text-black font-bold focus:ring-4 focus:ring-[#EF6145]/10 outline-none transition-all shadow-sm placeholder:text-gray-300 placeholder:font-normal"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="group">
            {/* Card Image */}
            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-100 mb-4 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                <div className="flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <Heart size={18} className="fill-[#EF6145] text-[#EF6145]" />
                    <span className="font-bold text-sm">{project.likes}</span>
                  </div>
                  <button className="p-3 bg-white/20 backdrop-blur-md rounded-xl hover:bg-[#EF6145] transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>

              {/* Category Badge (Static) */}
              <div className="absolute top-5 left-5">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[9px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>

            {/* Project Info */}
            <div className="px-2">
              <h3 className="font-bold text-gray-900 line-clamp-1 group-hover:text-[#EF6145] transition-colors">
                {project.title}
              </h3>
              <p className="text-xs text-gray-400 mt-1 font-medium italic">
                by {project.creator}
              </p>
            </div>
          </div>
        ))}

        {/* Upload New Karya Placeholder */}
        <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center bg-gray-50/30 hover:bg-gray-50 hover:border-[#EF6145]/30 transition-all group cursor-pointer aspect-[4/5]">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
             <span className="text-3xl text-[#EF6145] font-light">+</span>
          </div>
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Upload Karyamu</p>
          <p className="text-[10px] text-gray-300 mt-2">Dapatkan feedback dari komunitas</p>
        </div>
      </div>
    </div>
  );
}