'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Calendar, MapPin, Plus, X } from 'lucide-react'
import api from '@/lib/axios'

type ProkerFromApi = {
  _id: string
  nama?: string
  deskripsi?: string
  tanggal: string | Date
  jam?: string
  tempat?: string
  namaPembicara?: string
  kapasitas?: number
  gambar?: string
  pendaftar?: string[]
  googleFormUrl?: string
}

type ProkerItem = {
  id: string
  title: string
  date: string
  location: string
  image: string
  description: string
  googleFormUrl?: string
  kapasitas?: number
  pendaftarCount?: number
}

type TenantFromApi = {
  _id?: string
  nama: string
  listJualan?: string[]
  proker: string
  gambar?: string
}

type TenantItem = {
  id: string
  nama: string
  listJualan?: string[]
  proker: string
  gambar?: string
}

type MajalahFromApi = {
  _id: string
  nama: string
  deskripsi?: string
  tanggal: string | Date
  gambar?: string
}

type MajalahItem = {
  id: string
  title: string
  date: string
  image: string
  description: string
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop'

const DEFAULT_TENANT_IMAGE =
  'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop'

const DEFAULT_MAJALAH_IMAGE =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop'

function formatTanggal(value: string | Date) {
  const d = typeof value === 'string' ? new Date(value) : value
  if (Number.isNaN(d.getTime())) return String(value)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function mapProkerToItem(p: ProkerFromApi): ProkerItem {
  return {
    id: p._id,
    title: p.nama || 'Proker',
    date: formatTanggal(p.tanggal),
    location: p.tempat || 'Lokasi',
    image: p.gambar || DEFAULT_IMAGE,
    description: p.deskripsi || 'Tidak ada deskripsi untuk kegiatan ini.',
    googleFormUrl: (p as any).googleFormUrl,
    kapasitas: (p as any).kapasitas,
    pendaftarCount: Array.isArray((p as any).pendaftar) ? (p as any).pendaftar.length : undefined,
  }
}

function mapMajalahToItem(m: MajalahFromApi): MajalahItem {
  return {
    id: m._id,
    title: m.nama || 'Majalah',
    date: formatTanggal(m.tanggal),
    image: m.gambar || DEFAULT_MAJALAH_IMAGE,
    description: m.deskripsi || 'Tidak ada deskripsi untuk edisi ini.',
  }
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
      <Plus size={24} className="text-gray-400 mb-2" />
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function ProkerCard({
  item,
  onOpenDetail,
}: {
  item: ProkerItem
  onOpenDetail: (item: ProkerItem) => void
}) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]">
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
            Proker
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 min-h-[2.5rem] line-clamp-2">{item.title}</h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <Calendar size={15} className="text-[#EF6145]/60 flex-shrink-0" />
            <span>{item.date}</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <MapPin size={15} className="text-[#EF6145]/60 flex-shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <button
          onClick={() => onOpenDetail(item)}
          className="w-full py-3 bg-white text-gray-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-200 hover:bg-[#EF6145] hover:border-[#EF6145] hover:text-white transition-colors"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  )
}

function DetailModal({
  item,
  onClose,
  onRegister,
  registering,
  registerDisabled,
}: {
  item: ProkerItem
  onClose: () => void
  onRegister: () => void
  registering: boolean
  registerDisabled: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 hover:bg-white rounded-full shadow"
          aria-label="Close"
        >
          <X size={18} className="text-gray-700" />
        </button>

        <div className="relative h-64 bg-gray-200 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-block px-3 py-1 bg-[#EF6145] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg mb-3">
              Proker
            </span>
            <h3 className="text-white text-xl font-black leading-tight drop-shadow-md">{item.title}</h3>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 text-sm font-semibold">
              <Calendar size={16} className="text-[#EF6145]" />
              {item.date}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 text-sm font-semibold">
              <MapPin size={16} className="text-[#EF6145]" />
              {item.location}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Deskripsi Proker</h4>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4 mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Kuota</p>
              <p className="text-xs font-bold text-gray-700">{typeof item.kapasitas === 'number' ? `${item.pendaftarCount ?? 0}/${item.kapasitas}` : '—'}</p>
            </div>
            <button
              onClick={onRegister}
              disabled={registerDisabled || !item.googleFormUrl}
              className="w-full py-4 bg-[#EF6145] text-white font-black rounded-2xl flex items-center justify-center gap-2 border border-[#EF6145] hover:opacity-95 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {registering ? 'Mendaftarkan...' : registerDisabled ? 'Pendaftaran Ditutup' : 'Register'}
            </button>
            {!item.googleFormUrl && (
              <p className="mt-2 text-xs text-rose-500 font-semibold">Google Form URL belum diatur.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function TenantCard({ tenant }: { tenant: TenantItem }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]">
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        <img
          src={tenant.gambar || DEFAULT_TENANT_IMAGE}
          alt={tenant.nama}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
            Tenant
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 min-h-[2.5rem] line-clamp-2">{tenant.nama}</h3>
        <div className="flex items-center text-gray-500 text-sm gap-2 mb-4">
          <span className="text-gray-400">Proker:</span>
          <span className="font-semibold text-gray-700 truncate">{tenant.proker}</span>
        </div>

        {Array.isArray(tenant.listJualan) && tenant.listJualan.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Katalog</p>
            <div className="flex flex-wrap gap-2">
              {tenant.listJualan.slice(0, 6).map((t, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-gray-600 text-xs font-semibold">
                  {t}
                </span>
              ))}
              {tenant.listJualan.length > 6 && (
                <span className="text-xs font-bold text-gray-400">+{tenant.listJualan.length - 6}</span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Belum ada katalog.</p>
        )}
      </div>
    </div>
  )
}

function TenantEmptyState({ label }: { label: string }) {
  return (
    <div className="border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center justify-center p-12 text-center opacity-60">
      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
  )
}

function MajalahCard({ item, onOpenDetail }: { item: MajalahItem; onOpenDetail: (item: MajalahItem) => void }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]">
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-[#EF6145] text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
            Majalah
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-4 min-h-[2.5rem] line-clamp-2">{item.title}</h3>

        <div className="space-y-2 mb-6">
          <div className="flex items-center text-gray-500 text-sm gap-2">
            <Calendar size={15} className="text-[#EF6145]/60 flex-shrink-0" />
            <span>{item.date}</span>
          </div>
        </div>

        <button
          onClick={() => onOpenDetail(item)}
          className="w-full py-3 bg-white text-gray-800 font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-200 hover:bg-[#EF6145] hover:border-[#EF6145] hover:text-white transition-colors"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  )
}

function MajalahDetailModal({ item, onClose }: { item: MajalahItem; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 hover:bg-white rounded-full shadow"
          aria-label="Close"
        >
          <X size={18} className="text-gray-700" />
        </button>

        <div className="relative h-72 bg-gray-200 overflow-hidden">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 right-6">
            <span className="inline-block px-3 py-1 bg-[#EF6145] text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg mb-3">
              Majalah
            </span>
            <h3 className="text-white text-xl font-black leading-tight drop-shadow-md">{item.title}</h3>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-700 text-sm font-semibold">
              <Calendar size={16} className="text-[#EF6145]" />
              {item.date}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Deskripsi</h4>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
          </div>

          <div>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 border border-gray-900 hover:bg-gray-800 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProkerPage() {
  const [items, setItems] = useState<ProkerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedItem, setSelectedItem] = useState<ProkerItem | null>(null)
  const [registering, setRegistering] = useState(false)

  const [tenants, setTenants] = useState<TenantItem[]>([])
  const [tenantsLoading, setTenantsLoading] = useState(false)
  const [tenantsError, setTenantsError] = useState<string | null>(null)
  const [selectedProkerNama, setSelectedProkerNama] = useState<string>('')

  const [magazines, setMagazines] = useState<MajalahItem[]>([])
  const [magazinesLoading, setMagazinesLoading] = useState(false)
  const [magazinesError, setMagazinesError] = useState<string | null>(null)
  const [selectedMagazine, setSelectedMagazine] = useState<MajalahItem | null>(null)

  useEffect(() => {
    let mounted = true

    async function fetchProker() {
      try {
        setLoading(true)
        setError(null)

        const res = await api.get('/proker')
        const data = (res.data?.data || res.data?.data || res.data || []) as ProkerFromApi[]

        const mapped = (Array.isArray(data) ? data : []).map(mapProkerToItem)

        if (mounted) setItems(mapped)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || err.message || 'Gagal mengambil data proker')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchProker()
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function fetchTenants() {
      try {
        setTenantsLoading(true)
        setTenantsError(null)

        const params = selectedProkerNama ? { prokerNama: selectedProkerNama } : {}
        const res = await api.get('/tenant/by-proker', { params })
        const data = (res.data?.data || res.data?.data || res.data || []) as TenantFromApi[]

        const mapped: TenantItem[] = (Array.isArray(data) ? data : []).map((t) => ({
          id: String((t as any)._id ?? ''),
          nama: t.nama,
          listJualan: t.listJualan ?? [],
          proker: t.proker,
          gambar: t.gambar,
        }))

        if (mounted) setTenants(mapped)
      } catch (err: any) {
        if (!mounted) return
        setTenantsError(err?.response?.data?.message || err.message || 'Gagal mengambil data tenant')
      } finally {
        if (mounted) setTenantsLoading(false)
      }
    }

    ;(async () => {
      if (!selectedProkerNama) {
        try {
          setTenantsLoading(true)
          setTenantsError(null)
          const res = await api.get('/tenant')
          const data = (res.data?.data || res.data?.data || res.data || []) as TenantFromApi[]
          const mapped: TenantItem[] = (Array.isArray(data) ? data : []).map((t) => ({
            id: String((t as any)._id ?? ''),
            nama: t.nama,
            listJualan: t.listJualan ?? [],
            proker: t.proker,
            gambar: t.gambar,
          }))
          if (mounted) setTenants(mapped)
        } catch (err: any) {
          if (!mounted) return
          setTenantsError(err?.response?.data?.message || err.message || 'Gagal mengambil data tenant')
        } finally {
          if (mounted) setTenantsLoading(false)
        }
        return
      }

      await fetchTenants()
    })()

    return () => {
      mounted = false
    }
  }, [selectedProkerNama])

  useEffect(() => {
    let mounted = true

    async function fetchMagazines() {
      try {
        setMagazinesLoading(true)
        setMagazinesError(null)
        const res = await api.get('/majalah')
        const data = (res.data?.data || res.data?.data || res.data || []) as MajalahFromApi[]
        const mapped = (Array.isArray(data) ? data : []).map(mapMajalahToItem)
        if (mounted) setMagazines(mapped)
      } catch (err: any) {
        if (!mounted) return
        setMagazinesError(err?.response?.data?.message || err.message || 'Gagal mengambil data majalah')
      } finally {
        if (mounted) setMagazinesLoading(false)
      }
    }

    fetchMagazines()
    return () => {
      mounted = false
    }
  }, [])

  const prokerOptions = useMemo(() => {
    const uniq = new Set<string>()
    for (const p of items) uniq.add(p.title)
    return Array.from(uniq)
  }, [items])

  async function handleRegister() {
    if (!selectedItem) return
    if (!selectedItem.googleFormUrl) return

    try {
      setRegistering(true)
      await api.post(`/proker/${selectedItem.id}/daftar`)

      const res = await api.get('/proker')
      const data = res.data?.data || []
      const mapped = (Array.isArray(data) ? data : []).map(mapProkerToItem)
      setItems(mapped)

      setSelectedItem((prev) => (prev ? { ...prev, pendaftarCount: (prev.pendaftarCount ?? 0) + 1 } : prev))
      
      // Open Google Form
      window.open(selectedItem.googleFormUrl, '_blank', 'noopener,noreferrer')
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Gagal mendaftar proker'
      alert(msg)
    } finally {
      setRegistering(false)
    }
  }

  const registerDisabled = useMemo(() => {
    if (!selectedItem) return true
    const kapasitas = selectedItem.kapasitas ?? 0
    const filled = selectedItem.pendaftarCount ?? 0
    return registering || (!!selectedItem.googleFormUrl === false) || (kapasitas > 0 ? filled >= kapasitas : false)
  }, [selectedItem, registering])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="flex gap-1.5 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-[#EF6145]"
              style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
            />
          ))}
        </div>
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-8px)} }`}</style>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat Proker…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-red-700 font-bold max-w-md mx-auto shadow-sm">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase italic">Program Kerja</h2>
        <div
          className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"
          style={{ boxShadow: '0 2px 10px rgba(239,97,69,0.4)' }}
        />
        <p className="text-gray-500 mt-4 font-medium">Lihat proker dan daftarkan diri Anda.</p>
      </div>

      {items.length === 0 ? (
        <EmptyState label="Belum Ada Proker Apapun" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ProkerCard key={item.id} item={item} onOpenDetail={setSelectedItem} />
          ))}
        </div>
      )}

      {/* Tenants Section */}
      <div className="mt-14">
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Tenant</h2>
            <div
              className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"
              style={{ boxShadow: '0 2px 10px rgba(239,97,69,0.4)' }}
            />
            <p className="text-gray-500 mt-3 font-medium">Lihat tenant berdasarkan Program Kerja.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter Proker</label>
            <select
              value={selectedProkerNama}
              onChange={(e) => setSelectedProkerNama(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-gray-200 bg-white text-gray-800 font-semibold outline-none focus:ring-2 focus:ring-[#EF6145]/30"
            >
              <option value="">Semua Proker</option>
              {prokerOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tenantsLoading ? (
          <div className="py-10 text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat tenant…</span>
          </div>
        ) : tenantsError ? (
          <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-red-700 font-bold max-w-md shadow-sm">{tenantsError}</div>
        ) : tenants.length === 0 ? (
          <TenantEmptyState
            label={selectedProkerNama ? 'Tidak ada tenant untuk proker ini.' : 'Belum ada tenant.'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <TenantCard key={tenant.id || tenant.nama} tenant={tenant} />
            ))}
          </div>
        )}
      </div>

      {/* Magazine Section */}
      <div className="mt-14">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase italic">Majalah</h2>
          <div
            className="h-1.5 w-20 bg-[#EF6145] mt-2 rounded-full"
            style={{ boxShadow: '0 2px 10px rgba(239,97,69,0.4)' }}
          />
          <p className="text-gray-500 mt-3 font-medium">Arsip edisi majalah kreatif FSRD UNTAR.</p>
        </div>

        {magazinesLoading ? (
          <div className="py-10 text-center">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat majalah…</span>
          </div>
        ) : magazinesError ? (
          <div className="border border-red-200 bg-red-50 rounded-[2rem] p-6 text-red-700 font-bold max-w-md shadow-sm">{magazinesError}</div>
        ) : magazines.length === 0 ? (
          <EmptyState label="Belum Ada Majalah Apapun" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magazines.map((m) => (
              <MajalahCard key={m.id} item={m} onOpenDetail={setSelectedMagazine} />
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <DetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onRegister={handleRegister}
          registering={registering}
          registerDisabled={registerDisabled}
        />
      )}

      {selectedMagazine && (
        <MajalahDetailModal item={selectedMagazine} onClose={() => setSelectedMagazine(null)} />
      )}
    </div>
  )
}