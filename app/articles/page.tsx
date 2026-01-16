import { Metadata } from 'next';
import ArticlesList from '@/components/articles/ArticlesList';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Articles & Blog - Shree Flow',
  description: 'Read our latest articles, insights, and updates about water filtration and purification technology.',
};

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-x-hidden w-full">
      <Header />
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight break-words overflow-wrap-anywhere px-2">
              Articles & Insights
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light break-words px-2">
            Discover the latest insights on water purification, health benefits, 
            and sustainable living with our innovative water filtration solutions.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center">
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
          </div>
        </div>
        
        <ArticlesList />
      </div>
    </div>
  );
}