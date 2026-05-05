'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Plus, Inbox, Trash2, Edit3, X, Sparkles, Loader2 } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

interface CrudPageProps {
  title: string;
  endpoint: string;
  fields: Field[];
}

export default function CrudPage({ title, endpoint, fields }: CrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<Record<string, any>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<Record<string, File | null>>({});

  const fetchItems = async () => {
    try {
      const res = await api.get(endpoint);
      setItems(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      setForm({ ...form, [name]: value === '' ? '' : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [e.target.name]: e.target.files[0] });
    }
  };

  const hasFileField = fields.some((f) => f.type === 'file');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload: any;
      let headers: Record<string, string> = {};

      if (hasFileField) {
        const fd = new FormData();
        for (const key in form) {
          if (form[key] !== undefined && form[key] !== null) {
            fd.append(key, form[key]);
          }
        }
        for (const key in files) {
          if (files[key]) {
            fd.append(key, files[key] as File);
          }
        }
        payload = fd;
      } else {
        payload = form;
        headers['Content-Type'] = 'application/json';
      }

      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, payload, { headers });
      } else {
        await api.post(endpoint, payload, { headers });
      }
      handleCancel();
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setForm(item);
    setFiles({});
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await api.delete(`${endpoint}/${id}`);
      fetchItems();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const handleCancel = () => {
    setForm({});
    setFiles({});
    setEditingId(null);
  };

  const renderField = (field: Field) => {
    // FOKUS DI SINI: placeholder:text-gray-900 membuat tulisan instruksi jadi hitam jelas
    const baseClass = "w-full px-5 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#EF6145] focus:outline-none transition-all duration-300 text-sm text-black font-bold placeholder:text-gray-900/60 placeholder:font-medium";
    
    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={form[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          className={`${baseClass} min-h-[140px]`}
          placeholder={`Input ${field.label.toLowerCase()}...`}
        />
      );
    }
    if (field.type === 'select' && field.options) {
      return (
        <select
          name={field.name}
          value={form[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          className={baseClass}
        >
          <option value="" className="text-gray-900">Pilih {field.label}...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt} className="text-black">{opt}</option>
          ))}
        </select>
      );
    }
    if (field.type === 'file') {
      return (
        <input
          type="file"
          name={field.name}
          onChange={handleFileChange}
          required={field.required && !editingId}
          className={`${baseClass} file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#EF6145]/10 file:text-[#EF6145] hover:file:bg-[#EF6145]/20`}
        />
      );
    }
    return (
      <input
        type={field.type || 'text'}
        name={field.name}
        value={form[field.name] || ''}
        onChange={handleChange}
        required={field.required}
        className={baseClass}
        placeholder={`Input ${field.label.toLowerCase()}...`}
      />
    );
  };

  return (
    <div className="space-y-12">
      {/* FORM SECTION */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1.5 bg-[#EF6145] rounded-full"></div>
          <h2 className="text-2xl font-black tracking-tight text-black">
            {editingId ? 'Edit Data' : title}
          </h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {fields.map((field) => (
              <div key={field.name} className={`flex flex-col gap-2 ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                <label className="text-[11px] uppercase font-black tracking-[0.1em] text-gray-700 ml-1">
                  {field.label} {field.required && <span className="text-[#EF6145]">*</span>}
                </label>
                {renderField(field)}
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-4 justify-end">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-4 rounded-2xl font-bold text-sm text-gray-600 hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <X size={18} /> Batal
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="group px-10 py-4 bg-black text-white font-bold rounded-2xl transition-all duration-300 hover:bg-[#EF6145] shadow-lg flex items-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="text-sm tracking-wide">{editingId ? 'SIMPAN' : 'TAMBAH DATA'}</span>
                  {!editingId && <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />}
                </>
              )}
            </button>
          </div>
        </form>
      </section>

      {/* TABLE SECTION */}
      <section className="pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-gray-500">
            <Sparkles size={16} />
            <h3 className="text-xs font-black uppercase tracking-widest">Database Record</h3>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {fields.map((f) => (
                    <th key={f.name} className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-600">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-600 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors group">
                      {fields.map((f) => (
                        <td key={f.name} className="px-6 py-5">
                          <div className="text-sm font-bold text-black">
                            {typeof item[f.name] === 'object' 
                              ? JSON.stringify(item[f.name]) 
                              : String(item[f.name] ?? '-')}
                          </div>
                        </td>
                      ))}
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => handleDelete(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={fields.length + 1} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Inbox size={48} className="text-gray-200" strokeWidth={1} />
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Belum ada data</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}