
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Download, BookOpen, Coffee, Heart, ArrowRight, FileText, Layers } from 'lucide-react';

const TIP_AMOUNTS = [5, 10, 25];
const FLIPBOOK_URL = 'https://designrr.page/?id=417933&token=252850456&type=FP&h=7998&skipOptions=1';

type Format = 'pdf' | 'flipbook' | 'both';

const SourdoughBook: React.FC = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [loadingTip, setLoadingTip] = useState<number | string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<Format>('pdf');

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = '/sourdough-for-the-rest-of-us.pdf';
    link.download = 'Sourdough-for-the-Rest-of-Us-Henry-Hunter.pdf';
    link.click();
  };

  const handleGetBook = () => {
    if (selectedFormat === 'pdf') {
      handleDownloadPDF();
    } else if (selectedFormat === 'flipbook') {
      window.open(FLIPBOOK_URL, '_blank');
    } else {
      handleDownloadPDF();
      window.open(FLIPBOOK_URL, '_blank');
    }
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

  const scrollToCheckout = () => {
    document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatOptions: { value: Format; label: string; desc: string; icon: React.ReactNode }[] = [
    { value: 'pdf', label: 'PDF Download', desc: 'Download to keep forever', icon: <FileText className="h-5 w-5" /> },
    { value: 'flipbook', label: 'Flip Book', desc: 'Read it online right now', icon: <BookOpen className="h-5 w-5" /> },
    { value: 'both', label: 'Both', desc: 'Why not?', icon: <Layers className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-bread-500 hover:bg-bread-600 text-white text-lg px-8 py-6 cursor-default"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download the PDF Below
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-bread-400 text-bread-200 hover:bg-bread-800/50 text-lg px-8 py-6 cursor-default"
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Flip Book Below
                </Button>
              </div>

              <p className="text-bread-400 text-sm mt-4">
                No email required. No sign-up. Just download and bake.
              </p>
            </div>
          </div>
        </div>
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

      {/* Video Section */}
      <section className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-bread-100 mb-4">
          Hear It From Me
        </h2>
        <p className="text-bread-300 mb-8 max-w-lg mx-auto leading-relaxed">
          I made a short video walking through what's in the book and why I wrote it.
          Two minutes. Worth it.
        </p>
        <div className="w-full max-w-[720px] mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute inset-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/2R9JPRaLCrk"
              title="Sourdough for the Rest of Us — Free Book, No Gatekeeping"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      {/* Checkout Section */}
      <section id="checkout" className="container mx-auto px-4 py-16 max-w-3xl">
        <Card className="border-bread-200/20 bg-bread-900/30 backdrop-blur">
          <CardContent className="p-8 md:p-12">
            {/* Format Picker */}
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-bread-100 text-center mb-2">
              Pick Your Format
            </h2>
            <p className="text-bread-400 text-sm text-center mb-8">
              It's free either way.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {formatOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedFormat(opt.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedFormat === opt.value
                      ? 'border-bread-400 bg-bread-800/50 ring-1 ring-bread-400'
                      : 'border-bread-700/50 bg-bread-900/30 hover:border-bread-600/50'
                  }`}
                >
                  <div className={`mb-2 ${selectedFormat === opt.value ? 'text-bread-300' : 'text-bread-500'}`}>
                    {opt.icon}
                  </div>
                  <div className={`font-medium text-sm ${selectedFormat === opt.value ? 'text-bread-100' : 'text-bread-300'}`}>
                    {opt.label}
                  </div>
                  <div className="text-bread-500 text-xs mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>

            {/* Get It Button */}
            <div className="text-center mb-12">
              <Button
                size="lg"
                onClick={handleGetBook}
                className="bg-bread-500 hover:bg-bread-600 text-white text-lg px-10 py-6"
              >
                <Download className="mr-2 h-5 w-5" />
                Get It — It's Free
              </Button>
            </div>

            {/* Divider */}
            <div className="border-t border-bread-700/30 my-8" />

            {/* Tip Jar */}
            <div className="text-center">
              <Coffee className="h-8 w-8 text-bread-400 mx-auto mb-3" />
              <h3 className="font-serif text-xl md:text-2xl font-bold text-bread-100 mb-3">
                Buy Me a Cup of Coffee
              </h3>
              <p className="text-bread-300 mb-8 max-w-lg mx-auto leading-relaxed text-sm">
                I've been giving this away for years. A lot of people have asked how
                they can say thank you. If you feel like it, this is how.
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
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default SourdoughBook;
