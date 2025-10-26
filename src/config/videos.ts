import Video1 from "../assets/videos/Video 1.mp4";
import Video2 from "../assets/videos/Video 2.mp4";
import Video3 from "../assets/videos/Video 3.mp4";
import Video4 from "../assets/videos/Video 4.mp4";
import Video5 from "../assets/videos/Video 5.mp4";
import Video6 from "../assets/videos/Video 6.mp4";

export type VideoVersion = "v1" | "v2";

export const VIDEO_VERSIONS: Record<VideoVersion, string[]> = {
  v1: [Video1, Video2, Video3],
  v2: [Video4, Video5, Video6],
};

export const getVideoForRound = (
  version: VideoVersion,
  roundNumber: number
): string => {
  const videos = VIDEO_VERSIONS[version];
  return videos[roundNumber - 1];
};
