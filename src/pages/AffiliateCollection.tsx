
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AffiliateGroup from '@/components/affiliate/AffiliateGroup';
import { affiliateGroups } from '@/data/affiliateGroupsData';

const AffiliateCollection = () => {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Affiliate Collection</h1>
            <p className="text-muted-foreground max-w-3xl">
              A curated collection of my personally recommended baking equipment and tools. These are products I use and love in my own kitchen.
            </p>
            <div className="bg-amber-100 dark:bg-amber-900/30 px-4 py-3 rounded-lg mt-4">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Affiliate Disclosure:</span> As an Amazon Associate and partner with other brands, I earn from qualifying purchases. This means I may receive a small commission when you buy through my links, at no extra cost to you.
              </p>
            </div>
          </div>

          {affiliateGroups.map((group) => (
            <AffiliateGroup key={group.id} group={group} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AffiliateCollection;
