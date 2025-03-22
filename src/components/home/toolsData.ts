
import { Tool } from './ToolCard';
import { AffiliateProduct } from './AffiliateProductCard';

export const toolsData: Tool[] = [
  {
    id: 1,
    title: "Sourdough Starter 101",
    image: "/lovable-uploads/4eecc1c5-81f0-4a97-a8db-4a4abbe118b3.png",
    description: "Our no-nonsense guide to creating and maintaining the perfect sourdough starter.",
    link: "https://gamma.app/docs/Sourdough-Starter-101-i2pocnfzmhtzwva?mode=doc",
    isExternalLink: true
  },
  {
    id: 2,
    title: "Yeast Wise Calculator",
    image: "/lovable-uploads/c8be269c-8418-443a-a406-cdee0b40739f.png",
    description: "Calculate precise yeast water ratios for consistent, perfectly risen dough every time.",
    link: "https://lovable.dev/projects/b7b3c470-3ffe-4dc8-8e2a-48938c7b0d89",
    isExternalLink: true
  },
  {
    id: 3,
    title: "Loaf Logic",
    image: "/lovable-uploads/05142b58-b1f4-4794-a927-326107122971.png",
    description: "A comprehensive bread calculator and recipe manager for the serious home baker.",
    link: "https://loaflogic.lovable.app/",
    isExternalLink: true
  },
  {
    id: 4,
    title: "Yeast Water Mastery Quiz",
    image: "/lovable-uploads/17b70a1a-f9a7-4791-8af6-344e2750b6c1.png", 
    description: "Test your knowledge and master the art of yeast water cultivation with our interactive quiz.",
    link: "https://yeast-water-wisdom.vercel.app",
    isExternalLink: true
  },
  {
    id: 5,
    title: "Sourdough for the Rest of Us",
    image: "/lovable-uploads/9c1c5006-46ce-47e5-8b43-615ce7e14ecc.png",
    description: "A simple, stress-free guide that makes sourdough baking accessible to everyone.",
    link: "https://sourdough-simplified-gift.lovable.app/sourdough-for-the-rest",
    isExternalLink: true
  },
  {
    id: 6,
    title: "Bread Baker's Quiz",
    image: "/lovable-uploads/529a2d4b-da6e-4e91-8d1a-6aa2a8c198e0.png",
    description: "Test your bread baking knowledge with our comprehensive and fun interactive quiz.",
    link: "https://bakers-quizfest.lovable.app/",
    isExternalLink: true
  },
  {
    id: 7,
    title: "From Card to Kitchen",
    image: "https://images.unsplash.com/photo-1556911261-6bd341186b2f?q=80&w=1000&auto=format&fit=crop",
    description: "Convert old family recipes, scanned images, or digital clippings into clean, standardized recipe cards.",
    link: "/recipe-converter",
    isExternalLink: false
  },
  {
    id: 8,
    title: "Sourdough Calculator",
    image: "https://images.unsplash.com/photo-1585478259715-876a6a81fc08?q=80&w=1000&auto=format&fit=crop",
    description: "Calculate hydration, starter percentages, and timings for the perfect sourdough loaf.",
    link: "/tools",
    isExternalLink: false
  }
];

export const affiliateProductsData: AffiliateProduct[] = [
  {
    id: 1,
    brand: "Brød & Taylor",
    name: "Bread Proofer & Slow Cooker",
    description: "Perfect temperature control for optimal fermentation and rising.",
    image: "/lovable-uploads/be2abfc8-3126-4aab-9ffd-f5b1d9c195e7.png",
    link: "https://collabs.shop/vutgu8",
    discountCode: "",
    icon: "🛠"
  },
  {
    id: 2,
    brand: "SourHouse",
    name: "Goldie Starter Home",
    description: "A warm, safe home for your sourdough starter.",
    image: "/lovable-uploads/c32c2cba-ad10-4ec1-bd25-98452273364b.png",
    link: "https://bit.ly/Sourhouse",
    discountCode: "HBK23",
    icon: "🧂"
  },
  {
    id: 3,
    brand: "ModKitchn",
    name: "Bread Baking Kit",
    description: "Essential tools to elevate your bread baking game.",
    image: "/lovable-uploads/16a49c70-55f0-4a53-a90a-138492562ba8.png",
    link: "https://modkitchn.com/discount/BAKINGGREATBREAD10",
    discountCode: "BAKINGGREATBREAD10",
    icon: "🍽"
  },
  {
    id: 4,
    brand: "Challenger Breadware",
    name: "Bread Pan",
    description: "Cast iron bread pan for perfectly baked artisan loaves.",
    image: "/lovable-uploads/422bd558-2b88-4654-aa81-6423405f3a70.png",
    link: "https://challengerbreadware.com/?ref=henryhunterjr",
    discountCode: "",
    icon: "🔥"
  },
  {
    id: 5,
    brand: "Wire Monkey",
    name: "Bread Lame",
    description: "Precision scoring tool for beautiful bread designs.",
    image: "/lovable-uploads/253833f0-ddae-446a-9b3c-79a5d2f4917d.png",
    link: "https://bit.ly/3QFQek8",
    discountCode: "",
    icon: "🪒"
  },
  {
    id: 6,
    brand: "Holland Bowl Mill",
    name: "Wooden Mixing Bowls",
    description: "Handcrafted wooden bowls perfect for dough proofing and serving.",
    image: "/lovable-uploads/fd49bda2-9c04-4fb3-be06-3409f4f33c2e.png",
    link: "https://hollandbowlmill.com/baking/?wpam_id=10",
    discountCode: "Use Code BREAD at Checkout to Save 10%",
    icon: "🪵"
  }
];
