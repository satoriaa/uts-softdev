'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell } from 'lucide-react'
import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
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

let socket: ReturnType<typeof io> | null = null

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
                // backend stores acknowledgement in `notified` - treat as `read` in UI
                read: !!p.notified,
            }))
            // show only unread/active notifications in dropdown (remove already acknowledged)
            setNotifs(items.filter(i => !i.read).reverse())
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
    // ensure we carry read state from payload.notified -> read
    const item = { ...payload, read: !!(payload as any).notified };
    // if server says this notification is already acknowledged, remove it from UI instead of re-adding
    if ((payload as any).notified) {
        setNotifs((s) => s.filter(n => n.id !== payload.id))
        return
    }
    if (user?.role === 'admin') {
        setNotifs((s) => [item, ...s])
    } else if (payload && payload.user && String(payload.user) === String(user?._id || (user as any)?.id)) {
        setNotifs((s) => [item, ...s])
    }
    })

        socket.on('pinjaman:updated', (payload: Notif) => {
    if (!mounted.current) return
      // always push updates (admin and user) if relevant
    if (user?.role === 'admin') {
                // if update indicates it's acknowledged, remove it; otherwise add/update
                if ((payload as any).notified) {
                    setNotifs((s) => s.filter(n => n.id !== payload.id))
                } else {
                    setNotifs((s) => [{ ...payload, read: !!(payload as any).notified }, ...s.filter(n => n.id !== payload.id)])
                }
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
                        // respect server-side notified flag if present
                        read: !!(payload as any).notified,
          // add message to show in UI (rendered when present)
            message: `Permintaan pinjaman untuk ${ruangLabel} pada ${dateLabel} telah ${msgStatus}`,
        } as any;

        // if server indicates this updated notification is acknowledged, don't re-add it
        if ((payload as any).notified) {
            setNotifs((s) => s.filter(n => n.id !== payload.id))
        } else {
            setNotifs((s) => [friendly, ...s.filter(n => n.id !== payload.id)])
        }
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
    if (!token) return
    // optimistic update: remove from UI immediately
    const prev = notifs
    setNotifs((s) => s.filter(n => n.id !== id))
    try {
        // use axios instance which already attaches Authorization header via interceptor
        // Hindari mengirim body null agar tidak memicu parsing JSON yang bermasalah di beberapa konfigurasi
        const res = await axios.put(`/pinjaman/${id}/ack`, {})
        // Backend biasanya selalu mengembalikan JSON; kalau ada kasus response kosong, jangan mencoba parse manual


        // if server responded with success:false, treat as failure
        if (res && res.data && res.data.success === false) {
            throw new Error(res.data.message || 'Failed to ack')
        }
    } catch (err: any) {
        // revert on failure and inform developer/user with server message if present
        console.error('Failed to ack notification', err)
        setNotifs(prev)
        const serverMsg = err?.response?.data?.message || err?.message || 'Gagal menandai notifikasi sebagai dibaca. Coba lagi.'
        try { alert(serverMsg); } catch (e) {}
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