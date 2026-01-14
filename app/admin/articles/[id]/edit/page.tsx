import { Metadata } from 'next';
import { use } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import ArticleForm from '@/components/admin/ArticleForm';

export const metadata: Metadata = {
  title: 'Edit Article - Shree Flow Admin',
  description: 'Edit article content',
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const resolvedParams = use(params);
  
  return (
    <AdminGuard>
      <AdminLayout>
        <ArticleForm mode="edit" articleId={resolvedParams.id} />
      </AdminLayout>
    </AdminGuard>
  );
}
