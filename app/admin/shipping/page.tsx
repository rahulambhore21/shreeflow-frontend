import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import UnifiedShippingPage from '@/components/admin/UnifiedShippingPage';

export const metadata: Metadata = {
  title: 'Shipping Management - Shree Flow Admin',
  description: 'Configure Shiprocket integration and manage pickup locations',
};

export default function AdminShippingPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <UnifiedShippingPage />
      </AdminLayout>
    </AdminGuard>
  );
}