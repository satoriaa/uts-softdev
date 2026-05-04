import CrudPage from '@/components/CrudPage';

export default function LombaPage() {
  return (
    <CrudPage
      title="Kelola Lomba"
      endpoint="/lomba"
      fields={[
        { name: 'nama', label: 'Nama Lomba', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'tanggal', label: 'Tanggal Lomba', type: 'date', required: true },
        { name: 'tempat', label: 'Tempat', required: true },
      ]}
    />
  );
}

