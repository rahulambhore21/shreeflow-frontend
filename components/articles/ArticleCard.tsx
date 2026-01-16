"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Eye, Heart, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/services/articleService';

interface ArticleCardProps {
  article: Article;
  compact?: boolean;
}

export default function ArticleCard({ article, compact = false }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white">
        <div className="flex h-24 sm:h-28">
          <div className="relative w-24 sm:w-28 flex-shrink-0 overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </div>
          <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
            <div className="space-y-1.5 sm:space-y-2">
              <h4 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors break-words">
                <Link 
                  href={`/articles/${article.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {article.title}
                </Link>
              </h4>
              <div className="flex items-center text-[10px] sm:text-xs text-gray-500 space-x-2 sm:space-x-3 flex-wrap">
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span className="hidden sm:inline truncate">{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center space-x-1 whitespace-nowrap">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                  <span>{article.readingTime}m</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] sm:text-xs bg-blue-50 border-blue-200 text-blue-700 px-1.5 sm:px-2 py-0.5 truncate max-w-[100px]" title={article.categories[0] || 'General'}>
                {article.categories[0] || 'General'}
              </Badge>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-gray-400">
                <div className="flex items-center space-x-0.5 sm:space-x-1">
                  <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>{article.views}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white via-white to-gray-50/50 hover:scale-[1.02] transform">
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        <Image
          src={article.featuredImage}
          alt={article.title}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10">
          <Badge 
            variant="secondary" 
            className="bg-white/95 backdrop-blur-sm text-gray-800 font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm shadow-lg border-0"
          >
            {article.categories[0] || 'General'}
          </Badge>
        </div>

        {/* Stats overlay */}
        <div className="absolute top-3 sm:top-4 right-3 sm:right-4 flex items-center space-x-2">
          <div className="bg-black/20 backdrop-blur-sm text-white text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full flex items-center space-x-0.5 sm:space-x-1">
            <Eye className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{article.views.toLocaleString()}</span>
          </div>
        </div>

        {/* Reading time overlay */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
          <div className="bg-white/95 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-medium shadow-lg flex items-center space-x-0.5 sm:space-x-1">
            <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            <span>{article.readingTime} min</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-5 md:p-6">
        <div className="space-y-3 sm:space-y-4">
          {/* Date and Author */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 gap-2">
            <div className="flex items-center space-x-1 min-w-0 flex-shrink overflow-hidden">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="hidden sm:inline truncate">{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="font-medium text-xs sm:text-sm truncate max-w-[100px]" title={article.author.username}>{article.author.username}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base sm:text-lg md:text-xl line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors duration-300 break-words">
            <Link href={`/articles/${article.slug}`} className="hover:text-blue-600">
              {article.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm sm:text-base line-clamp-3 leading-relaxed break-words">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {article.tags.slice(0, 3).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="text-[10px] sm:text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors px-1.5 sm:px-2 py-0.5 truncate max-w-[120px]"
                  title={`#${tag}`}
                >
                  #{tag}
                </Badge>
              ))}
              {article.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] sm:text-xs text-gray-500 px-1.5 sm:px-2 py-0.5">
                  +{article.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Bottom section */}
          <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{article.likes}</span>
              </div>
            </div>

            <Link 
              href={`/articles/${article.slug}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm group-hover:translate-x-1 transition-all duration-300"
            >
              <span className="hidden sm:inline">Read more</span>
              <span className="sm:hidden">Read</span> →
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}