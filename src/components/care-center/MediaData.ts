import { MediaItem } from './MediaCard';

export const mediaItems: MediaItem[] = [
  {
    id: '11',
    title: 'May #FOOLPROOF Challenge - Sourdough Mastery',
    url: 'https://youtu.be/ma3lzqfV2dI?si=qjbuYgNfguR3eAvQ',
    type: 'video',
    source: 'YouTube',
    description: 'Join the May #FOOLPROOF Challenge and learn Henry\'s reliable technique for baking perfect sourdough every time.'
  },
  {
    id: '10',
    title: 'Henry Hunter on Life, the Universe, and Bread',
    url: 'https://youtu.be/49XtxfMlBgo?si=c2N_7FxIZsOsJXbS',
    type: 'podcast',
    source: 'The Jar Podcast',
    description: 'Meet Henry Hunter, founder of Henry\'s Bread Kitchen, as he shares his journey from farm kid to military guy to chef and bread maker. Henry discusses how meeting a Jewish baker changed his life and how he\'s now sharing his passion with the world.'
  },
  {
    id: '9',
    title: 'Chef My Life Podcast | EP. 1: Sourdough Superstar Henry Hunter Tells All!',
    url: 'https://youtu.be/sxp9kKA8si8?si=hVZmfGpcpgYeFg4L',
    type: 'podcast',
    source: 'Chef My Life Podcast',
    description: 'Henry Hunter shares his journey and expertise in sourdough baking in this engaging podcast episode.'
  },
  {
    id: '8',
    title: 'Holiday Breads: Celebrating Christmas & Hanukkah Traditions',
    url: 'https://youtu.be/sjBi05xW_PQ?si=3fdygdScC5iKsYBa',
    type: 'podcast',
    source: 'Breaking Bread',
    thumbnailUrl: '/lovable-uploads/ae3df0e4-d891-44f5-8916-70ce3f38d8e3.png',
    description: 'Exploring the rich and flavorful traditions of holiday breads across Christmas and Hanukkah celebrations.'
  },
  {
    id: '7',
    title: 'Bread at Halloween: Spooky Loaves and Traditions',
    url: 'https://youtu.be/QXGqj6Uaa2M?si=E1pDiPdEo4gJB9UF',
    type: 'video',
    source: 'YouTube',
    description: 'Explore the fascinating history and techniques behind Halloween-themed bread making traditions'
  },
  {
    id: '1',
    title: 'My Foolproof Sourdough Recipe: Start to Finish',
    url: 'https://youtu.be/ubJWmOAN684',
    type: 'video',
    source: 'YouTube',
    description: 'A comprehensive guide to making the perfect sourdough bread from start to finish'
  },
  {
    id: '2',
    title: 'Breaking Bread Podcast: Sourdough for the Rest of Us',
    url: 'https://youtu.be/FiQg8AaW7PE',
    description: 'Discussion about Henry\'s latest book "Sourdough for the Rest of Us"',
    type: 'podcast',
    source: 'Breaking Bread'
  },
  {
    id: '3',
    title: 'Henry Hunter on Life, the Universe, and Bread',
    url: 'https://youtu.be/49XtxfMlBgo',
    type: 'podcast',
    source: 'The Jar Podcast',
    description: 'A deep conversation about the philosophy of bread-making'
  },
  {
    id: '4',
    title: 'Henry Hunter on Bitterness and Mental Health',
    url: 'https://youtu.be/4BbpFdwUmM0',
    type: 'podcast',
    source: 'The Jar Podcast',
    description: 'A personal discussion about mental health in the baking industry'
  },
  {
    id: '5',
    title: 'Breaking Bread Podcast: Vitally Sourdough Mastery',
    url: 'https://youtu.be/VhyS_O5HAd0',
    type: 'podcast',
    source: 'Breaking Bread',
    description: 'Exploring the techniques and philosophy in Henry\'s book "Vitally Sourdough Mastery"'
  },
  {
    id: '6',
    title: 'Henry Hunter on Life, Bread, and the Universe - Part 2',
    url: 'https://youtu.be/49XtxfMlBgo',
    type: 'podcast',
    source: 'The Jar Podcast',
    description: 'Continuing the deep conversation about bread-making philosophy'
  }
];

export const getFilteredMedia = () => {
  const videos = mediaItems.filter(item => item.type === 'video');
  const podcasts = mediaItems.filter(item => item.type === 'podcast');
  
  const podcastsBySource = podcasts.reduce((acc, podcast) => {
    if (!acc[podcast.source]) {
      acc[podcast.source] = [];
    }
    acc[podcast.source].push(podcast);
    return acc;
  }, {} as Record<string, MediaItem[]>);

  return {
    allMedia: mediaItems,
    videos,
    podcasts,
    podcastsBySource
  };
};
