"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { articleService } from '@/lib/services/articleService';
import ImageUpload from './ImageUpload';
import RichTextEditor from './RichTextEditor';
import { 
  ArrowLeft,
  Save,
  Loader2,
  X,
  Upload
} from 'lucide-react';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  articleId?: string;
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  status: 'draft' | 'published' | 'archived';
  tags: string[];
  categories: string[];
}

export default function ArticleForm({ mode, articleId }: ArticleFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(mode === 'edit');
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    tags: [],
    categories: []
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ArticleFormData, string>>>({});

  // Auto-generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  useEffect(() => {
    if (mode === 'edit' && articleId) {
      loadArticle();
    }
  }, [mode, articleId]);

  const loadArticle = async () => {
    try {
      setIsFetching(true);
      const article = await articleService.getArticleById(articleId!);
      
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        featuredImage: article.featuredImage || '',
        status: article.status || 'draft',
        tags: article.tags || [],
        categories: article.categories || []
      });
    } catch (error: any) {
      console.error('Error loading article:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load article details",
        variant: "destructive",
      });
      router.push('/admin/articles');
    } finally {
      setIsFetching(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ArticleFormData, string>> = {};

    // Title validation (backend requires 5-200 characters)
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must not exceed 200 characters';
    }

    // Slug validation
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (formData.slug.length < 3) {
      newErrors.slug = 'Slug must be at least 3 characters';
    }

    // Content validation (backend requires at least 50 characters)
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    // Excerpt validation
    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    } else if (formData.excerpt.length < 10) {
      newErrors.excerpt = 'Excerpt must be at least 10 characters';
    } else if (formData.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt must not exceed 300 characters';
    }

    // Featured image validation (backend requires valid URL)
    if (!formData.featuredImage.trim()) {
      newErrors.featuredImage = 'Featured image URL is required';
    } else if (!isValidUrl(formData.featuredImage)) {
      newErrors.featuredImage = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Debug: Log the form data being sent
      console.log('Submitting article data:', {
        ...formData,
        titleLength: formData.title.length,
        contentLength: formData.content.length,
        excerptLength: formData.excerpt.length
      });

      if (mode === 'create') {
        await articleService.createArticle(formData);
        toast({
          title: "Success",
          description: "Article created successfully",
        });
      } else {
        await articleService.updateArticle(articleId!, formData);
        toast({
          title: "Success",
          description: "Article updated successfully",
        });
      }

      router.push('/admin/articles');
    } catch (error: any) {
      console.error('Error saving article:', error);
      console.error('Error response:', error.response?.data);
      
      // Get detailed error message
      let errorMessage = `Failed to ${mode} article`;
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        
        // If there are specific validation errors, show them
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          const validationErrors = error.response.data.errors;
          errorMessage = `Validation failed:\n${validationErrors.join('\n')}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === 'create' ? 'Create New Article' : 'Edit Article'}
          </h2>
          <p className="text-gray-600 mt-1">
            {mode === 'create' 
              ? 'Write and publish a new article'
              : 'Update article information'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Article Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const newTitle = e.target.value;
                      setFormData({ 
                        ...formData, 
                        title: newTitle,
                        slug: generateSlug(newTitle)
                      });
                    }}
                    placeholder="Enter article title..."
                    className="mt-1"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">{errors.title}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.title.length}/200 characters (minimum 5 required)
                  </p>
                </div>

                <div>
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-url-slug"
                    className="mt-1"
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-600 mt-1">{errors.slug}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    Auto-generated from title. You can customize it.
                  </p>
                </div>

                <div>
                  <Label htmlFor="excerpt">
                    Excerpt <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of the article..."
                    rows={3}
                    className="mt-1"
                  />
                  {errors.excerpt && (
                    <p className="text-sm text-red-600 mt-1">{errors.excerpt}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.excerpt.length}/300 characters (minimum 10 required)
                  </p>
                </div>

                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                  placeholder="Write your article content here..."
                  error={errors.content}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.featuredImage}
                  onChange={(url) => setFormData({ ...formData, featuredImage: url })}
                  label="Article Featured Image"
                  disabled={isLoading}
                />
                {errors.featuredImage && (
                  <p className="text-sm text-red-600 mt-2">{errors.featuredImage}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Label htmlFor="status">Publication Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tag">Add Tag</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="e.g., technology"
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Current Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <div
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-blue-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Add Category</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="category"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                      placeholder="e.g., news"
                    />
                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={!categoryInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {formData.categories.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Current Categories:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.categories.map((category) => (
                        <div
                          key={category}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => handleRemoveCategory(category)}
                            className="hover:text-purple-900"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {mode === 'create' ? 'Create Article' : 'Update Article'}
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="w-full"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
