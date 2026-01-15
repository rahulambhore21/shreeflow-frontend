import { Metadata } from 'next';
import ArticlePageClient from './ArticlePageClient';

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

interface ArticleData {
  title: string;
  seoTitle?: string;
  excerpt?: string;
  seoDescription?: string;
  tags?: string[];
  category?: string;
  status?: string;
  featuredImage?: string;
  publishedAt?: string;
  updatedAt?: string;
  author: {
    username: string;
  };
}

interface ArticleResponse {
  data: ArticleData;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_METADATA = {
  siteName: 'Shree Flow',
  twitterHandle: '@ShreeFlow',
  defaultImage: '/default-article-image.jpg',
  defaultKeywords: 'water purification, sustainable living, health, environment, Shree Flow',
} as const;

const FETCH_CONFIG = {
  revalidate: 3600, // 1 hour
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'ShreeFlow-NextJS/1.0',
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get the API base URL from environment variables
 */
function getApiUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.API_URL ||
    'http://localhost:5000/api/v1'
  );
}

/**
 * Get the base URL for the site
 */
function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://shreeflow.com';
}

/**
 * Convert slug to title case
 */
function slugToTitle(slug: string): string {
  if (!slug) return 'Article';
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Fetch article data from API
 */
async function fetchArticle(slug: string): Promise<ArticleData | null> {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/articles/${slug}`, {
      cache: 'no-store',
      headers: FETCH_CONFIG.headers,
      next: { revalidate: FETCH_CONFIG.revalidate },
    });

    if (!response.ok) {
      console.warn(
        `Article not found: ${slug} (Status: ${response.status})`
      );
      return null;
    }

    const data: ArticleResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching article: ${slug}`, error);
    return null;
  }
}

/**
 * Generate metadata for a specific article
 */
function generateArticleMetadata(
  article: ArticleData,
  slug: string
): Metadata {
  const baseUrl = getBaseUrl();
  const articleUrl = `${baseUrl}/articles/${slug}`;
  const imageUrl =
    article.featuredImage || `${baseUrl}${DEFAULT_METADATA.defaultImage}`;

  return {
    title: `${article.seoTitle || article.title} | ${DEFAULT_METADATA.siteName}`,
    description:
      article.seoDescription ||
      article.excerpt ||
      `Read about ${article.title} - Expert insights on water purification and sustainable living.`,
    keywords: article.tags?.join(', ') || DEFAULT_METADATA.defaultKeywords,
    authors: [{ name: article.author.username }],
    category: article.category || 'Articles',
    
    openGraph: {
      title: article.title,
      description:
        article.excerpt || `Discover insights about ${article.title}`,
      url: articleUrl,
      siteName: DEFAULT_METADATA.siteName,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author.username],
      section: article.category || 'General',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
          type: 'image/jpeg',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      site: DEFAULT_METADATA.twitterHandle,
      title: article.title,
      description:
        article.excerpt || `Discover insights about ${article.title}`,
      images: [imageUrl],
    },
    
    robots: {
      index: article.status === 'published',
      follow: true,
      googleBot: {
        index: article.status === 'published',
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    alternates: {
      canonical: articleUrl,
    },
  };
}

/**
 * Generate fallback metadata when article is not found
 */
function generateFallbackMetadata(slug: string): Metadata {
  const baseUrl = getBaseUrl();
  const slugTitle = slugToTitle(slug);

  return {
    title: `Article: ${slugTitle} | ${DEFAULT_METADATA.siteName}`,
    description:
      'Discover expert insights on water purification, sustainable living, and health solutions from Shree Flow.',
    keywords: DEFAULT_METADATA.defaultKeywords,
    
    openGraph: {
      title: `Expert Article - ${DEFAULT_METADATA.siteName}`,
      description:
        'Read our latest insights on water purification and sustainable living.',
      type: 'website',
      siteName: DEFAULT_METADATA.siteName,
      url: `${baseUrl}/articles/${slug}`,
    },
    
    twitter: {
      card: 'summary',
      site: DEFAULT_METADATA.twitterHandle,
    },
    
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ============================================================================
// Metadata Generation
// ============================================================================

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = await fetchArticle(params.slug);

  if (article) {
    return generateArticleMetadata(article, params.slug);
  }

  return generateFallbackMetadata(params.slug);
}

// ============================================================================
// Page Component
// ============================================================================

export default function ArticlePage({ params }: ArticlePageProps) {
  return <ArticlePageClient />;
}