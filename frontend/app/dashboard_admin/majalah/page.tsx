import CrudPage from '@/components/CrudPage';

export default function MajalahPage() {
  return (
    <CrudPage
      title="Kelola Majalah"
      endpoint="/majalah"
      fields={[
        { name: 'nama', label: 'Nama Majalah', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
        { name: 'harga', label: 'Harga', type: 'number', required: true },
        { name: 'gambar', label: 'Cover Majalah (upload)', type: 'file', required: true },
      ]}
    />
  );
}

