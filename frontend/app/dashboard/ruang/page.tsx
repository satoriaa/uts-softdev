import CrudPage from '@/components/CrudPage';

export default function RuangPage() {
  return (
    <CrudPage
      title="Kelola Ruang"
      endpoint="/ruang"
      fields={[
        { name: 'namaRuang', label: 'Nama/Nomor Ruang', required: true },
        { name: 'lantai', label: 'Lantai', required: true },
        { name: 'status', label: 'Status (pending/tersedia/tidak_tersedia)', required: true },
      ]}
    />
  );
}

