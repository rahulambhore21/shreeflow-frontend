import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import OrderDetailsComponent from '@/components/admin/OrderDetails';
import { use } from 'react';

export const metadata: Metadata = {
  title: 'Order Details - Shree Flow Admin',
  description: 'View order details and manage order status',
};

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const resolvedParams = use(params);
  
  return (
    <AdminGuard>
      <AdminLayout>
        <OrderDetailsComponent orderId={resolvedParams.id} />
      </AdminLayout>
    </AdminGuard>
  );
}
