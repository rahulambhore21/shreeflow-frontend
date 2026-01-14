import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import AnalyticsPage from '@/components/admin/AnalyticsPage';

export const metadata: Metadata = {
  title: 'Analytics - Shree Flow Admin',
  description: 'View detailed analytics and reports',
};

export default function AdminAnalyticsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <AnalyticsPage />
      </AdminLayout>
    </AdminGuard>
  );
}