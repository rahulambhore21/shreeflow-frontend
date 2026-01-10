import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Sorry, we couldn't find the product you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/#products">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-sky-600 text-white hover:from-blue-700 hover:to-sky-700 gap-3">
              <ArrowLeft className="w-5 h-5" />
              Back to Products
            </Button>
          </Link>
          
          <Link href="/">
            <Button size="lg" variant="outline" className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 gap-3">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}