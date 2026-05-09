'use client';

import CrudPage from '@/app/components/CrudPage';
import { useEffect } from 'react';
import { ShieldCheck, UserCog, CloudUpload, Fingerprint, Mail, IdCard } from 'lucide-react';

export default function UsersPage() {
  useEffect(() => {
    const w = (window as any);
    if (w.cloudinary && w.cloudinary.createUploadWidget) return;

    const scriptId = 'cloudinary-upload-widget';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      const cloudinary = (window as any).cloudinary;
      if (!cloudinary?.createUploadWidget) return;

      const myWidget = cloudinary.createUploadWidget(
        {
          cloudName: 'dfyaergf4',
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'my_preset',
          theme: 'minimal', // Tema widget lebih clean
          colors: { action: '#EF6145' }
        },
        (error: any, result: any) => {
          if (!error && result?.event === 'success') {
            const secureUrl = result?.info?.secure_url;
            const hidden = document.getElementById('cloudinary-gambar-url') as HTMLInputElement | null;
            if (hidden) hidden.value = secureUrl || '';
            alert('Foto berhasil diunggah!');
          }
        }
      );

      const btn = document.getElementById('cloudinary-widget-button');
      if (btn) btn.onclick = () => myWidget.open();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-top-4 duration-1000 px-4 pb-20">
      
      {/* Header Identity - Central Database Style */}
      <div className="relative overflow-hidden bg-[#111111] rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl border-b-8 border-blue-600">
        
        {/* Abstract Security Mesh */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 0)`, backgroundSize: '24px 24px' }}>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
              <ShieldCheck className="text-blue-400" size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                Core Access Control
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              User <br />
              <span className="text-[#EF6145]">Authority.</span>
            </h1>
            
            <p className="text-gray-400 max-w-sm font-medium leading-relaxed">
              Pusat kendali identitas mahasiswa dan administrator <span className="text-white">FSRD UNTAR</span>. Pastikan data terverifikasi dengan benar.
            </p>
          </div>

          {/* User Status Summary */}
          <div className="flex flex-col gap-3 w-full md:w-auto">
             <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <Fingerprint className="text-[#EF6145]" size={24} />
                <div>
                  <div className="text-[10px] text-gray-500 uppercase font-black">Security Level</div>
                  <div className="text-sm font-bold">Encrypted Database</div>
                </div>
             </div>
             
             {/* Cloudinary Integrated Button */}
             <button
                id="cloudinary-widget-button"
                type="button"
                className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-[#EF6145] text-white font-black uppercase text-xs tracking-widest transition-all hover:bg-[#D9553C] hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#EF6145]/20"
              >
                <CloudUpload size={18} className="group-hover:animate-bounce" />
                Upload Profile Picture
              </button>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="relative">
        <div className="bg-white rounded-[3rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
          {/* Internal Header */}
          <div className="px-10 py-8 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white shadow-sm rounded-2xl flex items-center justify-center">
                <UserCog className="text-gray-400" size={24} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-800 tracking-tight">Master User List</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">System Synchronized</p>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex gap-2">
               <div className="p-2 text-gray-300"><Mail size={18}/></div>
               <div className="p-2 text-gray-300"><IdCard size={18}/></div>
            </div>
          </div>

          <div className="p-6 md:p-12">
            <CrudPage
              title="" // Handle via custom header
              endpoint="/users"
              fields={[
                { name: 'nama', label: 'Nama Lengkap', required: true },
                { name: 'nim', label: 'Nomor Induk Mahasiswa (NIM)', required: true },
                { name: 'jurusan', label: 'Program Studi / Jurusan', required: true },
                { name: 'email', label: 'Alamat Email Institusi', required: true },
                { name: 'password', label: 'Security Password', type: 'password', required: true },
                { 
                  name: 'role', 
                  label: 'User Privilege Role', 
                  type: 'select', 
                  options: ['student', 'admin'] 
                },
                { 
                  name: 'gambar', 
                  label: 'Foto Profil (via Cloudinary)', 
                  type: 'file', 
                  required: false 
                },
              ]}
            />
            {/* Hidden field untuk menampung URL Cloudinary */}
            <input type="hidden" id="cloudinary-gambar-url" name="gambar_url" />
            
            <p className="mt-6 text-[10px] text-gray-400 text-center font-medium italic">
              *Klik tombol "Upload Profile Picture" di atas terlebih dahulu jika ingin mengganti foto menggunakan Cloudinary.
            </p>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="mt-12 flex flex-col items-center gap-4 opacity-50">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-500">
          Encrypted • Secure • Verified
        </p>
      </div>
    </div>
  );
}