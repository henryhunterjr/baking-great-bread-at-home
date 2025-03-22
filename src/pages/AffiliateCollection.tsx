import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AffiliateGroup from '@/components/affiliate/AffiliateGroup';

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
        image: '/lovable-uploads/ba810304-c645-4c8f-99ef-0993feaf7d3f.png'
      },
      {
        name: 'High Capacity Baking Scale',
        price: '$24.95',
        link: 'https://collabs.shop/hvryn6',
        image: '/lovable-uploads/1df776e0-0d83-476a-926c-349703bf4941.png'
      },
      {
        name: 'Dough Whisk',
        price: '$18.95',
        link: 'https://collabs.shop/6jalk7',
        image: '/lovable-uploads/2bcb5c54-1a78-46ae-88ba-e228d7f27011.png'
      },
      {
        name: 'Folding Proofer & Slow Cooker',
        price: '$159.00',
        link: 'https://collabs.shop/vutgu8',
        image: '/lovable-uploads/4ecfd5ba-b06f-4201-b8d8-10cad69ec912.png'
      },
      {
        name: 'Professional VG2 Knife Sharpener',
        price: '$129.00',
        link: 'https://collabs.shop/kpxkj2',
        image: '/lovable-uploads/2841fba8-52f8-4000-b3d7-59bd37281cd6.png'
      },
      {
        name: 'Precision Kitchen & Coffee Scale with Timer',
        price: '$24.95',
        link: 'https://collabs.shop/cuut37',
        image: '/lovable-uploads/ba4b0512-fc0a-434b-b5b0-32f7173ff6d1.png'
      },
      {
        name: 'Sahara Folding Dehydrator',
        price: '$199.00',
        link: 'https://collabs.shop/94zxfe',
        image: '/lovable-uploads/7b1dd107-a286-4732-9d7c-a5080186c261.png'
      },
      {
        name: 'Compact Dough Sheeter 12" (Refurbished)',
        price: '$450.00',
        link: 'https://collabs.shop/mnrhy9',
        image: '/lovable-uploads/b7a58c43-c3fa-4067-b552-84b21a51bfcc.png'
      },
      {
        name: 'Water Kettle and French Press',
        price: '$117.53',
        link: 'https://collabs.shop/b8bht0',
        image: '/lovable-uploads/517ac596-6d3e-4c03-a1e5-f4348c47cca1.png'
      },
      {
        name: 'Baking Shell (Boule) & Steel',
        price: '$148.00',
        link: 'https://collabs.shop/g9yxme',
        image: '/lovable-uploads/ba4b0512-fc0a-434b-b5b0-32f7173ff6d1.png'
      },
      {
        name: 'Folding Dough Sheeter 15.5"',
        price: '$850.00',
        link: 'https://collabs.shop/g4nf7i',
        image: '/lovable-uploads/b7a58c43-c3fa-4067-b552-84b21a51bfcc.png'
      },
      {
        name: 'Sourdough Home (Refurbished)',
        price: '$89.00',
        link: 'https://collabs.shop/1vjisb',
        image: '/lovable-uploads/517ac596-6d3e-4c03-a1e5-f4348c47cca1.png'
      },
      {
        name: 'Baking Shell (Batard) & Steel',
        price: '$148.00',
        link: 'https://collabs.shop/noauwh',
        image: '/lovable-uploads/42db0924-1b5f-4c64-a48e-10f5ce28b6e7.png'
      },
      {
        name: 'Spice & Coffee Grinder',
        price: '$24.95',
        link: 'https://collabs.shop/ve9hzn',
        image: '/lovable-uploads/bd605a7a-18c1-4c34-9445-b91f2eb820b9.png'
      },
      {
        name: 'Bench Knife',
        price: '$18.95',
        link: 'https://collabs.shop/8vcnxu',
        image: '/lovable-uploads/42db0924-1b5f-4c64-a48e-10f5ce28b6e7.png'
      },
      {
        name: 'Cordless Vacuum Sealer',
        price: '$129.00',
        link: 'https://collabs.shop/rbhadw',
        image: '/lovable-uploads/ba4b0512-fc0a-434b-b5b0-32f7173ff6d1.png'
      },
      {
        name: 'Baking Shell (Boule Only)',
        price: '$79.00',
        link: 'https://collabs.shop/jveyfn',
        image: '/lovable-uploads/42db0924-1b5f-4c64-a48e-10f5ce28b6e7.png'
      },
      {
        name: 'Brød & Taylor Apron',
        price: '$60.00',
        link: 'https://collabs.shop/akcwv4',
        image: '/lovable-uploads/ba4b0512-fc0a-434b-b5b0-32f7173ff6d1.png'
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
