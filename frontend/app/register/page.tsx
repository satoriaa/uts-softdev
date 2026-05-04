'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({ nama: '', nim: '', jurusan: '', email: '', password: '', role: 'student' });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      alert('Register berhasil! Silakan login.');
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        {['nama', 'nim', 'jurusan', 'email', 'password'].map((field) => (
          <input
            key={field}
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            className="w-full p-2 border rounded mb-4"
            value={(form as any)[field]}
            onChange={handleChange}
            required
          />
        ))}
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded mb-4">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Sudah punya akun? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
}

