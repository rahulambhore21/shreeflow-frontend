import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Create Product - Shree Flow Admin',
  description: 'Add a new product to your catalog',
};

export default function CreateProductPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductForm mode="create" />
      </AdminLayout>
    </AdminGuard>
  );
}