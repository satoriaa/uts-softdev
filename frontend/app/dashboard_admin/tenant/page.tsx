import CrudPage from '@/components/CrudPage';

export default function TenantPage() {
  return (
    <CrudPage
      title="Kelola Tenant"
      endpoint="/tenant"
      fields={[
        { name: 'nama', label: 'Nama Tenant', required: true },
        { name: 'listJualan', label: 'List Jualan (pisahkan koma)', required: true },
        { name: 'gambar', label: 'Foto Tenant (upload)', type: 'file', required: true },
      ]}
    />
  );
}

