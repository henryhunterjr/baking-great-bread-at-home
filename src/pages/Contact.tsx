
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24 bg-bread-950/90 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl mb-6 text-center">Get In Touch</h1>
            <p className="text-gray-300 mb-12 text-center">
              Have questions about bread baking or want to collaborate? I'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Contact Info */}
              <div className="bg-bread-800/60 p-6 rounded-lg">
                <h2 className="font-serif text-2xl mb-6 text-center">Contact Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-bread-200 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-bread-100">Email</h3>
                      <a href="mailto:BGBAH2023@Gmail.com" className="text-bread-200 hover:text-white">
                        BGBAH2023@Gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-bread-200 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-bread-100">Social Media</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        <Button asChild variant="outline" size="sm" className="justify-start">
                          <a href="https://tiktok.com/@HenryHunter12" target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">TikTok</span>
                            <span className="text-bread-200">@HenryHunter12</span>
                          </a>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm" className="justify-start">
                          <a href="https://instagram.com/BakingGreatBreadatHome" target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">Instagram</span>
                            <span className="text-bread-200">@BakingGreatBreadatHome</span>
                          </a>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm" className="justify-start">
                          <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">YouTube</span>
                            <span className="text-bread-200">@henryhunterjr</span>
                          </a>
                        </Button>
                        
                        <Button asChild variant="outline" size="sm" className="justify-start">
                          <a href="https://www.facebook.com/henryhunterjr" target="_blank" rel="noopener noreferrer">
                            <span className="mr-2">Facebook</span>
                            <span className="text-bread-200">Henry Hunter Jr</span>
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center mt-8 space-x-4">
                  <a href="https://www.facebook.com/henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-bread-200 hover:text-white transition-colors">
                    <Facebook size={24} />
                  </a>
                  <a href="https://instagram.com/BakingGreatBreadatHome" target="_blank" rel="noopener noreferrer" className="text-bread-200 hover:text-white transition-colors">
                    <Instagram size={24} />
                  </a>
                  <a href="https://tiktok.com/@HenryHunter12" target="_blank" rel="noopener noreferrer" className="text-bread-200 hover:text-white transition-colors p-1 border border-bread-200 rounded">
                    <span className="text-xs font-bold">TikTok</span>
                  </a>
                  <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-bread-200 hover:text-white transition-colors">
                    <Youtube size={24} />
                  </a>
                  <a href="mailto:BGBAH2023@Gmail.com" className="text-bread-200 hover:text-white transition-colors">
                    <Mail size={24} />
                  </a>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-bread-800/60 p-6 rounded-lg">
                <h2 className="font-serif text-2xl mb-6 text-center">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-bread-100 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border border-bread-700 rounded-md bg-bread-900/50 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bread-100 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border border-bread-700 rounded-md bg-bread-900/50 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bread-100 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full p-2 border border-bread-700 rounded-md bg-bread-900/50 text-white"
                    ></textarea>
                  </div>
                  
                  <Button className="w-full bg-bread-600 hover:bg-bread-700 text-white">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild variant="outline" className="border-bread-700 text-bread-200 hover:bg-bread-800 hover:text-white">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
