import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ShiprocketIntegration from '@/components/admin/ShiprocketIntegration';

export const metadata: Metadata = {
  title: 'Shiprocket Integration - Shree Flow Admin',
  description: 'Manage Shiprocket shipments and track deliveries',
};

export default function ShiprocketIntegrationPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ShiprocketIntegration />
      </AdminLayout>
    </AdminGuard>
  );
}