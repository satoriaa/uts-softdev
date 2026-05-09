"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, Edit3, Trash2 } from "lucide-react";
import api from "@/lib/axios";

type Field = {
  name: string;
  label: string;
  type?:
    | "text"
    | "number"
    | "textarea"
    | "file"
    | "date"
    | "password"
    | "select";
  required?: boolean;
  options?: string[];
};

type CrudPageProps = {
  endpoint: string;
  title?: string;
  fields: Field[];
};

export default function CrudPage({
  endpoint,
  title,
  fields,
}: CrudPageProps) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

  const imageField = useMemo(
    () => fields.find((f) => /gambar|image|cover/i.test(f.name)),
    [fields]
  );

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  async function fetchItems() {
    setLoading(true);
    setError(null);

    try {
      const res = await api.get(endpoint);
      setItems(res.data?.data || []);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to fetch"
      );
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);

    const empty: Record<string, any> = {};
    fields.forEach((f) => {
      empty[f.name] = "";
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

      setPreviewUrls((prev) => ({
        ...prev,
        [key]: url,
      }));
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
        if (
          val === undefined ||
          val === null ||
          String(val).trim() === ""
        ) {
          return `${field.label} wajib diisi`;
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
      const hasFile = fields.some(
        (f) => f.type === "file" && form[f.name] instanceof File
      );

      if (editing) {
        if (hasFile) {
          const fd = new FormData();

          Object.entries(form).forEach(([k, v]) => {
            if (v instanceof File) fd.append(k, v);
            else if (v !== undefined) fd.append(k, String(v));
          });

          await api.put(`${endpoint}/${editing._id}`, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
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

          await api.post(endpoint, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } else {
          await api.post(endpoint, form);
        }
      }

      await fetchItems();

      setEditing(null);
      setForm({});
      setPreviewUrls({});
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Submit failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    if (!confirm("Hapus item ini?")) return;

    setLoading(true);
    setError(null);

    try {
      await api.delete(`${endpoint}/${id}`);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Delete failed"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredItems = items.filter((it) => {
    if (!query) return true;

    const q = query.toLowerCase();

    return fields
      .slice(0, 3)
      .some((f) =>
        String(it[f.name] ?? "")
          .toLowerCase()
          .includes(q)
      );
  });

  const paginatedItems = filteredItems.slice(
    page * pageSize,
    page * pageSize + pageSize
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 md:p-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {title || "CRUD"}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreate}
            className="px-4 py-2 bg-[#EF6145] text-white rounded-2xl font-bold hover:bg-[#d94e3d] transition"
          >
            Buat Baru
          </button>

          <button
            onClick={fetchItems}
            className="px-4 py-2 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          placeholder="Cari data..."
          className="w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#EF6145] focus:ring-4 focus:ring-[#EF6145]/10"
        />
      </div>

      <div className="mb-8">
        {loading && <div className="text-gray-500">Loading...</div>}

        {!loading && items.length === 0 && (
          <div className="text-gray-500">Tidak ada data.</div>
        )}

        {!loading && items.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-gray-100">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50">
                  {imageField && <th className="px-4 py-4">Gambar</th>}

                  {fields.slice(0, 4).map((f) => (
                    <th key={f.name} className="px-4 py-4">
                      {f.label}
                    </th>
                  ))}

                  <th className="px-4 py-4">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {paginatedItems.map((it) => (
                  <tr
                    key={it._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    {imageField && (
                      <td className="px-4 py-4">
                        {it[imageField.name] ? (
                          <img
                            src={it[imageField.name]}
                            alt="thumb"
                            className="h-12 w-12 rounded-xl object-cover border"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-xl bg-gray-100" />
                        )}
                      </td>
                    )}

                    {fields.slice(0, 4).map((f) => (
                      <td
                        key={f.name}
                        className="px-4 py-4 text-sm text-gray-900"
                      >
                        {f.name === "status" ? (
                          <StatusBadge value={it[f.name]} />
                        ) : (
                          String(it[f.name] ?? "")
                        )}
                      </td>
                    ))}

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(it)}
                          className="px-3 py-2 rounded-xl text-sm bg-white border border-gray-200 hover:bg-gray-50 flex items-center gap-2 transition"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          onClick={() => removeItem(it._id)}
                          className="px-3 py-2 rounded-xl text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                        >
                          <Trash2 size={14} />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredItems.length > pageSize && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="px-3 py-2 border rounded-xl disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-gray-500">
              Halaman {page + 1} dari{" "}
              {Math.ceil(filteredItems.length / pageSize)}
            </span>

            <button
              disabled={(page + 1) * pageSize >= filteredItems.length}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-2 border rounded-xl disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="border-t border-gray-100 pt-7">
        <h3 className="font-semibold text-gray-900 mb-5">
          {editing ? "Edit Item" : "Buat Item"}
        </h3>

        <div className="grid gap-5 md:grid-cols-2">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
              </label>

              {f.type === "textarea" ? (
                <textarea
                  value={form[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={`Masukkan ${f.label.toLowerCase()}`}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#EF6145] focus:ring-4 focus:ring-[#EF6145]/10 min-h-[120px] resize-y"
                />
              ) : f.type === "file" ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-5 transition hover:border-[#EF6145] hover:bg-orange-50/30">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleChange(
                        f.name,
                        e.target.files ? e.target.files[0] : null
                      )
                    }
                    className="w-full text-sm text-gray-800 file:mr-4 file:rounded-xl file:border-0 file:bg-[#EF6145] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#d94e3d]"
                  />

                  {previewUrls[f.name] && (
                    <img
                      src={previewUrls[f.name]}
                      alt="preview"
                      className="mt-4 max-h-48 rounded-xl object-cover border"
                    />
                  )}
                </div>
              ) : f.type === "select" ? (
                <select
                  value={form[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all duration-200 focus:border-[#EF6145] focus:ring-4 focus:ring-[#EF6145]/10"
                >
                  <option value="">-- Pilih --</option>

                  {(f.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={
                    f.type === "number"
                      ? "number"
                      : f.type === "date"
                      ? "date"
                      : f.type === "password"
                      ? "password"
                      : "text"
                  }
                  value={form[f.name] ?? ""}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                  placeholder={`Masukkan ${f.label.toLowerCase()}`}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#EF6145] focus:ring-4 focus:ring-[#EF6145]/10"
                />
              )}
            </div>
          ))}

          <div className="md:col-span-2 flex items-center gap-3 pt-1">
            <button
              onClick={submit}
              className="px-6 py-3 bg-[#EF6145] text-white rounded-2xl font-bold hover:bg-[#d94e3d] transition"
            >
              Simpan
            </button>

            <button
              onClick={() => {
                setEditing(null);
                setForm({});
                setPreviewUrls({});
              }}
              className="px-5 py-3 border border-gray-200 rounded-2xl text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>

            <div className="ml-auto text-sm text-gray-500">
              {loading ? "Menyimpan..." : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value?: string }) {
  const v = (value || "").toLowerCase();

  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    terima: "bg-green-100 text-green-800",
    accepted: "bg-green-100 text-green-800",
    tolak: "bg-red-100 text-red-800",
    tidak_tersedia: "bg-red-100 text-red-800",
    tersedia: "bg-green-100 text-green-800",
  };

  const cls = map[v] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      {value || "-"}
    </span>
  );
}