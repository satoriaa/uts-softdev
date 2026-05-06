'use client';

export default function ShowcasePage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
        Showcase
      </h2>
      <p className="text-gray-500 mt-3">
        Halaman Showcase untuk user.
      </p>

      <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="text-sm font-bold text-gray-700">
          Placeholder konten
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Nantinya di sini akan menampilkan karya/portfolio milik user.
        </p>
      </div>
    </div>
  );
}

