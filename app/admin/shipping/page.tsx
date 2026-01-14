import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ShippingPage from '@/components/admin/ShippingPage';

export const metadata: Metadata = {
  title: 'Shipping Management - Shree Flow Admin',
  description: 'Manage shipping rates, carriers, and delivery settings',
};

export default function AdminShippingPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ShippingPage />
      </AdminLayout>
    </AdminGuard>
  );
}