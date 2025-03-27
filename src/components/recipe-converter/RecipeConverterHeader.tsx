
import React from 'react';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { BookOpen } from 'lucide-react';

const RecipeConverterHeader: React.FC = () => {
  return (
    <>
      <h1 className="section-title text-center mb-3">From Card to Kitchen</h1>
      <p className="section-subtitle text-center mb-8">
        Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards
      </p>
      
      <div className="mb-8">
        <Card className="overflow-hidden border-none shadow-lg">
          <AspectRatio ratio={16/9} className="bg-muted">
            <img 
              src="/lovable-uploads/f890e414-dd1b-487e-9609-3d437cb0c696.png" 
              alt="Vintage handwritten recipe card" 
              className="object-cover w-full h-full brightness-95"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-serif font-semibold flex items-center">
                  <BookOpen className="mr-3 h-8 w-8" />
                  Preserve Your Family Legacy
                </h2>
                <p className="text-sm opacity-90">Transform treasured handwritten recipes into digital format that will last for generations</p>
              </div>
            </div>
          </AspectRatio>
        </Card>
      </div>
    </>
  );
};

export default RecipeConverterHeader;
