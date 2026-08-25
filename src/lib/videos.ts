import sample1 from "@/assets/sample-1.mp4.asset.json";
import sample2 from "@/assets/sample-2.mp4.asset.json";
import sample3 from "@/assets/sample-3.mp4.asset.json";
import sample4 from "@/assets/sample-4.mp4.asset.json";
import sample5 from "@/assets/sample-5.mp4.asset.json";
import sample6 from "@/assets/sample-6.mp4.asset.json";
import poster1 from "@/assets/sample-1-poster.jpg.asset.json";
import poster2 from "@/assets/sample-2-poster.jpg.asset.json";
import poster3 from "@/assets/sample-3-poster.jpg.asset.json";
import poster4 from "@/assets/sample-4-poster.jpg.asset.json";
import poster5 from "@/assets/sample-5-poster.jpg.asset.json";
import poster6 from "@/assets/sample-6-poster.jpg.asset.json";

export interface SampleVideo {
  src: string;
  poster: string;
}

export const sampleVideos: SampleVideo[] = [
  { src: sample1.url, poster: poster1.url },
  { src: sample2.url, poster: poster2.url },
  { src: sample3.url, poster: poster3.url },
  { src: sample4.url, poster: poster4.url },
  { src: sample5.url, poster: poster5.url },
  { src: sample6.url, poster: poster6.url },
];
