"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Edit3, Trash2, Plus, RefreshCw, CheckCircle2, AlertCircle, X } from "lucide-react";
import api from "@/lib/axios";
import { debounce, throttle } from "@/lib/rateLimit";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "textarea" | "file" | "date" | "password" | "select";
  required?: boolean;
  options?: string[];
};

type CrudPageProps = {
  endpoint: string;
  title?: string;
  fields: Field[];
};

// Helper untuk memastikan gambar terbaca dari URL backend
const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return 'https://placehold.co/100x100?text=No+Img';
  if (imagePath.startsWith('http') || imagePath.startsWith('data:image')) return imagePath;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl.replace(/\/$/, '')}/${imagePath.replace(/^\//, '')}`;
};

export default function CrudPage({ endpoint, title, fields }: CrudPageProps) {
  type Item = {
    _id: string;
    [key: string]: any;
  };
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ message, type });
    setTimeout(() => setNotif(null), 3000);
  };

  const imageField = useMemo(
    () => fields.find((f) => /gambar|image|cover/i.test(f.name)),
    [fields]
  );

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  useEffect(() => {
    const fn = debounce((val: string) => setDebouncedQuery(val), 300);
    fn(query);
    return () => {};
  }, [query]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoint);
      setItems(res.data?.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Gagal mengambil data";
      setError(msg);
      showNotif(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    const empty: Record<string, any> = {};
    fields.forEach((f) => {
      empty[f.name] = f.type === "number" ? 0 : "";
    });
    setForm(empty);
    setPreviewUrls({});
  }

  function openEdit(item: any) {
    setEditing(item);
    const next: Record<string, any> = {};
    fields.forEach((f) => {
      next[f.name] = item[f.name] ?? "";
    });
    setForm(next);
    setPreviewUrls({});
  }

  function handleChange(key: string, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (value instanceof File) {
      if (previewUrls[key]) {
        URL.revokeObjectURL(previewUrls[key]);
      }
      const url = URL.createObjectURL(value);
      setPreviewUrls((prev) => ({ ...prev, [key]: url }));
    }
  }

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  function validate() {
    for (const field of fields) {
      if (!field.required) continue;
      const val = form[field.name];

      if (field.type === "file") {
        if (!val && !(editing && editing[field.name])) {
          return `${field.label} wajib diisi`;
        }
      } else {
        if (val === undefined || val === null || String(val).trim() === "") {
          return `${field.label} wajib diisi`;
        }
      }
    }
    return null;
  }

  async function submit() {
    const errMsg = validate();
    if (errMsg) {
      showNotif(errMsg, "error");
      return;
    }

    setLoading(true);
    try {
      // Selalu gunakan multipart/form-data agar nilai gambar dari Cloudinary
      // (yang bisa berupa string secure_url di hidden input) tetap ikut terkirim.
      const fd = new FormData();

      Object.entries(form).forEach(([k, v]) => {
        if (v instanceof File) {
          fd.append(k, v);
        } else if (v !== undefined && v !== null && String(v).trim() !== "") {
          fd.append(k, String(v));
        }
      });

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const dataToSend = fd;


      if (editing) {
        await api.put(`${endpoint}/${editing._id}`, dataToSend, config);
        showNotif("Data berhasil diperbarui!", "success");
      } else {
        await api.post(endpoint, dataToSend, config);
        showNotif("Data berhasil ditambahkan!", "success");
      }

      await fetchItems();
      setEditing(null);
      setForm({});
      setPreviewUrls({});
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Gagal menyimpan data";
      showNotif(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Hapus item ini?")) return;

    setLoading(true);
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
      showNotif("Data berhasil dihapus!", "success");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Gagal menghapus data";
      showNotif(msg, "error");
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter((it) => {
    if (!debouncedQuery) return true;
    const q = debouncedQuery.toLowerCase();

    return fields.slice(0, 3).some((f) => String(it[f.name] ?? "").toLowerCase().includes(q));
  });

  const paginatedItems = filteredItems.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="relative bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 md:p-7">
      
      {error && (
        <div className="hidden">
          {error}
        </div>
      )}

      {/* ✅ MODERN TOAST NOTIFICATION */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {notif && (
          <div className={`
            pointer-events-auto min-w-[320px] flex items-center gap-4 px-4 py-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all duration-500 animate-in slide-in-from-right-10
            ${notif.type === "success" ? "bg-emerald-500/95 border-emerald-400 text-white" : "bg-rose-500/95 border-rose-400 text-white"}
          `}>
            <div className="bg-white/20 p-2 rounded-xl">
              {notif.type === "success" ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm tracking-tight">
                {notif.type === "success" ? "Berhasil!" : "Gagal!"}
              </p>
              <p className="text-xs opacity-90">{notif.message}</p>
            </div>
            <button onClick={() => setNotif(null)} className="hover:bg-white/10 p-1 rounded-lg transition">
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-gray-900 uppercase italic">
            {title || "Management"}
          </h2>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mt-1">
            Total: {filteredItems.length} Data
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari data..."
              className="pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#EF6145]/20 transition w-full md:w-64"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#EF6145] text-white rounded-2xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#EF6145]/20"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Tambah</span>
          </button>
          <button
            onClick={throttle(() => fetchItems(), 1000)}
            disabled={loading}
            className="p-2.5 border border-gray-100 rounded-2xl text-gray-400 hover:bg-gray-50 transition active:rotate-180"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* CONTENT: FORM OR TABLE */}
      {editing !== null || Object.keys(form).length > 0 ? (
        <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 tracking-tight">
              {editing ? "🚀 EDIT DATA" : "✨ DATA BARU"}
            </h3>
            <button onClick={() => { setEditing(null); setForm({}); }} className="text-gray-400 hover:text-gray-600 font-medium text-sm">
              Batalkan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-2 px-1">
                  {f.label} {f.required && <span className="text-[#EF6145]">*</span>}
                </label>

                {f.type === "textarea" ? (
                  <textarea
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#EF6145]/10 outline-none transition min-h-[120px] text-black placeholder:text-black"
                    value={form[f.name] || ""}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  />
                ) : f.type === "select" ? (
                  <select
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#EF6145]/10 outline-none transition appearance-none text-black placeholder:text-black"
                    value={form[f.name] || ""}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  >
                    <option value="">Pilih {f.label}</option>
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : f.type === "file" ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      className="text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#EF6145]/10 file:text-black hover:file:bg-[#EF6145]/20 cursor-pointer w-full"
                      onChange={(e) => handleChange(f.name, e.target.files?.[0])}
                    />
                    {(previewUrls[f.name] || (editing && editing[f.name])) && (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                        <img
                          src={previewUrls[f.name] || getImageUrl(editing[f.name])}
                          className="w-full h-full object-cover bg-gray-100"
                          alt="preview"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={f.type || "text"}
                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-[#EF6145]/10 outline-none transition text-black placeholder:text-black"
                    value={form[f.name] || ""}
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-8 py-4 bg-[#EF6145] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#EF6145]/20 hover:translate-y-[-2px] transition-all disabled:opacity-50"
          >
            {loading ? "MEMPROSES..." : editing ? "SIMPAN PERUBAHAN" : "SIMPAN DATA BARU"}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">Data</th>
                {fields.slice(0, 2).map((f) => (
                  <th key={f.name} className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest hidden sm:table-cell">{f.label}</th>
                ))}
                <th className="pb-4 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedItems.map((it) => (
                <tr key={it._id} className="group hover:bg-gray-50/50 transition">
                  <td className="py-5">
                    <div className="flex items-center gap-4">
                      {imageField && (
                        <img 
                          src={getImageUrl(it[imageField.name])} 
                          className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100" 
                          alt="item" 
                        />
                      )}
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{it[fields[0].name]}</p>
                        <p className="text-xs text-gray-400 font-medium truncate max-w-[150px]">{it[fields[1]?.name]}</p>
                      </div>
                    </div>
                  </td>
                  {fields.slice(0, 2).map((f) => (
                    <td key={f.name} className="py-5 text-sm text-gray-500 hidden sm:table-cell">
                      {it[f.name]}
                    </td>
                  ))}
                  <td className="py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button onClick={() => openEdit(it)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => removeItem(it._id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedItems.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-medium tracking-tight italic">Belum ada data yang tersedia.</p>
            </div>
          )}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Halaman {page + 1}
        </p>
        <div className="flex gap-2">
          <button
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-xs font-black border border-gray-100 rounded-xl disabled:opacity-30 hover:bg-gray-50 transition uppercase tracking-widest"
          >
            Prev
          </button>
          <button
            disabled={(page + 1) * pageSize >= filteredItems.length}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-xs font-black bg-gray-900 text-white rounded-xl disabled:opacity-30 hover:bg-gray-800 transition uppercase tracking-widest"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}