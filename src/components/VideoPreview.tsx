import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface Props {
  src: string;
  className?: string;
}

export default function VideoPreview({ src, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);
        return () => hls.destroy();
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = src;
      }
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      autoPlay
      loop
      playsInline
    />
  );
}
