import CrudPage from '@/components/CrudPage';

export default function EventPage() {
  return (
    <CrudPage
      title="Kelola Event"
      endpoint="/event"
      fields={[
        { name: 'judul', label: 'Judul Event', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'ketentuan', label: 'Ketentuan', type: 'textarea', required: true },
        { name: 'lokasi', label: 'Lokasi', required: true },
        { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { name: 'pembicara', label: 'ID Pembicara (User)', required: true },
      ]}
    />
  );
}

