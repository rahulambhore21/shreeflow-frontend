"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { articleService, Article } from '@/lib/services/articleService';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import ArticleCard from './ArticleCard';

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { toast } = useToast();

  const itemsPerPage = 9;

  useEffect(() => {
    fetchArticles();
  }, [currentPage, selectedCategory, selectedTag]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await articleService.getAllArticles({
        page: currentPage,
        limit: itemsPerPage,
        status: 'published', // Only show published articles
        category: selectedCategory || undefined,
        tag: selectedTag || undefined,
      });

      setArticles(response.data);
      setTotalPages(response.pagination.totalPages);

      // Extract unique categories and tags for filters
      const allCategories = new Set<string>();
      const allTags = new Set<string>();
      
      response.data.forEach(article => {
        article.categories.forEach(cat => allCategories.add(cat));
        article.tags.forEach(tag => allTags.add(tag));
      });
      
      setCategories(Array.from(allCategories));
      setTags(Array.from(allTags));

    } catch (error) {
      console.error('Failed to fetch articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Loading search section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="animate-pulse space-y-4">
            <div className="flex space-x-2">
              <div className="h-8 bg-gray-200 rounded-full w-20"></div>
              <div className="h-8 bg-gray-200 rounded-full w-24"></div>
              <div className="h-8 bg-gray-200 rounded-full w-16"></div>
            </div>
          </div>
        </div>
        
        {/* Loading articles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden animate-pulse shadow-lg">
              <div className="h-56 bg-gray-200"></div>
              <CardContent className="p-6 space-y-4">
                <div className="flex space-x-2">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Discover Articles</h2>
          <p className="text-gray-600">Explore our collection of insights, tutorials, and stories</p>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">Categories:</span>
            <Badge
              variant={selectedCategory === '' ? 'default' : 'secondary'}
              className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                selectedCategory === '' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </Badge>
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">Tags:</span>
              <Badge
                variant={selectedTag === '' ? 'default' : 'secondary'}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                  selectedTag === '' 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTag('')}
              >
                All
              </Badge>
              {tags.slice(0, 5).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'secondary'}
                  className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-200 ${
                    selectedTag === tag 
                      ? 'bg-green-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setSelectedTag(tag)}
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {(selectedCategory || selectedTag) && (
            <div className="flex justify-center pt-2">
              <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-full px-6">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No articles found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any articles matching your criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={clearFilters} className="rounded-full px-6">
              Clear All Filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Results count */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              Found <span className="font-semibold text-blue-600">{articles.length}</span> article{articles.length !== 1 ? 's' : ''}
              {(selectedCategory || selectedTag) && (
                <span> matching your criteria</span>
              )}
            </p>
          </div>
          
          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
          <div className="flex justify-center items-center space-x-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-full px-6 py-3 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              <span className="text-gray-600 font-medium">
                Page
              </span>
              <span className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold">
                {currentPage}
              </span>
              <span className="text-gray-600 font-medium">
                of {totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full px-6 py-3 border-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}