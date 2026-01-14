import { Metadata } from 'next';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';

export const metadata: Metadata = {
  title: 'Create Article - Shree Flow Admin',
  description: 'Create a new article or blog post',
};

export default function CreateArticlePage() {
  return (
    <AdminGuard>
      <AdminLayout>
        <ArticleForm mode="create" />
      </AdminLayout>
    </AdminGuard>
  );
}
