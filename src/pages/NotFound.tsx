
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="font-serif text-6xl md:text-7xl mb-6 text-bread-800">404</h1>
            <h2 className="font-serif text-2xl md:text-3xl mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              We couldn't find the page you're looking for. It might have been moved, renamed, or doesn't exist.
            </p>
            <Button asChild className="bg-bread-800 hover:bg-bread-900 text-white">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
