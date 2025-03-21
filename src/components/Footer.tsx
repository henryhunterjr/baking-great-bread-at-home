
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-bread-50 border-t border-border/50 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter signup */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h3 className="font-serif text-2xl md:text-3xl mb-4">Join Our Baking Community</h3>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive recipes, baking tips, and early access to challenges.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Your email address" 
              className="bg-background border-border"
            />
            <Button className="bg-bread-800 hover:bg-bread-900 text-white">
              Subscribe
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-16 mb-12">
          {/* Column 1 */}
          <div className="flex flex-col">
            <h4 className="font-serif text-xl mb-6 font-medium">Baking Great Bread</h4>
            <p className="text-muted-foreground mb-6">
              Dedicated to helping home bakers master the craft of artisanal bread making through expert guidance, quality tools, and community support.
            </p>
            <div className="flex space-x-4 mt-auto">
              <a href="#" className="text-bread-800 hover:text-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-bread-800 hover:text-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-bread-800 hover:text-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-bread-800 hover:text-accent transition-colors">
                <Youtube size={20} />
              </a>
              <a href="mailto:HenryHunterJr@Gmail.com" className="text-bread-800 hover:text-accent transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-medium">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/books" className="text-muted-foreground hover:text-accent transition-colors">Books & Guides</Link></li>
              <li><Link to="/tools" className="text-muted-foreground hover:text-accent transition-colors">Baking Tools</Link></li>
              <li><Link to="/challenges" className="text-muted-foreground hover:text-accent transition-colors">Challenges & Giveaways</Link></li>
              <li><Link to="/coaching" className="text-muted-foreground hover:text-accent transition-colors">Coaching & Consulting</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-accent transition-colors">Blog & Recipes</Link></li>
              <li><Link to="/app" className="text-muted-foreground hover:text-accent transition-colors">Crust & Crumb App</Link></li>
            </ul>
          </div>
          
          {/* Column 3 */}
          <div>
            <h4 className="font-serif text-xl mb-6 font-medium">Contact</h4>
            <p className="text-muted-foreground mb-2">
              Have questions or feedback? Reach out to us directly:
            </p>
            <p className="text-muted-foreground mb-6">
              <a href="mailto:HenryHunterJr@Gmail.com" className="hover:text-accent transition-colors">
                HenryHunterJr@Gmail.com
              </a>
            </p>
            <Button asChild className="bg-bread-800 hover:bg-bread-900 text-white">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
        
        <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
          <p>© {currentYear} Baking Great Bread at Home. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
