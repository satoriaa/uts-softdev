import CrudPage from '@/components/CrudPage';

export default function PinjamanPage() {
  return (
    <CrudPage
      title="Validasi Pinjaman Ruangan"
      endpoint="/pinjaman"
      fields={[
        { name: 'ruang', label: 'ID Ruang', required: true },
        { name: 'user', label: 'ID User', required: true },
        { name: 'tanggalPinjam', label: 'Tanggal Pinjam', type: 'date', required: true },
        { name: 'status', label: 'Status (pending/terima/tolak)', required: true },
      ]}
    />
  );
}

