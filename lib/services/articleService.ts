import api from './api';

export interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  author: {
    _id: string;
    username: string;
    email: string;
  };
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
  views: number;
  likes: number;
  publishedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface ArticlesResponse {
  type: string;
  data: Article[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ArticleAnalytics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  totalLikes: number;
  topArticles: Array<{
    _id: string;
    title: string;
    slug: string;
    views: number;
    likes: number;
    publishedAt: string;
  }>;
}

export interface CreateArticleData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage: string;
  status?: 'draft' | 'published' | 'archived';
  tags?: string[];
  categories?: string[];
  seoTitle?: string;
  seoDescription?: string;
}

class ArticleService {
  async getAllArticles(params?: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published' | 'archived';
    category?: string;
    tag?: string;
    author?: string;
    search?: string;
  }): Promise<ArticlesResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.tag) queryParams.append('tag', params.tag);
    if (params?.author) queryParams.append('author', params.author);
    if (params?.search) queryParams.append('search', params.search);

    const response = await api.get(`/articles?${queryParams}`);
    return response.data;
  }

  async getArticleById(id: string): Promise<Article> {
    const response = await api.get(`/articles/${id}`);
    return response.data.data;
  }

  async getArticleBySlug(slug: string): Promise<Article> {
    const response = await api.get(`/articles/${slug}`);
    return response.data.data;
  }

  async createArticle(articleData: CreateArticleData): Promise<Article> {
    const response = await api.post('/articles', articleData);
    return response.data.data;
  }

  async updateArticle(id: string, articleData: Partial<CreateArticleData>): Promise<Article> {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data.data;
  }

  async deleteArticle(id: string): Promise<void> {
    await api.delete(`/articles/${id}`);
  }

  async getArticleAnalytics(): Promise<ArticleAnalytics> {
    const response = await api.get('/articles/admin/analytics');
    return response.data.data;
  }
}

export const articleService = new ArticleService();