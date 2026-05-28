export interface BlogPost {
  id: string;
  title: string;
  content: string;
  summary: string;
  published: string;
  updated: string;
  imageUrl: string;
  link: string;
  categories: string[];
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface QurbanStats {
  cows: number;
  goats: number;
  shohibulCount: number;
  distributedPackages: number;
}
