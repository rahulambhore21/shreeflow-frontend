import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ProductForm from '@/components/admin/ProductForm';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Edit Product - Shree Flow Admin',
  description: 'Edit product details',
};

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const resolvedParams = use(params);
  
  return (
    <AdminGuard>
      <AdminLayout>
        <ProductForm mode="edit" productId={resolvedParams.id} />
      </AdminLayout>
    </AdminGuard>
  );
}