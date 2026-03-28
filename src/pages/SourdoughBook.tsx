
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, BookOpen, Coffee, Heart, ArrowRight } from 'lucide-react';

const TIP_AMOUNTS = [3, 5, 10];

const SourdoughBook: React.FC = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [loadingTip, setLoadingTip] = useState<number | string | null>(null);

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/sourdough-for-the-rest-of-us.pdf';
    link.download = 'Sourdough-for-the-Rest-of-Us-Henry-Hunter.pdf';
    link.click();
  };

  const handleTip = async (amount: number) => {
    setLoadingTip(amount);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoadingTip(null);
    }
  };

  const handleCustomTip = () => {
    const amount = parseFloat(customAmount);
    if (amount && amount >= 1) {
      handleTip(amount);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bread-900/90 to-background z-0" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Book Cover */}
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-bread-400 to-bread-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-500" />
                <img
                  src="/sourdough-cover.png"
                  alt="Sourdough for the Rest of Us — Perfection Not Required by Henry Hunter"
                  className="relative rounded-lg shadow-2xl max-w-[320px] w-full"
                />
              </div>
            </div>

            {/* Book Info */}
            <div className="text-center md:text-left">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4">
                Sourdough for the Rest of Us
              </h1>
              <p className="text-xl text-bread-200 mb-2 italic">
                Perfection Not Required
              </p>
              <p className="text-bread-300 mb-8">
                by Henry Hunter
              </p>
              <p className="text-lg text-bread-100/90 mb-8 leading-relaxed">
                This isn't a book for professional bakers or Instagram perfectionists.
                It's for the rest of us — the home bakers who just want to pull a
                good loaf out of the oven without losing our minds. No gatekeeping.
                No fuss. Just bread.
              </p>

              {/* Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleDownloadPDF}
                  className="bg-bread-500 hover:bg-bread-600 text-white text-lg px-8 py-6"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Free PDF
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-bread-400 text-bread-200 hover:bg-bread-800/50 text-lg px-8 py-6"
                  asChild
                >
                  <a
                    href="https://designrr.page/?id=417933&token=252850456&type=FP&h=7998&skipOptions=1"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Read the Flip Book
                  </a>
                </Button>
              </div>

              <p className="text-bread-400 text-sm mt-4">
                No email required. No sign-up. Just download and bake.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tip Section */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-bread-200/20 bg-bread-900/30 backdrop-blur">
          <CardContent className="p-8 md:p-12 text-center">
            <Coffee className="h-10 w-10 text-bread-400 mx-auto mb-4" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bread-100 mb-4">
              Buy Me a Cup of Coffee
            </h2>
            <p className="text-bread-300 mb-8 max-w-lg mx-auto leading-relaxed">
              A lot of people have asked how they can support the work I do.
              If that's something you'd like to do, you can buy me a cup of coffee.
              But this book is truly free — download it and bake something great.
            </p>

            {/* Tip Amounts */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {TIP_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  size="lg"
                  variant="outline"
                  onClick={() => handleTip(amount)}
                  disabled={loadingTip !== null}
                  className="border-bread-400 text-bread-200 hover:bg-bread-500 hover:text-white hover:border-bread-500 min-w-[100px] text-lg py-6 transition-all"
                >
                  {loadingTip === amount ? (
                    <span className="animate-pulse">...</span>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      ${amount}
                    </>
                  )}
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-bread-400">$</span>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Other"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="pl-7 bg-bread-900/50 border-bread-700 text-bread-100 placeholder:text-bread-500"
                />
              </div>
              <Button
                onClick={handleCustomTip}
                disabled={!customAmount || parseFloat(customAmount) < 1 || loadingTip !== null}
                className="bg-bread-500 hover:bg-bread-600 text-white"
              >
                {loadingTip === 'custom' ? '...' : 'Tip'}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <p className="text-bread-500 text-xs mt-6">
              Payments processed securely by Stripe. Thank you for your generosity.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* What's Inside */}
      <section className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-bread-100 text-center mb-10">
          What's Inside
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { title: 'Getting Started', desc: 'Everything you need to know about sourdough starters — feeding, maintaining, and not stressing about it.' },
            { title: 'Your First Loaf', desc: 'A step-by-step walkthrough that actually works the first time. No surprises.' },
            { title: 'Troubleshooting', desc: 'What to do when your loaf looks weird, your starter smells funny, or things just aren\'t rising.' },
            { title: 'Beyond the Basics', desc: 'Once you\'ve nailed the fundamentals, explore shaping, scoring, and making it your own.' },
          ].map((item) => (
            <Card key={item.title} className="border-bread-200/10 bg-bread-900/20">
              <CardContent className="p-6">
                <h3 className="font-serif text-lg font-semibold text-bread-200 mb-2">{item.title}</h3>
                <p className="text-bread-400 text-sm leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <p className="text-bread-300 text-lg mb-6">
          Ready to bake something worth sharing?
        </p>
        <Button
          size="lg"
          onClick={handleDownloadPDF}
          className="bg-bread-500 hover:bg-bread-600 text-white text-lg px-10 py-6"
        >
          <Download className="mr-2 h-5 w-5" />
          Download the Book — It's Free
        </Button>
      </section>
    </div>
  );
};

export default SourdoughBook;
