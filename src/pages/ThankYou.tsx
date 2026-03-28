
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Download, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ThankYou: React.FC = () => {
  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/sourdough-for-the-rest-of-us.pdf';
    link.download = 'Sourdough-for-the-Rest-of-Us-Henry-Hunter.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="border-bread-200/20 bg-bread-900/30 max-w-lg w-full">
        <CardContent className="p-8 md:p-12 text-center">
          <Heart className="h-12 w-12 text-bread-400 mx-auto mb-6 fill-bread-400" />
          <h1 className="font-serif text-3xl font-bold text-bread-100 mb-4">
            Thank You
          </h1>
          <p className="text-bread-300 mb-8 leading-relaxed">
            Your generosity means the world. Every cup of coffee helps me keep
            creating recipes, content, and resources for home bakers like you.
            Now go bake something great.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              size="lg"
              onClick={handleDownloadPDF}
              className="bg-bread-500 hover:bg-bread-600 text-white"
            >
              <Download className="mr-2 h-5 w-5" />
              Download the Book
            </Button>
            <Button
              variant="ghost"
              className="text-bread-400 hover:text-bread-200"
              asChild
            >
              <Link to="/sourdough-book">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to the book
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
