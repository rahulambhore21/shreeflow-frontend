import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import OrdersPage from '@/components/admin/OrdersPage';

export const metadata: Metadata = {
  title: 'Orders Management - Shree Flow Admin',
  description: 'Manage customer orders and track shipments',
};

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <OrdersPage />
      </AdminLayout>
    </AdminGuard>
  );
}
