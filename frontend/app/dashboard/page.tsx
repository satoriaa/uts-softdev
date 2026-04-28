'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';

export default function DashboardHome() {
  const [stats, setStats] = useState({ users: 0, karya: 0, ruang: 0, event: 0, proker: 0, lomba: 0, tenant: 0, workshop: 0, majalah: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, karya, ruang, event, proker, lomba, tenant, workshop, majalah] = await Promise.all([
          api.get('/users').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/karya').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/ruang').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/event').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/proker').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/lomba').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/tenant').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/workshop').then(r => r.data.data?.length || 0).catch(() => 0),
          api.get('/majalah').then(r => r.data.data?.length || 0).catch(() => 0),
        ]);
        setStats({ users, karya, ruang, event, proker, lomba, tenant, workshop, majalah });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Users', value: stats.users, color: 'bg-blue-500' },
    { label: 'Karya', value: stats.karya, color: 'bg-purple-500' },
    { label: 'Ruang', value: stats.ruang, color: 'bg-green-500' },
    { label: 'Event', value: stats.event, color: 'bg-yellow-500' },
    { label: 'Proker', value: stats.proker, color: 'bg-pink-500' },
    { label: 'Lomba', value: stats.lomba, color: 'bg-red-500' },
    { label: 'Tenant', value: stats.tenant, color: 'bg-indigo-500' },
    { label: 'Workshop', value: stats.workshop, color: 'bg-teal-500' },
    { label: 'Majalah', value: stats.majalah, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className={`${card.color} text-white p-6 rounded-lg shadow`}>
            <h3 className="text-lg font-semibold">{card.label}</h3>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

