import { Metadata } from 'next';
import ArticlesList from '@/components/articles/ArticlesList';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Articles & Blog - Shree Flow',
  description: 'Read our latest articles, insights, and updates about water filtration and purification technology.',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Articles & Insights
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Discover the latest insights on water purification, health benefits, 
            and sustainable living with our innovative water filtration solutions.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
        </div>
        
        <ArticlesList />
      </div>
    </div>
  );
}