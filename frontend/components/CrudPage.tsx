'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

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
        // Let browser set Content-Type with boundary for multipart/form-data
      } else {
        payload = form;
        headers['Content-Type'] = 'application/json';
      }

      if (editingId) {
        await api.put(`${endpoint}/${editingId}`, payload, { headers });
      } else {
        await api.post(endpoint, payload, { headers });
      }
      setForm({});
      setFiles({});
      setEditingId(null);
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus?')) return;
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
    if (field.type === 'textarea') {
      return (
        <textarea
          name={field.name}
          value={form[field.name] || ''}
          onChange={handleChange}
          required={field.required}
          className="w-full p-2 border rounded"
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
          className="w-full p-2 border rounded"
        >
          <option value="">Pilih...</option>
          {field.options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
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
          className="w-full p-2 border rounded"
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
        className="w-full p-2 border rounded"
      />
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6" encType={hasFileField ? 'multipart/form-data' : undefined}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {renderField(field)}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {editingId ? 'Update' : 'Tambah'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              {fields.map((f) => (
                <th key={f.name} className="p-3 text-sm font-semibold">{f.label}</th>
              ))}
              <th className="p-3 text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="border-t">
                {fields.map((f) => (
                  <td key={f.name} className="p-3 text-sm">
                    {typeof item[f.name] === 'object' ? JSON.stringify(item[f.name]) : String(item[f.name] ?? '-')}
                  </td>
                ))}
                <td className="p-3 text-sm flex gap-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={fields.length + 1} className="p-4 text-center text-gray-500">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

