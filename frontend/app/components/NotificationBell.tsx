'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import io, { Socket } from 'socket.io-client'
import { useAuthStore } from '@/store/authStore'
import axios from '@/lib/axios'

type Notif = {
    id: string
    ruang?: { namaRuang?: string } | string
    user?: string
    userNama?: string
    tanggalPinjam?: string
    status?: 'pending' | 'terima' | 'tolak' | string
    createdAt?: string
    updatedAt?: string
    read?: boolean
    message?: string
}

let socket: Socket | null = null

export default function NotificationBell() {
    const { user, token } = useAuthStore()
    const [open, setOpen] = useState(false)
    const [notifs, setNotifs] = useState<Notif[]>([])
    const mounted = useRef(false)

useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
}, [])

useEffect(() => {
    // load initial notifications (user-specific or all for admin)
    const load = async () => {
        try {
        if (!token) return
        const res = await axios.get('/pinjaman', { headers: { Authorization: `Bearer ${token}` } })
    if (res.data && res.data.data) {
          // map to notifications: show only non-pending or for admin show pending too
            const items = (res.data.data as any[])
            .filter((p: any) => {
                if (user?.role === 'admin') return true
                const uid = user?._id || (user as any)?.id
                return String(p.user) === String(uid)
                })
            .map((p: any) => ({
                id: p._id,
                ruang: p.ruang,
                user: p.user,
                userNama: p.userNama,
                tanggalPinjam: p.tanggalPinjam,
                status: p.status,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt,
            }))
            setNotifs(items.reverse())
        }
    } catch (e) {
        // ignore
        }
    }
    load()
}, [token, user])

useEffect(() => {
    if (!token) return
    if (!socket) {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        socket = io(base.replace(/\/$/, ''), { transports: ['websocket'], auth: { token } })
    }

    socket.on('pinjaman:created', (payload: Notif) => {
      // admins should see new bookings; users only see their own
    if (!mounted.current) return
    if (user?.role === 'admin') {
        setNotifs((s) => [{ ...payload }, ...s])
    } else if (payload && payload.user && String(payload.user) === String(user?._id || (user as any)?.id)) {
        setNotifs((s) => [{ ...payload }, ...s])
    }
    })

    socket.on('pinjaman:updated', (payload: Notif) => {
    if (!mounted.current) return
      // always push updates (admin and user) if relevant
    if (user?.role === 'admin') {
        setNotifs((s) => [{ ...payload }, ...s.filter(n => n.id !== payload.id)])
    } else if (payload.user && String(payload.user) === String(user?._id || (user as any)?.id)) {
        // create a friendly notification message for the user
        const ruangLabel = typeof payload.ruang === 'string' ? payload.ruang : (payload.ruang?.namaRuang || 'Ruangan');
        const dateLabel = payload.tanggalPinjam ? payload.tanggalPinjam.slice(0,10) : '';
        const msgStatus = payload.status === 'terima' ? 'DITERIMA' : payload.status === 'tolak' ? 'DITOLAK' : payload.status;
        const friendly = {
            id: payload.id,
            ruang: payload.ruang,
            user: payload.user,
            userNama: payload.userNama,
            tanggalPinjam: payload.tanggalPinjam,
            status: payload.status,
            createdAt: payload.createdAt,
            updatedAt: payload.updatedAt,
            read: false,
          // add message to show in UI (rendered when present)
            message: `Permintaan pinjaman untuk ${ruangLabel} pada ${dateLabel} telah ${msgStatus}`,
        } as any;

        setNotifs((s) => [friendly, ...s.filter(n => n.id !== payload.id)])
        }
    })

    return () => {
    try {
        socket?.off('pinjaman:created')
        socket?.off('pinjaman:updated')
    } catch (e) {}
    }
}, [token, user])

const markRead = async (id: string) => {
    try {
        if (!token) return
        await axios.put(`/pinjaman/${id}/ack`, null, { headers: { Authorization: `Bearer ${token}` } })
        setNotifs((s) => s.map(n => (n.id === id ? { ...n, read: true } : n)))
    } catch (e) {
      // ignore
    }
}

return (
    <div className="relative">
        <button onClick={() => setOpen(!open)} className="relative p-2 rounded-full hover:bg-gray-100">
        <Bell size={20}/>
        {notifs.some(n => !n.read) && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
        </button>

    {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
        <div className="p-3 border-b font-bold">Notifikasi</div>
        <div className="max-h-64 overflow-y-auto">
            {notifs.length === 0 && (
                <div className="p-4 text-sm text-gray-500">Tidak ada notifikasi</div>
            )}
            {notifs.map((n) => (
            <div key={n.id} className={`p-3 border-b hover:bg-gray-50 ${n.status !== 'pending' ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between gap-2">
                    <div className="text-sm">
                    {n.message ? (
                        <div className="font-medium">{(n as any).message}</div>
                    ) : (
                    <>
                        {n.status === 'pending' && <span className="font-bold">Permintaan pinjaman baru</span>}
                        {n.status === 'terima' && <span className="font-bold text-emerald-600">Pinjaman diterima</span>}
                        {n.status === 'tolak' && <span className="font-bold text-rose-600">Pinjaman ditolak</span>}
                        <div className="text-xs text-gray-500">{n.userNama ? `${n.userNama} • ${n.tanggalPinjam?.slice(0,10)}` : (typeof n.ruang === 'string' ? n.ruang : (n.ruang?.namaRuang || 'Ruangan'))}</div>
                    </>
                    )}
                </div>
                <div className="text-xs">
                    {!n.read && n.status !== 'pending' && (
                        <button onClick={() => markRead(n.id)} className="text-xs text-blue-600">Tandai sudah dibaca</button>
                    )}
                    </div>
                </div>
                </div>
            ))}
        </div>
        </div>
    )}
    </div>
    )
}