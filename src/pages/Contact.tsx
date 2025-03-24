
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl mb-6 text-bread-800 dark:text-white">Get In Touch</h1>
            <p className="text-muted-foreground mb-12 dark:text-gray-300">
              Have questions about bread baking or want to collaborate? I'd love to hear from you!
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Contact Info */}
              <div className="bg-bread-50 dark:bg-bread-900/50 p-6 rounded-lg">
                <h2 className="font-serif text-2xl mb-6 text-bread-800 dark:text-white">Contact Information</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-bread-800 dark:text-gray-300 mt-1" />
                    <div>
                      <h3 className="font-medium dark:text-white">Email</h3>
                      <a href="mailto:HenryHunterJr@Gmail.com" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                        HenryHunterJr@Gmail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-bread-800 dark:text-gray-300 mt-1" />
                    <div>
                      <h3 className="font-medium dark:text-white">Social Media</h3>
                      <ul className="space-y-2 mt-2">
                        <li>
                          <span className="font-medium">TikTok:</span>{" "}
                          <a href="https://tiktok.com/@henryhunter12" target="_blank" rel="noopener noreferrer" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                            @henryhunter12
                          </a>
                          {" & "}
                          <a href="https://tiktok.com/@henrysbreadkitchen" target="_blank" rel="noopener noreferrer" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                            @henrysbreadkitchen
                          </a>
                        </li>
                        <li>
                          <span className="font-medium">Instagram:</span>{" "}
                          <a href="https://instagram.com/BakingGreatBreadatHome" target="_blank" rel="noopener noreferrer" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                            @BakingGreatBreadatHome
                          </a>
                        </li>
                        <li>
                          <span className="font-medium">YouTube:</span>{" "}
                          <a href="https://www.youtube.com/@henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                            @henryhunterjr
                          </a>
                        </li>
                        <li>
                          <span className="font-medium">Facebook:</span>{" "}
                          <a href="https://www.facebook.com/henryhunterjr" target="_blank" rel="noopener noreferrer" className="text-bread-800 hover:text-accent dark:text-gray-300 dark:hover:text-white">
                            Henry Hunter Jr
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="bg-white dark:bg-bread-900/70 p-6 rounded-lg shadow-sm border border-border">
                <h2 className="font-serif text-2xl mb-6 text-bread-800 dark:text-white">Send a Message</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-bread-800 dark:text-gray-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full p-2 border border-border rounded-md bg-background dark:bg-bread-800/50 dark:border-bread-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-bread-800 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full p-2 border border-border rounded-md bg-background dark:bg-bread-800/50 dark:border-bread-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-bread-800 dark:text-gray-300 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full p-2 border border-border rounded-md bg-background dark:bg-bread-800/50 dark:border-bread-700 dark:text-white"
                    ></textarea>
                  </div>
                  
                  <Button className="w-full bg-bread-800 hover:bg-bread-900 text-white">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild variant="outline" className="border-bread-200 text-bread-800 hover:bg-bread-50 dark:border-bread-700 dark:text-gray-300 dark:hover:bg-bread-800">
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
