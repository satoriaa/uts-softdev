"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { Search, Edit3, Trash2 } from 'lucide-react';
import api from '@/lib/axios';

type Field = {
  name: string;
  label: string;
  type?: 'text' | 'number' | 'textarea' | 'file' | 'date' | 'password' | 'select';
  required?: boolean;
  options?: string[];
};

type CrudPageProps = {
  endpoint: string; // e.g. '/event'
  title?: string;
  fields: Field[];
};

export default function CrudPage({ endpoint, title, fields }: CrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const imageField = useMemo(() => fields.find((f) => /gambar|image|cover/i.test(f.name)), [fields]);

  async function fetchItems() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(endpoint);
      // backend returns { data: [...] }
      setItems(res.data?.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    const empty: Record<string, any> = {};
    fields.forEach((f) => (empty[f.name] = ''));
    setForm(empty);
  }

  function openEdit(item: any) {
    setEditing(item);
    const f: Record<string, any> = {};
    fields.forEach((field) => {
      f[field.name] = item[field.name] ?? '';
    });
    setForm(f);
  }

  function handleChange(key: string, value: any) {
    setForm((s) => ({ ...s, [key]: value }));
    // if a file is provided, create a preview URL
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrls((p) => ({ ...p, [key]: url }));
    }
  }

  // cleanup preview URLs when component unmounts or when form clears
  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((u) => URL.revokeObjectURL(u));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function validate() {
    for (const field of fields) {
      if (field.required) {
        const val = form[field.name];
        if (field.type === 'file') {
          if (!val && !(editing && editing[field.name])) {
            return `${field.label} wajib diisi`;
          }
        } else {
          if (val === undefined || val === null || String(val).trim() === '') {
            return `${field.label} wajib diisi`;
          }
        }
      }
    }
    return null;
  }

  async function submit() {
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // handle file upload with FormData if any file fields
      const hasFile = fields.some((f) => f.type === 'file' && form[f.name] instanceof File);
      if (editing) {
        if (hasFile) {
          const fd = new FormData();
          Object.entries(form).forEach(([k, v]) => {
            if (v instanceof File) fd.append(k, v);
            else if (v !== undefined) fd.append(k, String(v));
          });
          await api.put(`${endpoint}/${editing._id}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } else {
          await api.put(`${endpoint}/${editing._id}`, form);
        }
      } else {
        if (hasFile) {
          const fd = new FormData();
          Object.entries(form).forEach(([k, v]) => {
            if (v instanceof File) fd.append(k, v);
            else if (v !== undefined) fd.append(k, String(v));
          });
          await api.post(endpoint, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        } else {
          await api.post(endpoint, form);
        }
      }

      // refresh list
      await fetchItems();
      setEditing(null);
      setForm({});
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Submit failed');
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm('Hapus item ini?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">{title || 'CRUD'}</h2>
        <div className="flex items-center gap-2">
          <button onClick={openCreate} className="px-4 py-2 bg-[#EF6145] text-white rounded-xl font-bold hover:bg-[#d94e3d]">Buat Baru</button>
          <button onClick={fetchItems} className="px-3 py-2 border rounded-xl">Refresh</button>
        </div>
      </div>

      {error && <div className="text-red-600 mb-2">{error}</div>}

      <div className="mb-6">
        {loading && <div className="text-gray-500">Loading...</div>}
        {!loading && items.length === 0 && <div className="text-gray-500">Tidak ada data.</div>}
        {!loading && items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                  {imageField && <th className="px-3 py-3">Gambar</th>}
                  {fields.slice(0, 4).map((f) => (
                    <th key={f.name} className="px-3 py-3">{f.label}</th>
                  ))}
                  <th className="px-3 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items
                  .filter((it) => {
                    if (!query) return true;
                    const q = query.toLowerCase();
                    return fields.slice(0, 3).some((f) => String(it[f.name] ?? '').toLowerCase().includes(q));
                  })
                  .slice(page * pageSize, page * pageSize + pageSize)
                  .map((it) => (
                    <tr key={it._id} className="hover:bg-gray-50">
                      {imageField && (
                        <td className="px-3 py-3 align-middle">
                          {it[imageField.name] ? (
                            <img src={it[imageField.name]} alt="thumb" className="h-12 w-12 rounded-md object-cover border" />
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded-md" />
                          )}
                        </td>
                      )}
                      {fields.slice(0, 4).map((f) => (
                        <td key={f.name} className="px-3 py-3 align-middle">
                          {f.name === 'status' ? (
                            <StatusBadge value={it[f.name]} />
                          ) : (
                            String(it[f.name] ?? '')
                          )}
                        </td>
                      ))}
                      <td className="px-3 py-3 align-middle">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(it)} className="px-3 py-1 rounded-lg text-sm bg-white border border-gray-100 hover:shadow flex items-center gap-2">Edit</button>
                          <button onClick={() => removeItem(it._id)} className="px-3 py-1 rounded-lg text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">{editing ? 'Edit Item' : 'Buat Item'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col">
              <label className="text-sm mb-2 font-medium text-gray-700">{f.label}{f.required ? ' *' : ''}</label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.name] ?? ''} onChange={(e) => handleChange(f.name, e.target.value)} className="border border-gray-100 p-3 rounded-xl resize-y" />
              ) : f.type === 'file' ? (
                <>
                  <input type="file" onChange={(e) => handleChange(f.name, e.target.files ? e.target.files[0] : null)} className="" />
                  <input id="cloudinary-gambar-url" type="hidden" />
                  {previewUrls[f.name] && (
                    <img src={previewUrls[f.name]} alt="preview" className="mt-3 max-h-48 rounded-lg object-cover border" />
                  )}
                </>
              ) : f.type === 'select' ? (
                <select
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="border border-gray-100 p-3 rounded-xl"
                >
                  <option value="">-- Pilih --</option>
                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : f.type === 'password' ? 'password' : 'text'}
                  value={form[f.name] ?? ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="border border-gray-100 p-3 rounded-xl"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex items-center gap-3">
            <button onClick={submit} className="px-6 py-3 bg-[#EF6145] text-white rounded-xl font-bold">Simpan</button>
            <button onClick={() => { setEditing(null); setForm({}); setPreviewUrls({}); }} className="px-5 py-3 border rounded-xl">Batal</button>
            <div className="text-sm text-gray-500 ml-auto">{loading ? 'Menyimpan...' : ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value?: string }) {
  const v = (value || '').toLowerCase();
  const map: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    terima: 'bg-green-100 text-green-800',
    accepted: 'bg-green-100 text-green-800',
    tolak: 'bg-red-100 text-red-800',
    tidak_tersedia: 'bg-red-100 text-red-800',
    tersedia: 'bg-green-100 text-green-800',
  };
  const cls = map[v] || 'bg-gray-100 text-gray-700';
  return <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}>{value || '-'}</span>;
}
