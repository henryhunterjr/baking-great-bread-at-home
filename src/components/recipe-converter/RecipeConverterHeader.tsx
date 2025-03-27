
import React from 'react';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
              src="/lovable-uploads/964b8d2f-2dcb-4bb2-bb75-8d1fc2490166.png" 
              alt="Vintage handwritten recipe card" 
              className="object-cover w-full h-full brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h2 className="text-2xl font-serif font-semibold">Preserve Your Family Legacy</h2>
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
