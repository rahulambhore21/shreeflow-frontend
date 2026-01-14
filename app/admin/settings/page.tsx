import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsPage from '@/components/admin/SettingsPage';

export const metadata: Metadata = {
  title: 'Settings - Shree Flow Admin',
  description: 'Configure application settings and preferences',
};

export default function AdminSettingsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <SettingsPage />
      </AdminLayout>
    </AdminGuard>
  );
}