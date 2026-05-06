import CrudPage from '@/components/CrudPage';

'use client';

import { useEffect } from 'react';

export default function UsersPage() {
  useEffect(() => {
    // Cloudinary Upload Widget
    // Note: preset harus dibuat di Cloudinary dengan nama sesuai kebutuhan.
    const w = (window as any);
    if (w.cloudinary && w.cloudinary.createUploadWidget) {
      // Widget tersedia
      return;
    }

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
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Cloudinary widget error:', error);
            return;
          }

          if (result?.event === 'success') {
            const secureUrl = result?.info?.secure_url;
            const publicId = result?.info?.public_id;
            console.log('Cloudinary upload success:', { secureUrl, publicId });

            // isi value gambar ke input file CrudPage
            // Karena input type=file tidak bisa di-set value secara aman,
            // pendekatan yang paling sederhana: isi field hidden (kami buat di CrudPage lewat querySelector)
            // dan kirimkan via backend sebagai gambar url.
            const hidden = document.getElementById('cloudinary-gambar-url') as HTMLInputElement | null;
            if (hidden) hidden.value = secureUrl || publicId || '';
          }
        }
      );

      // Render widget ke container
      const btn = document.getElementById('cloudinary-widget-button');
      if (btn) {
        btn.addEventListener('click', () => {
          myWidget.open();
        });
      }
    };
  }, []);

  return (
    <>
      <div className="mb-6">
        <button
          id="cloudinary-widget-button"
          type="button"
          className="px-4 py-2 rounded-xl bg-[#EF6145] text-white font-bold hover:bg-[#D9553C]"
        >
          Upload via Cloudinary Widget
        </button>

        <p className="text-xs text-gray-500 mt-3">
          Setelah upload sukses, link gambar akan otomatis ditempel ke field file (file input) untuk dikirim ke backend.
        </p>
      </div>

      <CrudPage
        title="Kelola User"
        endpoint="/users"
        fields={[
          { name: 'nama', label: 'Nama', required: true },
          { name: 'nim', label: 'NIM', required: true },
          { name: 'jurusan', label: 'Jurusan', required: true },
          { name: 'email', label: 'Email', required: true },
          { name: 'password', label: 'Password', type: 'password', required: true },
          { name: 'role', label: 'Role', type: 'select', options: ['student', 'admin'] },
          { name: 'gambar', label: 'Foto Profil (upload)', type: 'file', required: false },
        ]}
      />
    </>
  );
}


