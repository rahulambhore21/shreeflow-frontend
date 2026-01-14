import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductsPage from '@/components/admin/ProductsPage';

export const metadata: Metadata = {
  title: 'Products - Admin Dashboard',
  description: 'Manage products in the admin dashboard',
};

export default function AdminProductsPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductsPage />
      </AdminLayout>
    </AdminGuard>
  );
}