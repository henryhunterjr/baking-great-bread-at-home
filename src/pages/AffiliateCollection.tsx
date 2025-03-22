
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const AffiliateCollection = () => {
  const affiliateGroups = [
    {
      id: 'brod-taylor',
      name: 'Brød & Taylor',
      icon: '🛠️',
      description: 'Premium baking tools and equipment for serious home bakers',
      products: [
        {
          name: 'Baking Tools Starter Kit',
          price: '$56.41',
          link: 'https://collabs.shop/7k4ksj',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'High Capacity Baking Scale',
          price: '$24.95',
          link: 'https://collabs.shop/hvryn6',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Dough Whisk',
          price: '$18.95',
          link: 'https://collabs.shop/6jalk7',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Folding Proofer & Slow Cooker',
          price: '$159.00',
          link: 'https://collabs.shop/vutgu8',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png'
        },
        {
          name: 'Professional VG2 Knife Sharpener',
          price: '$129.00',
          link: 'https://collabs.shop/kpxkj2',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Precision Kitchen & Coffee Scale with Timer',
          price: '$24.95',
          link: 'https://collabs.shop/cuut37',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Sahara Folding Dehydrator',
          price: '$199.00',
          link: 'https://collabs.shop/94zxfe',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Compact Dough Sheeter 12" (Refurbished)',
          price: '$450.00',
          link: 'https://collabs.shop/mnrhy9',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Water Kettle and French Press',
          price: '$117.53',
          link: 'https://collabs.shop/b8bht0',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Baking Shell (Boule) & Steel',
          price: '$148.00',
          link: 'https://collabs.shop/g9yxme',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Folding Dough Sheeter 15.5"',
          price: '$850.00',
          link: 'https://collabs.shop/g4nf7i',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Sourdough Home (Refurbished)',
          price: '$89.00',
          link: 'https://collabs.shop/1vjisb',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Baking Shell (Batard) & Steel',
          price: '$148.00',
          link: 'https://collabs.shop/noauwh',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Spice & Coffee Grinder',
          price: '$24.95',
          link: 'https://collabs.shop/ve9hzn',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Bench Knife',
          price: '$18.95',
          link: 'https://collabs.shop/8vcnxu',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Cordless Vacuum Sealer',
          price: '$129.00',
          link: 'https://collabs.shop/rbhadw',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Baking Shell (Boule Only)',
          price: '$79.00',
          link: 'https://collabs.shop/jveyfn',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        },
        {
          name: 'Brød & Taylor Apron',
          price: '$60.00',
          link: 'https://collabs.shop/akcwv4',
          image: '/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png' // Using existing proofer image as placeholder
        }
      ]
    },
    {
      id: 'sourhouse',
      name: 'SourHouse',
      icon: '🧠',
      description: 'Sourdough starter care and maintenance products',
      discountCode: 'HBK23',
      products: [
        {
          name: 'Goldie Starter Home',
          price: '',
          link: 'https://bit.ly/Sourhouse',
          image: '/lovable-uploads/c32c2cba-ad10-4ec1-bd25-98452273364b.png'
        }
      ]
    },
    {
      id: 'modkitchn',
      name: 'ModKitchn',
      icon: '🍽️',
      description: 'Essential tools to elevate your bread baking game',
      discountCode: 'BAKINGGREATBREAD10',
      products: [
        {
          name: 'Bread Baking Kit',
          price: '',
          link: 'https://modkitchn.com/discount/BAKINGGREATBREAD10',
          image: '/lovable-uploads/16a49c70-55f0-4a53-a90a-138492562ba8.png'
        }
      ]
    },
    {
      id: 'challenger-breadware',
      name: 'Challenger Breadware',
      icon: '🔥',
      description: 'Cast iron bread pan for perfectly baked artisan loaves',
      products: [
        {
          name: 'Bread Pan',
          price: '',
          link: 'https://challengerbreadware.com/?ref=henryhunterjr',
          image: '/lovable-uploads/422bd558-2b88-4654-aa81-6423405f3a70.png'
        }
      ]
    },
    {
      id: 'wire-monkey',
      name: 'Wire Monkey',
      icon: '🪒',
      description: 'Precision scoring tools for beautiful bread designs',
      products: [
        {
          name: 'Bread Lame',
          price: '',
          link: 'https://bit.ly/3QFQek8',
          image: '/lovable-uploads/253833f0-ddae-446a-9b3c-79a5d2f4917d.png'
        }
      ]
    },
    {
      id: 'holland-bowl-mill',
      name: 'Holland Bowl Mill',
      icon: '🪵',
      description: 'Handcrafted wooden bowls perfect for dough proofing and serving',
      discountCode: 'Use Code BREAD at Checkout to Save 10%',
      products: [
        {
          name: 'Wooden Mixing Bowls',
          price: '',
          link: 'https://hollandbowlmill.com/baking/?wpam_id=10',
          image: '/lovable-uploads/fd49bda2-9c04-4fb3-be06-3409f4f33c2e.png'
        }
      ]
    }
  ];

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
            <div key={group.id} className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{group.icon}</span>
                <h2 className="text-2xl font-bold">{group.name}</h2>
                {group.discountCode && (
                  <Badge className="ml-2 bg-amber-500 hover:bg-amber-600 text-white">
                    Code: {group.discountCode}
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-6">{group.description}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.products.map((product, index) => (
                  <Card key={`${group.id}-${index}`} className="overflow-hidden border-bread-100 dark:border-bread-800 shadow-md hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold">{product.name}</h3>
                        {product.price && <span className="text-sm font-medium">{product.price}</span>}
                      </div>
                      <Button 
                        className="w-full mt-4 bg-bread-800 hover:bg-bread-900 text-white"
                        asChild
                      >
                        <a href={product.link} target="_blank" rel="noopener noreferrer">
                          Shop Now
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Separator className="mt-8" />
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AffiliateCollection;
