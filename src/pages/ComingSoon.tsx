
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4" id="main-content">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-lg mb-6">
            We're working hard to bring you this feature soon. Check back later!
          </p>
          <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground">
            In the meantime, explore our other features or sign up for updates.
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ComingSoon;
