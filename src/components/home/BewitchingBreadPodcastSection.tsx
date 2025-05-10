
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Play } from "lucide-react";

// NOTE: When you have a custom thumbnail, replace the string in "thumbnail" for that podcast.
const podcastLinks = [
  {
    id: 0,
    title: "May #FOOLPROOF Challenge",
    description:
      "Join the May #FOOLPROOF Challenge and learn Henry's reliable technique for baking perfect sourdough every time.",
    url: "https://youtu.be/ma3lzqfV2dI?si=qjbuYgNfguR3eAvQ",
    type: "video",
    external: true,
    thumbnail: "https://img.youtube.com/vi/ma3lzqfV2dI/mqdefault.jpg"
  },
  {
    id: 1,
    title: "The Bewitching Bread Podcast (Halloween Breads Special)",
    description:
      "A spooky special exploring Halloween breads and traditions. Watch the episode directly.",
    url: "https://www.youtube.com/embed/QXGqj6Uaa2M?rel=0",
    type: "video",
    external: true,
    thumbnail: "https://img.youtube.com/vi/QXGqj6Uaa2M/mqdefault.jpg"
  },
  {
    id: 2,
    title: "Baking and Breaking Bread with Henry Hunter (The Jar Podcast Ep. 196)",
    description:
      "Henry Hunter discusses bread and life on The Jar Podcast. Listen on Amazon Music.",
    url: "https://music.amazon.com/podcasts/f9fde8f1-bbf4-43d8-9b29-94a0110bf893/episodes/b23cc003-0252-475d-a20c-ec8f29389037/the-jar-196-breaking-and-baking-bread-with-henry-hunter",
    type: "podcast",
    external: true,
    thumbnail: "/lovable-uploads/aea66c15-a5dd-4764-8307-7cf7825fe868.png"
  },
  {
    id: 3,
    title:
      "Chef My Life Podcast with Sourdough Superstar Henry Hunter (Hosted by Chef Dave Palmer)",
    description:
      "A deep dive with Henry Hunter into the world of sourdough. Watch on YouTube.",
    url: "https://youtu.be/sxp9kKA8si8",
    type: "video",
    external: true,
    thumbnail: "https://img.youtube.com/vi/sxp9kKA8si8/mqdefault.jpg"
  },
  {
    id: 4,
    title:
      "The Breaking Bread Podcast: Sourdough for the Rest of Us — Book Review",
    description:
      "Book review and discussion for 'Sourdough for the Rest of Us' by Henry Hunter.",
    url: "https://youtu.be/FiQg8AaW7PE?si=YjJIoJ-XluvrzAsD",
    type: "podcast",
    external: true,
    thumbnail: "https://img.youtube.com/vi/FiQg8AaW7PE/mqdefault.jpg"
  },
  {
    id: 5,
    title: "The Breaking Bread Podcast: The Loaf and the Lie — Book Review",
    description:
      "Book review and thoughts on 'The Loaf and the Lie' by Henry Hunter.",
    url: "https://drive.google.com/file/d/1IfipjgIGC9rjbGp_1tNi-z6hov6MkvG1/view?usp=sharing",
    type: "podcast",
    external: true,
    thumbnail: "/lovable-uploads/c9d4e40b-95a2-420d-b85e-90a415e9fdbc.png"
  },
  {
    id: 6,
    title: "Beyond the Crust: A Conversation with Henry Hunter",
    description:
      "In this episode of The Jar podcast, Henry Hunter shares his journey from the world of bread baking to deeper reflections on life, community, and personal growth. Dive into a heartfelt conversation that goes beyond the kitchen, exploring the stories and experiences that have shaped his path.",
    url: "https://youtu.be/49XtxfMlBgo?si=8tQWLc0JeWP8lnId",
    type: "podcast",
    external: true,
    thumbnail: "/lovable-uploads/5c3a2bce-54f1-443f-a5b6-17e30dbf9e4f.png"
  }
];

const PodcastLibrarySection: React.FC = () => {
  // Helper function to get YouTube video ID from various URL formats
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url.includes('youtu')) return null;
    
    // Handle multiple YouTube URL formats
    let videoId = null;
    
    // For youtu.be format
    if (url.includes('youtu.be')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    } 
    // For youtube.com/embed format
    else if (url.includes('youtube.com/embed')) {
      const parts = url.split('/');
      videoId = parts[parts.length - 1].split('?')[0];
    }
    // For youtube.com/watch?v= format
    else if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v');
    }
    
    return videoId;
  };

  // Function to determine the image URL with multiple fallback options
  const getImageUrl = (pod: typeof podcastLinks[0]): string => {
    // If thumbnail is already a valid URL or path, use it
    if (pod.thumbnail) {
      // If it's already a full URL or an asset path, return it as is
      if (pod.thumbnail.startsWith('http') || pod.thumbnail.startsWith('/')) {
        return pod.thumbnail;
      }
    }
    
    // For YouTube videos, generate thumbnail URL
    if (pod.url.includes('youtu')) {
      const videoId = getYouTubeVideoId(pod.url);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
      }
    }
    
    // Fallback to a default image
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop";
  };

  return (
    <section className="py-16 md:py-24 bg-[#fadfd5] dark:bg-bread-950/40" id="podcast-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-3">Henry Hunter on Air</h2>
          <p className="text-muted-foreground dark:text-gray-300 text-lg">
            Explore baking podcasts, book discussions, and spooky specials with Henry Hunter and friends.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcastLinks.map((pod) => (
            <Card key={pod.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-bread-100 overflow-hidden">
                {pod.type === "video" ? (
                  <img
                    src={getImageUrl(pod)}
                    alt={pod.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if loading fails
                      e.currentTarget.src = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                ) : (
                  <img
                    src={getImageUrl(pod)}
                    alt={pod.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback image if loading fails
                      e.currentTarget.src = "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop";
                    }}
                  />
                )}
                <div className="absolute top-2 left-2 bg-white/90 rounded-full p-2 shadow">
                  {pod.type === "video" ? (
                    <Play className="h-5 w-5 text-bread-800" />
                  ) : (
                    <Headphones className="h-5 w-5 text-bread-800" />
                  )}
                </div>
              </div>
              <CardContent className="flex-1 flex flex-col p-4">
                <h3 className="font-serif font-medium text-lg mb-2">{pod.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{pod.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-bread-200 text-bread-800 hover:bg-bread-50 mt-auto"
                  asChild
                >
                  <a href={pod.url} target="_blank" rel="noopener noreferrer">
                    {pod.type === "video" ? "Watch Episode" : "Listen Now"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PodcastLibrarySection;
