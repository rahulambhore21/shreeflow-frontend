"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/lib/services/articleService';
import ArticleCard from './ArticleCard';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';

interface FeaturedArticlesProps {
  limit?: number;
  showTitle?: boolean;
  compact?: boolean;
}

export default function FeaturedArticles({ 
  limit = 3, 
  showTitle = true, 
  compact = false 
}: FeaturedArticlesProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeaturedArticles();
  }, [limit]);

  const fetchFeaturedArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getAllArticles({
        limit,
        status: 'published',
      });
      
      setArticles(response.data);
    } catch (error) {
      console.error('Failed to fetch featured articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {showTitle && (
          <div className="text-center px-4">
            <div className="h-6 md:h-8 bg-gray-300 rounded w-48 md:w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-3 md:h-4 bg-gray-300 rounded w-64 md:w-96 mx-auto animate-pulse"></div>
          </div>
        )}
        <div className={`grid gap-4 md:gap-6 ${compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {[...Array(limit)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-40 md:h-48 rounded-t-lg mb-4"></div>
              <div className="space-y-2 p-4 md:p-6">
                <div className="h-3 md:h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 md:h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-2 md:h-3 bg-gray-300 rounded"></div>
                <div className="h-2 md:h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6 md:space-y-8 px-4 md:px-0">
      {showTitle && (
        <div className="text-center space-y-3 md:space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600 flex-shrink-0" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 break-words">
              Latest Articles & Insights
            </h2>
          </div>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 break-words">
            Stay updated with our latest insights on water purification, 
            health tips, and sustainable living practices.
          </p>
        </div>
      )}

      <div className={`grid gap-4 md:gap-6 ${
        compact 
          ? 'grid-cols-1' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {articles.map((article) => (
          <ArticleCard 
            key={article._id} 
            article={article} 
            compact={compact}
          />
        ))}
      </div>

      {showTitle && (
        <div className="text-center pt-4">
          <Link href="/articles">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}