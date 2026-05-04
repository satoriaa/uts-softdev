import CrudPage from '@/components/CrudPage';

export default function KaryaPage() {
  return (
    <CrudPage
      title="Kelola Karya"
      endpoint="/karya"
      fields={[
        { name: 'judul', label: 'Judul Karya', required: true },
        { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
        { name: 'username', label: 'Username Pembuat', required: true },
        { name: 'nim', label: 'NIM Pembuat', required: true },
      ]}
    />
  );
}

