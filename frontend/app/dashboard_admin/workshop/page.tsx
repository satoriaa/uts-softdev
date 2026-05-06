import CrudPage from '@/components/CrudPage';

export default function WorkshopPage() {
  return (
    <CrudPage
      title="Kelola Workshop"
      endpoint="/workshop"
      fields={[
        { name: 'nama', label: 'Nama Workshop', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'tanggal', label: 'Tanggal Workshop', type: 'date', required: true },
        { name: 'tempat', label: 'Tempat', required: true },
        { name: 'gambar', label: 'Poster Workshop (upload)', type: 'file', required: true },
      ]}
    />
  );
}

