"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Article, articleService } from '@/lib/services/articleService';
import { 
  Calendar, 
  Clock, 
  Eye, 
  Heart, 
  User, 
  Share2, 
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ArticleDetailProps {
  article: Article;
}

export default function ArticleDetail({ article: initialArticle }: ArticleDetailProps) {
  const [article, setArticle] = useState<Article>(initialArticle);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // Fetch related articles based on categories/tags
    fetchRelatedArticles();
  }, [article._id]);

  const fetchRelatedArticles = async () => {
    try {
      const response = await articleService.getAllArticles({
        limit: 3,
        status: 'published',
        category: article.categories[0] || undefined,
      });
      
      // Filter out current article
      const related = response.data.filter(a => a._id !== article._id);
      setRelatedArticles(related.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch related articles:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Article link has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
    setShowShareMenu(false);
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-5xl">
        {/* Navigation */}
        <div className="mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group text-sm md:text-base"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Articles</span>
          </Button>
        </div>

        {/* Hero Section */}
        <article className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-6 md:mb-8">
          {/* Featured Image */}
          <div className="relative h-56 sm:h-72 md:h-[400px] lg:h-[500px]">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Category Badge */}
            <div className="absolute top-4 md:top-6 left-4 md:left-6">
              <Badge 
                variant="secondary" 
                className="bg-white/95 text-gray-800 font-medium px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm shadow-lg backdrop-blur-sm"
              >
                {article.categories[0] || 'General'}
              </Badge>
            </div>
          </div>

          {/* Article Header Content */}
          <header className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 md:mb-6 leading-tight break-words overflow-wrap-anywhere">
              {article.title}
            </h1>

            {/* Subtitle/Excerpt */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 leading-relaxed font-light break-words">
              {article.excerpt}
            </p>

            {/* Article Meta & Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 pb-6 md:pb-8 border-b border-gray-200">
              {/* Author & Meta */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 text-gray-600 w-full lg:w-auto overflow-hidden">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm md:text-base truncate">By {article.author.username}</p>
                    <p className="text-xs md:text-sm text-gray-500">Author</p>
                  </div>
                </div>
                
                <div className="h-8 w-px bg-gray-300 hidden sm:block flex-shrink-0"></div>
                
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs md:text-sm">
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{formatDate(article.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 whitespace-nowrap">
                    <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    <span>{article.readingTime} min read</span>
                  </div>
                </div>
              </div>

              {/* Stats & Sharing */}
              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
                {/* Article Stats */}
                <div className="flex items-center space-x-3 md:space-x-4 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-gray-50 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg">
                    <Eye className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="font-medium">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 md:space-x-2 bg-gray-50 px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg">
                    <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="font-medium">{article.likes}</span>
                  </div>
                </div>

                {/* Share Button */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="flex items-center space-x-1.5 md:space-x-2 border-blue-200 text-blue-600 hover:bg-blue-50 text-xs md:text-sm px-3 md:px-4"
                  >
                    <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>

                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 md:w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-10 overflow-hidden">
                      <div className="p-2 space-y-1">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Share Article</p>
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                          <Facebook className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600 flex-shrink-0" />
                          <span className="group-hover:text-blue-600">Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                          <Twitter className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-400 flex-shrink-0" />
                          <span className="group-hover:text-blue-400">Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm hover:bg-blue-50 rounded-lg transition-colors group"
                        >
                          <Linkedin className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-700 flex-shrink-0" />
                          <span className="group-hover:text-blue-700">LinkedIn</span>
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={copyToClipboard}
                          className="w-full flex items-center space-x-3 px-3 md:px-4 py-2.5 md:py-3 text-xs md:text-sm hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <Copy className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-600 flex-shrink-0" />
                          <span className="group-hover:text-gray-900">Copy Link</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="pt-4 md:pt-6">
                <p className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Topics</p>
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {article.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs md:text-sm px-2 md:px-3 py-0.5 md:py-1 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors max-w-[200px] truncate"
                      title={`#${tag}`}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </header>
        </article>

        {/* Article Content */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 mb-8 md:mb-12 overflow-hidden">
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            <div 
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none break-words overflow-wrap-anywhere
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight prose-headings:break-words
                prose-h1:text-2xl sm:prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-4 md:prose-h1:mb-6 prose-h1:mt-6 md:prose-h1:mt-8
                prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-3 md:prose-h2:mb-4 prose-h2:mt-6 md:prose-h2:mt-8 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
                prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-2 md:prose-h3:mb-3 prose-h3:mt-4 md:prose-h3:mt-6
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 md:prose-p:mb-6 prose-p:break-words
                prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-blue-700 prose-a:break-words
                prose-strong:text-gray-900 prose-strong:font-semibold prose-strong:break-words
                prose-em:text-gray-600 prose-em:italic
                prose-ul:my-4 md:prose-ul:my-6 prose-ol:my-4 md:prose-ol:my-6
                prose-li:my-1 md:prose-li:my-2 prose-li:text-gray-700 prose-li:break-words
                prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50/50 
                prose-blockquote:py-3 md:prose-blockquote:py-4 prose-blockquote:px-4 md:prose-blockquote:px-6 prose-blockquote:my-4 md:prose-blockquote:my-6 prose-blockquote:italic
                prose-blockquote:text-gray-600 prose-blockquote:rounded-r-lg prose-blockquote:break-words
                prose-code:text-blue-600 prose-code:bg-gray-100 prose-code:px-1.5 md:prose-code:px-2 prose-code:py-0.5 md:prose-code:py-1 prose-code:rounded-md prose-code:text-xs md:prose-code:text-sm prose-code:break-all
                prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg md:prose-pre:rounded-xl prose-pre:p-4 md:prose-pre:p-6 prose-pre:overflow-x-auto
                prose-img:rounded-lg md:prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4 md:prose-img:my-8 prose-img:max-w-full prose-img:h-auto
                prose-hr:border-gray-300 prose-hr:my-6 md:prose-hr:my-8
                prose-table:text-xs sm:prose-table:text-sm prose-table:my-4 md:prose-table:my-6 prose-table:overflow-x-auto prose-table:block prose-table:w-full
                prose-thead:bg-gray-50 prose-th:py-2 md:prose-th:py-3 prose-th:px-3 md:prose-th:px-4 prose-th:font-semibold prose-th:break-words
                prose-td:py-2 md:prose-td:py-3 prose-td:px-3 md:prose-td:px-4 prose-td:border-gray-200 prose-td:break-words"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8 lg:p-12">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 md:mb-4">Continue Reading</h2>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
                Discover more insights and articles that might interest you
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Card 
                  key={relatedArticle._id} 
                  className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <Image
                      src={relatedArticle.featuredImage}
                      alt={relatedArticle.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                  
                  <CardContent className="p-4 md:p-6">
                    <h3 className="font-bold text-base md:text-lg line-clamp-2 mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                      <Link 
                        href={`/articles/${relatedArticle.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-xs md:text-sm line-clamp-3 mb-3 md:mb-4 leading-relaxed">
                      {relatedArticle.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-3 md:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span className="hidden sm:inline">{formatDate(relatedArticle.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{relatedArticle.readingTime} min</span>
                        </div>
                      </div>
                      
                      <Link 
                        href={`/articles/${relatedArticle.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-xs md:text-sm"
                      >
                        Read →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
      
      {/* Scroll to top button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 hover:bg-blue-700 text-white p-2.5 md:p-3 rounded-full shadow-lg transition-colors z-50 hover:scale-110 transform duration-200"
        aria-label="Scroll to top"
      >
        <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 rotate-90" />
      </button>
    </div>
  );
}