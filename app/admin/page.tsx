import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsPage from '@/components/admin/AnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics - Shree Flow',
  description: 'Analytics and insights for managing products, orders, and business performance',
};

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AnalyticsPage />
      </AdminLayout>
    </AdminGuard>
  );
}
