import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Shree Flow',
  description: 'Admin dashboard for managing products, orders, and analytics',
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </AdminGuard>
  );
}
