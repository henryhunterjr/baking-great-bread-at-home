
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bread-950 dark:bg-bread-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter signup */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h3 className="font-serif text-2xl md:text-3xl mb-4 text-white">Join Our Baking Community</h3>
          <p className="text-gray-300 mb-8">
            Subscribe to our newsletter for exclusive recipes, baking tips, and early access to challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-bread-900/70 border-bread-700 text-white placeholder:text-gray-400"
            />
            <Button className="bg-bread-600 hover:bg-bread-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 mb-12">
          {/* Column 1 */}
          <div className="flex flex-col">
            <h4 className="font-serif text-xl mb-6 font-medium text-white">Baking Great Bread</h4>
            <p className="text-gray-300 mb-6">
              Dedicated to helping home bakers master the craft of artisanal bread making through expert guidance, quality tools, and community support.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a href="https://www.facebook.com/henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/bakinggreatbread" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://tiktok.com/@HenryHunter12" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors p-1 border border-gray-700 rounded">
                <span className="text-xs font-bold">TikTok</span>
              </a>
              <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Youtube size={20} />
              </a>
              <a href="mailto:BGBAH2023@Gmail.com" className="text-gray-300 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-medium text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/books" className="text-gray-300 hover:text-white transition-colors">Books & Guides</Link></li>
              <li><Link to="/tools" className="text-gray-300 hover:text-white transition-colors">Baking Tools</Link></li>
              <li><Link to="/challenges" className="text-gray-300 hover:text-white transition-colors">Challenges & Giveaways</Link></li>
              <li><Link to="/coaching" className="text-gray-300 hover:text-white transition-colors">Coaching & Consulting</Link></li>
              <li><Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog & Recipes</Link></li>
              <li><Link to="/app" className="text-gray-300 hover:text-white transition-colors">Crust & Crumb App</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-medium text-white">Contact</h4>
            <p className="text-gray-300 mb-2">
              Have questions or feedback? Reach out to us directly:
            </p>
            <p className="text-gray-300 mb-6">
              <a href="mailto:BGBAH2023@Gmail.com" className="hover:text-white transition-colors">
                BGBAH2023@Gmail.com
              </a>
            </p>
            <Button asChild variant="outline" className="bg-bread-600 hover:bg-bread-700 text-white border-none hover:translate-y-[-2px] transition-transform">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-gray-300 border-t border-bread-800 pt-8">
          <p>© {currentYear} Baking Great Bread at Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
