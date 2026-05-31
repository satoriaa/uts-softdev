'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User, Mail, Hash, BookOpen, ShieldCheck, Edit2, Camera, KeyRound, Plus, Trash2, LayoutGrid, X, Image as ImageIcon, DoorOpen, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

type Msg = { type: 'success' | 'error'; text: string };

export default function ProfilPage() {
  const { user, token, setAuth } = useAuthStore();

  const [isEditingNama, setIsEditingNama] = useState(false);
  const [draftNama, setDraftNama] = useState('');
  const [savingNama, setSavingNama] = useState(false);
  const [namaMsg, setNamaMsg] = useState<Msg | null>(null);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<Msg | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);

  const [preview, setPreview] = useState(user?.gambar || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Karya States
  const [karyas, setKaryas] = useState<any[]>([]);
  const [loadingKaryas, setLoadingKaryas] = useState(false);
  const [isKaryaModalOpen, setIsKaryaModalOpen] = useState(false);
  const [editingKaryaId, setEditingKaryaId] = useState<string | null>(null);
  const [draftKarya, setDraftKarya] = useState({ judul: '', deskripsi: '', kategori: 'sketsa' });
  const [karyaFile, setKaryaFile] = useState<File | null>(null);
  const [karyaPreview, setKaryaPreview] = useState('');
  const [savingKarya, setSavingKarya] = useState(false);

  // Pinjaman States
  const [pinjamans, setPinjamans] = useState<any[]>([]);
  const [loadingPinjamans, setLoadingPinjamans] = useState(false);
  const [filterPinjaman, setFilterPinjaman] = useState<string>('Aktif');

  const filteredPinjamans = pinjamans.filter(p => {
    if (filterPinjaman === 'Aktif') return p.status === 'pending' || p.status === 'terima';
    if (filterPinjaman === 'Pending') return p.status === 'pending';
    if (filterPinjaman === 'Ditolak') return p.status === 'tolak';
    if (filterPinjaman === 'Terima') return p.status === 'terima';
    if (filterPinjaman === 'Selesai') return p.status === 'selesai';
    return true; // For 'Semua' or fallback
  });

  const fetchPinjamans = async () => {
    if (!user?._id) return;
    setLoadingPinjamans(true);
    try {
      const res = await api.get('/pinjaman');
      if (res.data && res.data.success) {
        setPinjamans(res.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pinjamans:', error);
    } finally {
      setLoadingPinjamans(false);
    }
  };

  const handleFinishPinjaman = async (id: string) => {
    if (!confirm('Tandai peminjaman ini sebagai selesai? Ruangan akan kembali tersedia.')) return;
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base.replace(/\/$/, '')}/api/pinjaman/${id}/finish`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal menandai selesai');
      alert('Peminjaman ditandai selesai. Terima kasih.');
      await fetchPinjamans();
    } catch (e: any) {
      alert(e.message || 'Gagal menandai selesai');
    }
  };

  const fetchKaryas = async () => {
    if (!user?._id) return;
    setLoadingKaryas(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base.replace(/\/$/, '')}/api/karya`);
      if (res.ok) {
        const json = await res.json();
        const allKarya = json.data || [];
        const myKarya = allKarya.filter((k: any) => k.user && String(k.user._id) === String(user._id));
        setKaryas(myKarya);
      }
    } catch (error) {
      console.error('Failed to fetch karyas:', error);
    } finally {
      setLoadingKaryas(false);
    }
  };

  useEffect(() => {
    fetchKaryas();
    fetchPinjamans();
  }, [user?._id]);

  const handleOpenKaryaModal = (karya: any = null) => {
    if (karya) {
      setEditingKaryaId(karya._id);
      setDraftKarya({ judul: karya.judul, deskripsi: karya.deskripsi, kategori: karya.kategori });
      setKaryaPreview(karya.gambar || '');
      setKaryaFile(null);
    } else {
      setEditingKaryaId(null);
      setDraftKarya({ judul: '', deskripsi: '', kategori: 'sketsa' });
      setKaryaPreview('');
      setKaryaFile(null);
    }
    setIsKaryaModalOpen(true);
  };

  const handleKaryaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setKaryaFile(file);
      setKaryaPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveKarya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draftKarya.judul || !draftKarya.deskripsi || !draftKarya.kategori) {
      alert('Mohon isi semua kolom yang wajib.');
      return;
    }
    if (!editingKaryaId && !karyaFile && !karyaPreview) {
      alert('Mohon upload gambar karya.');
      return;
    }

    setSavingKarya(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const formData = new FormData();
      formData.append('judul', draftKarya.judul);
      formData.append('deskripsi', draftKarya.deskripsi);
      formData.append('kategori', draftKarya.kategori);
      formData.append('username', user?.nama || 'User');
      formData.append('nim', user?.nim || '-');
      if (karyaFile) {
        formData.append('gambar', karyaFile);
      }

      const method = editingKaryaId ? 'PUT' : 'POST';
      const url = editingKaryaId 
        ? `${base.replace(/\/$/, '')}/api/karya/${editingKaryaId}` 
        : `${base.replace(/\/$/, '')}/api/karya`;

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || 'Gagal menyimpan karya');
      }

      await fetchKaryas();
      setIsKaryaModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSavingKarya(false);
    }
  };

  const handleDeleteKarya = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus karya ini?')) return;
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${base.replace(/\/$/, '')}/api/karya/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Gagal menghapus karya');
      await fetchKaryas();
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    setPreview(user?.gambar || '');
  }, [user?.gambar]);

  useEffect(() => {
    if (user?.nama) setDraftNama(user.nama);
  }, [user?.nama]);

  const handleSaveNama = async () => {
    const nama = draftNama.trim();
    if (!nama) {
      setNamaMsg({ type: 'error', text: 'Nama tidak boleh kosong.' });
      return;
    }

    setSavingNama(true);
    setNamaMsg(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nama }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal menyimpan nama.');
      }

      setAuth(data.data, token || '');
      setNamaMsg({ type: 'success', text: 'Nama berhasil diperbarui.' });
      setIsEditingNama(false);
    } catch (e: any) {
      setNamaMsg({ type: 'error', text: e?.message || 'Terjadi kesalahan saat menyimpan nama.' });
    } finally {
      setSavingNama(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordEmail.trim()) {
      setPasswordMsg({ type: 'error', text: 'Email harus diisi.' });
      return;
    }
    if (!newPassword.trim()) {
      setPasswordMsg({ type: 'error', text: 'Password baru harus diisi.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'Password baru dan konfirmasi password tidak cocok.' });
      return;
    }

    setSavingPassword(true);
    setPasswordMsg(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base.replace(/\/$/, '')}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: passwordEmail.trim(),
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengubah password.');
      }

      setPasswordMsg({ type: 'success', text: data.message || 'Password berhasil diubah! Silakan login.' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (e: any) {
      setPasswordMsg({ type: 'error', text: e?.message || 'Terjadi kesalahan saat mengubah password.' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Silakan pilih file gambar JPG/PNG.');
      setMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('gambar', file);

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${base.replace(/\/$/, '')}/api/auth/me`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Gagal mengunggah foto profil.');
      }

      setAuth(data.data, token || '');
      setPreview(data.data.gambar || '');
      setMessage('Foto profil berhasil diperbarui.');
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat mengunggah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:py-16 animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Pengaturan Profil
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Kelola data informasi akademik dan foto profil institusi Anda.
          </p>
        </div>
        <div className="h-1 w-20 bg-[#EF6145] rounded-full hidden md:block"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-8 shadow-sm text-center relative overflow-hidden group">
            {/* Dekorasi Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-gray-50 to-gray-100/50 border-b border-gray-100"></div>

            <div className="relative inline-block mt-4">
              <div className="w-36 h-36 bg-white rounded-full p-1.5 shadow-xl ring-4 ring-gray-50 overflow-hidden mx-auto relative group/avatar">
                {preview ? (
                  <img src={preview} alt="Profil" className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover/avatar:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400 rounded-full">
                    <User size={64} className="stroke-[1.5]" />
                  </div>
                )}

                {/* Overlay Loading */}
                {loading && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center rounded-full">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <label
                htmlFor="profileImageUpload"
                className={`absolute bottom-1 right-1 p-3 bg-[#EF6145] text-white rounded-2xl shadow-md transition-all duration-200 cursor-pointer hover:bg-[#d85036] hover:scale-105 ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <Camera size={16} />
              </label>
              <input
                id="profileImageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                disabled={loading}
                onChange={handleFileChange}
              />
            </div>

            {/* Status Messages */}
            {message && (
              <div className="mt-5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 animate-pulse">
                {message}
              </div>
            )}
            {error && (
              <div className="mt-5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-100 rounded-xl px-4 py-2.5">
                {error}
              </div>
            )}

            <h3 className="text-xl font-bold text-gray-900 mt-6 tracking-tight">
              {user?.nama || 'Guest User'}
            </h3>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1.5 bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-100">
              {user?.nim || 'NIM Tidak Terdaftar'}
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50/70 border border-emerald-100 text-emerald-700 rounded-2xl text-xs font-bold tracking-wide">
                <ShieldCheck size={16} className="text-emerald-600" />
                Verified Student
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Details Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile (Nama) */}
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-8 pb-3 border-b border-gray-50">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span>Informasi Akademik</span>
              </h4>

              <button
                type="button"
                onClick={() => setIsEditingNama((v) => !v)}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <Edit2 size={14} />
                {isEditingNama ? 'Batal' : 'Edit Nama'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {/* Field: Nama */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl transition-colors hover:bg-gray-50/50 md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                    <User size={18} />
                  </div>

                  <div className="space-y-1 w-full">
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</label>

                    {isEditingNama ? (
                      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                        <input
                          value={draftNama}
                          onChange={(e) => setDraftNama(e.target.value)}
                          type="text"
                          className="w-full sm:flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#EF6145]/30"
                          placeholder="Masukkan nama lengkap"
                        />
                        <button
                          type="button"
                          onClick={handleSaveNama}
                          disabled={savingNama}
                          className="px-4 py-2 rounded-xl bg-[#EF6145] text-white text-xs font-bold hover:bg-[#d85036] active:bg-[#c8462f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {savingNama ? 'Menyimpan...' : 'Simpan'}
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold text-gray-800 break-words">{user?.nama || '-'}</p>
                    )}

                    {namaMsg && (
                      <div className={`text-xs font-medium rounded-xl px-3 py-1.5 border ${namaMsg.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'}`}>
                        {namaMsg.text}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Field: NIM (read-only) */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <Hash size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">NIM / ID User</label>
                  <p className="text-sm font-semibold text-gray-800 break-words">{user?.nim || '-'}</p>
                </div>
              </div>

              {/* Field: Jurusan (read-only) */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <BookOpen size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Program Studi</label>
                  <p className="text-sm font-semibold text-gray-800 break-words">{user?.jurusan || '-'}</p>
                </div>
              </div>

              {/* Field: Email (read-only) */}
              <div className="flex items-start gap-4 p-4 rounded-2xl transition-colors hover:bg-gray-50/50 md:col-span-2">
                <div className="w-11 h-11 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-500 shrink-0 shadow-xs">
                  <Mail size={18} />
                </div>
                <div className="space-y-0.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Institusi</label>
                  <p className="text-sm font-semibold text-gray-800 break-all">{user?.email || '-'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Password Manager */}
          <div className="bg-gray-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative shadow-lg shadow-gray-900/10">
            <div className="relative z-10 w-full">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Keamanan Akun</p>
              <h5 className="text-base font-semibold mt-1">Ingin mengubah sandi Anda?</h5>
              <p className="text-xs text-gray-400 mt-0.5">Pastikan untuk menggunakan kombinasi password yang kuat.</p>

              {!isEditingPassword ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditingPassword(true)}
                    className="px-5 py-3 bg-[#EF6145] hover:bg-[#d85036] active:bg-[#c8462f] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <KeyRound size={14} />
                    Ganti Password
                  </button>
                </div>
              ) : (
                <>
                  <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">Email</label>
                        <input
                          value={passwordEmail}
                          onChange={(e) => setPasswordEmail(e.target.value)}
                          type="email"
                          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-[#EF6145]/40"
                          placeholder="email@kampus.ac.id"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">Password Baru</label>
                        <input
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          type="password"
                          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-[#EF6145]/40"
                          placeholder="••••••••"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider">Konfirmasi Password</label>
                        <input
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          type="password"
                          className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold text-white outline-none focus:ring-2 focus:ring-[#EF6145]/40"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    {passwordMsg && (
                      <div className={`mt-3 text-xs font-medium rounded-xl px-3 py-1.5 border ${passwordMsg.type === 'success' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-700 bg-rose-50 border-rose-100'}`}>
                        {passwordMsg.text}
                      </div>
                    )}

                    <div className="mt-4 flex items-center gap-3 justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingPassword(false);
                          setPasswordEmail('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordMsg(null);
                        }}
                        className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors border border-white/20"
                      >
                        Batal
                      </button>
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={savingPassword}
                        className="px-5 py-3 bg-[#EF6145] hover:bg-[#d85036] active:bg-[#c8462f] disabled:opacity-60 disabled:cursor-not-allowed rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                      >
                        <KeyRound size={14} />
                        {savingPassword ? 'Menyimpan...' : 'Simpan Password'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Visual Decoration */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#EF6145] opacity-20 blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* Karya Saya Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <LayoutGrid className="text-[#EF6145]" size={24} />
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Karya Saya</h3>
          </div>
          <button
            onClick={() => handleOpenKaryaModal()}
            className="px-4 py-2 bg-[#EF6145] hover:bg-[#d85036] active:bg-[#c8462f] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} />
            Tambah Karya
          </button>
        </div>

        {loadingKaryas ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#EF6145] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : karyas.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <ImageIcon size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-bold text-gray-400">Belum ada karya yang diunggah.</p>
            <p className="text-xs text-gray-400 mt-1">Mulai bagikan portofolio dan kreativitasmu!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {karyas.map((karya) => (
              <div key={karya._id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img src={karya.gambar} alt={karya.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {karya.kategori}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{karya.judul}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{karya.deskripsi}</p>
                </div>
                {/* Actions overlay */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleOpenKaryaModal(karya)} className="p-2 bg-white text-blue-600 rounded-lg shadow-md hover:bg-blue-50 transition-colors" title="Edit Karya">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDeleteKarya(karya._id)} className="p-2 bg-white text-rose-600 rounded-lg shadow-md hover:bg-rose-50 transition-colors" title="Hapus Karya">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pinjaman Ruangan Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b border-gray-100 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <DoorOpen className="text-[#EF6145]" size={24} />
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Pinjaman Ruangan Saya</h3>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {['Semua', 'Pending', 'Terima', 'Ditolak', 'Selesai'].map(filter => (
              <button
                key={filter}
                onClick={() => setFilterPinjaman(filter)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  filterPinjaman === filter
                    ? 'bg-[#EF6145] text-white shadow-sm'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {filter === 'Terima' ? 'Sedang Dipinjam' : filter}
              </button>
            ))}
          </div>
        </div>

        {loadingPinjamans ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-[#EF6145] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPinjamans.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-sm font-bold text-gray-400">Tidak ada riwayat peminjaman.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPinjamans.map((p) => {
              const ruangName = p.ruang ? (typeof p.ruang === 'string' ? p.ruang : (p.ruang.namaRuang || p.ruang._id || '-')) : '-';
              return (
                <div key={p._id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  {p.status === 'terima' && (
                    <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500 text-white rounded-bl-3xl flex items-center justify-center shadow-sm">
                      <CheckCircle size={18} className="mr-1 mb-1" />
                    </div>
                  )}
                  <h4 className="text-lg font-bold text-gray-900 pr-10">{ruangName}</h4>
                  <p className="text-xs text-gray-500 mt-1">Tanggal: {new Date(p.tanggalPinjam).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ${
                      p.status === 'pending' ? 'bg-amber-100 text-amber-800' : 
                      p.status === 'terima' ? 'bg-emerald-100 text-emerald-800' : 
                      p.status === 'selesai' ? 'bg-blue-100 text-blue-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {p.status === 'terima' ? 'Diterima' : p.status}
                    </span>
                  </div>

                  {p.status === 'terima' && (
                    <div className="mt-5 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleFinishPinjaman(p._id)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Selesaikan Peminjaman
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Add/Edit Karya */}
      {isKaryaModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-extrabold text-gray-900">
                {editingKaryaId ? 'Edit Karya' : 'Tambah Karya Baru'}
              </h3>
              <button onClick={() => setIsKaryaModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveKarya} className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Judul Karya</label>
                <input
                  type="text"
                  required
                  value={draftKarya.judul}
                  onChange={(e) => setDraftKarya({ ...draftKarya, judul: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#EF6145]/30 focus:bg-white transition-all"
                  placeholder="Masukkan judul..."
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Kategori</label>
                <select
                  value={draftKarya.kategori}
                  onChange={(e) => setDraftKarya({ ...draftKarya, kategori: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-[#EF6145]/30 focus:bg-white transition-all"
                >
                  {['sketsa', 'lukisan', 'digital art', 'tugas', 'desain', 'fotografi', 'nirmana', 'project'].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Deskripsi</label>
                <textarea
                  required
                  rows={4}
                  value={draftKarya.deskripsi}
                  onChange={(e) => setDraftKarya({ ...draftKarya, deskripsi: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-[#EF6145]/30 focus:bg-white transition-all resize-none"
                  placeholder="Ceritakan tentang karya ini..."
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Gambar Karya</label>
                <div className="flex items-center gap-4">
                  {karyaPreview && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img src={karyaPreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleKaryaFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#EF6145]/10 file:text-[#EF6145] hover:file:bg-[#EF6145]/20 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400 mt-2 font-medium">Format: JPG, PNG. Max: 5MB.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsKaryaModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingKarya}
                  className="px-6 py-3 rounded-xl bg-[#EF6145] text-white text-sm font-bold hover:bg-[#d85036] active:bg-[#c8462f] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {savingKarya && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {savingKarya ? 'Menyimpan...' : 'Simpan Karya'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}