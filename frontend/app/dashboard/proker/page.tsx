import CrudPage from '@/components/CrudPage';

export default function ProkerPage() {
  return (
    <CrudPage
      title="Kelola Proker"
      endpoint="/proker"
      fields={[
        { name: 'nama', label: 'Nama Proker', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { name: 'tempat', label: 'Tempat', required: true },
      ]}
    />
  );
}

