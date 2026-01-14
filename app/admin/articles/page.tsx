import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticlesPage from '@/components/admin/ArticlesPage';

export const metadata: Metadata = {
  title: 'Articles Management - Shree Flow Admin',
  description: 'Manage articles, blogs, and content',
};

export default function AdminArticlesPage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ArticlesPage />
      </AdminLayout>
    </AdminGuard>
  );
}