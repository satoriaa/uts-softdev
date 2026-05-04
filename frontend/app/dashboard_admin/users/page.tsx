import CrudPage from '@/components/CrudPage';

export default function UsersPage() {
  return (
    <CrudPage
      title="Kelola User"
      endpoint="/users"
      fields={[
        { name: 'nama', label: 'Nama', required: true },
        { name: 'nim', label: 'NIM', required: true },
        { name: 'jurusan', label: 'Jurusan', required: true },
        { name: 'email', label: 'Email', required: true },
        { name: 'password', label: 'Password', type: 'password', required: true },
        { name: 'role', label: 'Role', type: 'select', options: ['student', 'admin'] },
      ]}
    />
  );
}
