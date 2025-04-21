
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Headphones, Play } from "lucide-react";

// NOTE: When you have a custom thumbnail, replace the string in "thumbnail" for that podcast.
const podcastLinks = [
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
    external: true
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
    external: true
    // Add thumbnail here if you have one for this episode!
  }
];

const PodcastLibrarySection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-[#fadfd5] dark:bg-bread-950/40" id="podcast-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto mb-8 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-medium mb-3">Bread Podcasts & Interviews</h2>
          <p className="text-muted-foreground dark:text-gray-300 text-lg">
            Explore baking podcasts, book discussions, and spooky specials with Henry Hunter and friends.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {podcastLinks.map((pod) => (
            <Card key={pod.id} className="overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-bread-100 overflow-hidden">
                {pod.type === "video" ? (
                  <iframe
                    src={pod.url.includes("youtube.com/embed") ? pod.url : `https://www.youtube.com/embed/${pod.url.split("youtu.be/")[1]?.split("?")[0]}`}
                    title={pod.title}
                    className="w-full h-full object-cover"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <img
                    src={
                      pod.thumbnail ||
                      "https://images.unsplash.com/photo-1582562124811-c09040d0a901?q=80&w=600"
                    }
                    alt={pod.title}
                    className="w-full h-full object-cover"
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
