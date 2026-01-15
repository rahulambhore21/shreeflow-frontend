"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { useParams } from 'next/navigation';
import ArticleDetail from '@/components/articles/ArticleDetail';
import { articleService, Article } from '@/lib/services/articleService';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ArticlePageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Client-side fetching article with slug:', slug);
        const articleData = await articleService.getArticleBySlug(slug);
        
        console.log('Article data received:', articleData);
        
        // Only show published articles to regular users
        if (articleData.status !== 'published') {
          console.log('Article is not published:', articleData.status);
          notFound();
          return;
        }
        
        setArticle(articleData);
      } catch (error: any) {
        console.error('Error fetching article:', error);
        setError(error.message || 'Failed to load article');
        
        // If it's a 404, redirect to not found
        if (error.response?.status === 404) {
          notFound();
        }
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Article</h3>
                <p className="text-gray-600">Please wait while we fetch your content...</p>
                <div className="mt-6 flex justify-center">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-2 w-20 bg-blue-200 rounded"></div>
                    <div className="h-2 w-16 bg-blue-300 rounded"></div>
                    <div className="h-2 w-24 bg-blue-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h2>
                <p className="text-red-600 mb-2 font-medium">Error loading article</p>
                <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto">{error}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                  <Button asChild variant="outline" className="border-gray-300">
                    <Link href="/articles" className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Articles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <Button asChild variant="ghost" className="text-gray-600 hover:text-blue-600">
              <Link href="/articles" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Articles
              </Link>
            </Button>
          </div>
          <ArticleDetail article={article} />
        </div>
      </div>
    </div>
  );
}