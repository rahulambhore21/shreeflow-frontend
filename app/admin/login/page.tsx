import { Metadata } from 'next';
import AdminLogin from '@/components/admin/AdminLogin';

export const metadata: Metadata = {
  title: 'Admin Login - Shree Flow',
  description: 'Admin login for Shree Flow dashboard',
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}